'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[200px] p-8 bg-white/[0.02] border border-white/10 rounded-2xl">
          <div className="text-center">
            <p className="text-[#34d399] font-bebas text-2xl mb-2">Something went wrong</p>
            <p className="text-white/50 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
