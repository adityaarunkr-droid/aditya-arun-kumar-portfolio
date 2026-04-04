/**
 * Removes Vite's pre-bundled deps cache (fixes "Outdated Optimize Dep" / 504 on deps).
 * Run: npm run clean:vite
 */
import { rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const viteCache = join(root, 'node_modules', '.vite')

if (existsSync(viteCache)) {
  rmSync(viteCache, { recursive: true, force: true })
  console.log('Removed node_modules/.vite')
} else {
  console.log('No node_modules/.vite to remove')
}
