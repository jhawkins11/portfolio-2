// src/components/ErrorBoundary.tsx
'use client' // Error Boundaries must be Client Components

import React, { ErrorInfo } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

// Fallback component to display when an error is caught
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Log the error to the console for debugging during development
  // In production, you'd likely send this to an error reporting service (e.g., Sentry)
  console.error('Render Error Caught:', error)

  return (
    <div
      role='alert'
      className='fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-background p-8 text-center'
    >
      <FiAlertTriangle className='w-16 h-16 text-error mb-6' />
      <h2 className='text-2xl font-bold text-foreground mb-4'>
        Oops! Something went wrong.
      </h2>
      <p className='text-muted-foreground mb-6 max-w-md'>
        We encountered an unexpected error while rendering this part of the
        page. You can try refreshing or clicking the button below.
      </p>
      {/* Optionally display error details during development */}
      {process.env.NODE_ENV === 'development' && (
        <pre className='mb-6 max-w-full overflow-auto rounded bg-muted p-4 text-left text-xs text-error'>
          {error.message}
          {'\n\n'}
          {error.stack}
        </pre>
      )}
      <button
        onClick={resetErrorBoundary} // Attempt to reset the component tree state
        className='inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      >
        <FiRefreshCw className='mr-2 h-4 w-4' />
        Try Again
      </button>
    </div>
  )
}

// Main Error Boundary component to wrap parts of your app
export default function AppErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const handleGlobalError = (error: Error, info: ErrorInfo) => {
    console.error('ErrorBoundary caught an error:', error, info.componentStack)
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleGlobalError}
      // You can optionally add onReset logic here if needed
      // onReset={(details) => {
      //   // Reset the state of your app so the error doesn't happen again
      // }}
    >
      {children}
    </ErrorBoundary>
  )
}
