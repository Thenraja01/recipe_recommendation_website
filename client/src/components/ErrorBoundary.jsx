import { Component } from 'react'
import { Button } from './ui/button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <div className="text-6xl">🍳</div>
          <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
          <p className="text-gray-500 text-center max-w-md">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            Refresh Page
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
