'use client'

import React, { Component, ReactNode } from 'react'
import HeroCanvas from './HeroCanvas'

interface State {
  hasError: boolean
}

class HeroCanvasWrapper extends Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HeroCanvas error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return null // Falls back to the gradient background in Hero component
    }

    return <HeroCanvas />
  }
}

export default HeroCanvasWrapper
