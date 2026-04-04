/**
 * Stitches public/sequence/frame_*.png into one atlas.webp + atlas.json
 * so the hero loads 2 files instead of many HTTP requests.
 *
 * Uses a grid (not one long row) so the image stays within WebP limits (~16383px/side).
 *
 * Usage: npm run build:atlas
 * Requires: npm i -D sharp
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const seqDir = path.join(root, 'public', 'sequence')

/** libwebp / WebP practical max edge (horizontal strip of 175 HD frames would exceed this). */
const MAX_EDGE = 16383

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error(
    'Missing dependency: run  npm i -D sharp  (native build; use Node LTS on Windows/macOS/Linux).',
  )
  process.exit(1)
}

const frameRe = /^frame_(\d+)_delay-.*\.png$/i

function computeGrid(n, fw, fh) {
  let cols = Math.min(n, Math.max(1, Math.floor(MAX_EDGE / fw)))
  let rows = Math.ceil(n / cols)
  while (rows * fh > MAX_EDGE && cols < n) {
    cols += 1
    rows = Math.ceil(n / cols)
  }
  if (cols * fw > MAX_EDGE || rows * fh > MAX_EDGE) {
    throw new Error(
      `Single frame ${fw}×${fh} × ${n} frames cannot fit in a ${MAX_EDGE}px WebP atlas. Scale frames down or split into multiple atlases.`,
    )
  }
  return { cols, rows }
}

async function main() {
  let names
  try {
    names = await fs.readdir(seqDir)
  } catch {
    console.error('No folder public/sequence — add PNG frames first.')
    process.exit(1)
  }

  const frames = names
    .filter((n) => frameRe.test(n) && !/^atlas\./i.test(n))
    .sort((a, b) => {
      const na = Number(a.match(frameRe)[1])
      const nb = Number(b.match(frameRe)[1])
      return na - nb
    })

  if (frames.length === 0) {
    console.error('No frame_*.png files in public/sequence')
    process.exit(1)
  }

  const firstPath = path.join(seqDir, frames[0])
  const { width: fw, height: fh } = await sharp(firstPath).metadata()
  if (!fw || !fh) {
    console.error('Could not read dimensions from', frames[0])
    process.exit(1)
  }

  const { cols, rows } = computeGrid(frames.length, fw, fh)
  const atlasW = cols * fw
  const atlasH = rows * fh

  const composites = await Promise.all(
    frames.map(async (name, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return {
        input: await fs.readFile(path.join(seqDir, name)),
        left: col * fw,
        top: row * fh,
      }
    }),
  )

  await sharp({
    create: {
      width: atlasW,
      height: atlasH,
      channels: 3,
      background: { r: 18, g: 18, b: 18 },
    },
  })
    .composite(composites)
    .webp({ quality: 82, effort: 4 })
    .toFile(path.join(seqDir, 'atlas.webp'))

  const meta = {
    version: 2,
    image: 'atlas.webp',
    layout: 'grid',
    cols,
    frameCount: frames.length,
    frameWidth: fw,
    frameHeight: fh,
  }

  await fs.writeFile(path.join(seqDir, 'atlas.json'), JSON.stringify(meta, null, 2), 'utf8')

  console.log(
    `Wrote atlas.webp (${atlasW}×${atlasH}, ${cols}×${rows} grid) + atlas.json (${frames.length} frames @ ${fw}×${fh}).`,
  )
}

await main()
