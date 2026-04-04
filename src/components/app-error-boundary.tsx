import { Component, type ErrorInfo, type ReactNode } from 'react'

export type AppErrorBoundaryProps = {
  children: ReactNode
  onReactError: (error: Error, errorInfo: ErrorInfo) => void
  onRegisterReset: (reset: (() => void) | null) => void
}

type State = { hasError: boolean }

/**
 * Catches React render errors and reports them upward. Renders a minimal
 * fallback so the broken subtree is not re-mounted until reset.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, State> {
  state: State = { hasError: false }

  private clearError = () => {
    this.setState({ hasError: false })
  }

  override componentDidMount() {
    this.props.onRegisterReset(this.clearError)
  }

  override componentWillUnmount() {
    this.props.onRegisterReset(null)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onReactError(error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh w-full items-center justify-center bg-background px-6">
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            This view hit an error. Check the dialog — you can try again from there if the option
            appears.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
