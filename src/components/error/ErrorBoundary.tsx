'use client';

import React, { ErrorInfo } from 'react';
import { Frown } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8] flex items-center justify-center'
          data-testid='error-boundary-root'
        >
          <div
            className='text-center p-8 bg-white rounded-lg shadow-md border border-[#E3BAB3]'
            data-testid='error-boundary-card'
          >
            <Frown className='w-16 h-16 text-[#800020] mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-[#800020] mb-4'>
              Something went wrong
            </h2>
            <p className='text-[#4A4A4A] mb-6'>
              We encountered an unexpected error. Please try again later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className='rounded bg-[#800020] px-4 py-2 text-[#E3BAB3] hover:bg-[#a36c53] transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
