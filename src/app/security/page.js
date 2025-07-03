'use client'

import React from 'react'
import SecurityExamplesPage from '../examples/SecurityExamplesPage'
import { ErrorBoundary } from '../examples/ErrorBoundary'

export default function SecurityPage() {
  return (
    <ErrorBoundary>
      <SecurityExamplesPage />
    </ErrorBoundary>
  )
}