import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactSection from './ContactSection'

describe('<ContactSection /> Integration Tests', () => {
  const mockFetch = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    const intersectionObserverMock = vi.fn(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn(),
    }))
    vi.stubGlobal('IntersectionObserver', intersectionObserverMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: 'Test Subject' },
    })
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'This is a valid test message.' },
    })
  }

  it('renders the contact form correctly', () => {
    render(<ContactSection />)
    expect(
      screen.getByRole('heading', { name: /Send Me a Message/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Send Message/i })
    ).toBeInTheDocument()
  })

  it('allows typing into form fields', () => {
    render(<ContactSection />)
    fillForm()
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User')
    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com')
    expect(screen.getByLabelText(/Subject/i)).toHaveValue('Test Subject')
    expect(screen.getByLabelText(/Message/i)).toHaveValue(
      'This is a valid test message.'
    )
  })

  it('submits the form successfully and clears fields', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: 'Email sent successfully' }),
    })

    render(<ContactSection />)
    fillForm()
    const submitButton = screen.getByRole('button', { name: /Send Message/i })

    expect(submitButton).toBeEnabled() // Check initial state
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/Sending.../i)).toBeInTheDocument()

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))

    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a valid test message.',
      }),
    })

    expect(
      await screen.findByText(/Thank you for your message!/i)
    ).toBeInTheDocument()
  })

  it('displays validation error from API response', async () => {
    const errorMsg = 'Invalid email address'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Invalid form data provided.',
        issues: { email: [errorMsg] },
      }),
    })

    render(<ContactSection />)
    fillForm()
    const submitButton = screen.getByRole('button', { name: /Send Message/i })
    fireEvent.click(submitButton)

    expect(
      await screen.findByText(/Invalid form data provided./i)
    ).toBeInTheDocument()
    await waitFor(() => expect(submitButton).toBeEnabled())

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User')
  })

  it('displays server error and fallback message from API response', async () => {
    const errorMsg = 'Unable to send email at this time'
    const fallbackMsg = 'Please contact directly at admin@example.com'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: errorMsg,
        fallback: true,
        fallbackMessage: fallbackMsg,
      }),
    })

    render(<ContactSection />)
    fillForm()
    const submitButton = screen.getByRole('button', { name: /Send Message/i })
    fireEvent.click(submitButton)

    expect(await screen.findByText(errorMsg)).toBeInTheDocument()
    expect(await screen.findByText(fallbackMsg)).toBeInTheDocument()
    await waitFor(() => expect(submitButton).toBeEnabled())

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User')
  })

  it('displays generic error message on network failure', async () => {
    const errorMsg = 'Network request failed'
    mockFetch.mockRejectedValueOnce(new Error(errorMsg))

    render(<ContactSection />)
    fillForm()
    const submitButton = screen.getByRole('button', { name: /Send Message/i })
    fireEvent.click(submitButton)

    expect(await screen.findByText(errorMsg)).toBeInTheDocument()
    await waitFor(() => expect(submitButton).toBeEnabled())
  })
})
