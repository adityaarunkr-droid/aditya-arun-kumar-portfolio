import * as React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ErrorInfo } from 'react'
import { Dialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { AlertTriangle, X } from 'lucide-react'

import { AppErrorBoundary } from '@/components/app-error-boundary'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ErrorOverlayPayload = {
  title: string
  message: string
  detail?: string
  source?: 'react' | 'window' | 'unhandledrejection' | 'manual'
}

type ErrorOverlayContextValue = {
  reportError: (
    error: unknown,
    meta?: { componentStack?: string; source?: ErrorOverlayPayload['source'] },
  ) => void
  showError: (payload: Omit<ErrorOverlayPayload, 'detail'> & { detail?: string }) => void
  close: () => void
  resetBoundary: () => void
}

const ErrorOverlayContext = createContext<ErrorOverlayContextValue | null>(null)

export const ERROR_OVERLAY_DEFAULT_TITLE = 'Something went wrong'

function normalizeUnknown(error: unknown, fallbackMessage: string): { message: string; detail?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || fallbackMessage,
      detail: error.stack,
    }
  }
  if (typeof error === 'string') {
    return { message: error }
  }
  try {
    return { message: JSON.stringify(error) }
  } catch {
    return { message: fallbackMessage }
  }
}

function ErrorOverlayDialog({
  open,
  payload,
  onClose,
  onTryAgain,
}: {
  open: boolean
  payload: ErrorOverlayPayload | null
  onClose: () => void
  onTryAgain: () => void
}) {
  const isDev = import.meta.env.DEV
  const showDetail = Boolean(payload?.detail && isDev)

  const handleOpenChange = useCallback(
    (d: { open: boolean }) => {
      if (!d.open) onClose()
    },
    [onClose],
  )

  const handleTryAgain = useCallback(() => {
    onTryAgain()
    onClose()
  }, [onTryAgain, onClose])

  if (!payload) return null

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      closeOnEscape
      closeOnInteractOutside
      modal
      preventScroll
      role="alertdialog"
    >
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[12000] bg-black/60 backdrop-blur-[2px]" />
        <Dialog.Positioner className="fixed inset-0 z-[12001] flex items-center justify-center p-4 sm:p-6">
          <Dialog.Content
            className={cn(
              'w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl outline-none',
              'dark:border-white/10 dark:bg-zinc-950',
            )}
          >
            <div className="error-overlay-dialog-enter">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
                  aria-hidden
                >
                  <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {payload.title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {payload.message}
                  </Dialog.Description>
                  {showDetail && (
                    <pre
                      className="mt-3 max-h-40 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left text-xs text-zinc-700 dark:border-white/10 dark:bg-black/40 dark:text-zinc-300"
                      tabIndex={0}
                    >
                      {payload.detail}
                    </pre>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {payload.source === 'react' && (
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleTryAgain}>
                    Try again
                  </Button>
                )}
                <Dialog.CloseTrigger asChild>
                  <Button type="button" variant="default" className="w-full gap-2 sm:w-auto">
                    <X className="h-4 w-4" aria-hidden />
                    Dismiss
                  </Button>
                </Dialog.CloseTrigger>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export function ErrorOverlayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState<ErrorOverlayPayload | null>(null)
  const boundaryResetRef = useRef<(() => void) | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setPayload(null)
  }, [])

  const registerBoundaryReset = useCallback((fn: (() => void) | null) => {
    boundaryResetRef.current = fn
  }, [])

  const resetBoundary = useCallback(() => {
    boundaryResetRef.current?.()
  }, [])

  const openWithPayload = useCallback((next: ErrorOverlayPayload) => {
    setPayload(next)
    setOpen(true)
  }, [])

  const reportError = useCallback(
    (error: unknown, meta?: { componentStack?: string; source?: ErrorOverlayPayload['source'] }) => {
      const { message, detail } = normalizeUnknown(error, 'An unexpected error occurred.')
      const parts = [detail, meta?.componentStack].filter(Boolean).join('\n\n---\n\n')
      openWithPayload({
        title: ERROR_OVERLAY_DEFAULT_TITLE,
        message,
        detail: parts || undefined,
        source: meta?.source ?? 'window',
      })
    },
    [openWithPayload],
  )

  const reportReactError = useCallback(
    (error: Error, info: ErrorInfo) => {
      const { message, detail } = normalizeUnknown(error, 'An unexpected error occurred.')
      const parts = [detail, info.componentStack].filter(Boolean).join('\n\n---\n\n')
      openWithPayload({
        title: ERROR_OVERLAY_DEFAULT_TITLE,
        message,
        detail: parts || undefined,
        source: 'react',
      })
    },
    [openWithPayload],
  )

  const showError = useCallback(
    (p: Omit<ErrorOverlayPayload, 'detail'> & { detail?: string }) => {
      openWithPayload({
        title: p.title,
        message: p.message,
        detail: p.detail,
        source: p.source ?? 'manual',
      })
    },
    [openWithPayload],
  )

  useEffect(() => {
    const onWindowError = (event: ErrorEvent) => {
      event.preventDefault()
      reportError(event.error ?? new Error(event.message), { source: 'window' })
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      reportError(event.reason, { source: 'unhandledrejection' })
    }
    window.addEventListener('error', onWindowError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onWindowError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [reportError])

  const value = useMemo(
    () => ({
      reportError,
      showError,
      close,
      resetBoundary,
    }),
    [reportError, showError, close, resetBoundary],
  )

  return (
    <ErrorOverlayContext.Provider value={value}>
      <AppErrorBoundary onReactError={reportReactError} onRegisterReset={registerBoundaryReset}>
        {children}
      </AppErrorBoundary>
      <ErrorOverlayDialog open={open} payload={payload} onClose={close} onTryAgain={resetBoundary} />
    </ErrorOverlayContext.Provider>
  )
}

export function useErrorOverlay() {
  const ctx = useContext(ErrorOverlayContext)
  if (!ctx) {
    throw new Error('useErrorOverlay must be used within ErrorOverlayProvider')
  }
  return ctx
}
