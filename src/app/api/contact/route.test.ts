import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from './route'

const mockSendMail = vi.fn()
const mockVerify = vi.fn()

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
      verify: mockVerify,
    })),
  },
}))

// Helper to create mock NextRequest objects

function createMockRequest(
  body: Record<string, unknown>,
  ip?: string
): NextRequest {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (ip) {
    headers.set('x-forwarded-for', ip)
  }
  const url = new URL('http://localhost/api/contact')
  return new NextRequest(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
}

describe('/api/contact Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockVerify.mockResolvedValue(true)
    mockSendMail.mockResolvedValue({ messageId: 'test-id' })
  })

  describe('POST', () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message longer than ten characters.',
    }

    it('should send email successfully with valid data', async () => {
      const request = createMockRequest(validData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.message).toBe('Email sent successfully')
      expect(mockVerify).toHaveBeenCalledTimes(1)
      expect(mockSendMail).toHaveBeenCalledTimes(1)
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: process.env.CONTACT_TO_EMAIL || 'josiah.c.hawkins@gmail.com',
          replyTo: validData.email,
          subject: expect.stringContaining(validData.subject),
          text: expect.stringContaining(validData.message),
          html: expect.stringContaining(validData.message),
        })
      )
    })

    it('should return 400 for missing required fields', async () => {
      const invalidData = { ...validData, email: '' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.email).toBeDefined()
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid email format', async () => {
      const invalidData = { ...validData, email: 'not-an-email' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.email).toContain('Invalid email address')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for message too short', async () => {
      const invalidData = { ...validData, message: 'short' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.message?.[0]).toContain('at least 10 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 500 if nodemailer verify fails', async () => {
      mockVerify.mockRejectedValueOnce(new Error('SMTP Connection Error'))
      const request = createMockRequest(validData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body.error).toBe('Email service configuration error')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 500 and fallback message if sendMail fails', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('Failed to send'))
      const request = createMockRequest(validData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body.error).toBe('Unable to send email at this time')
      expect(body.fallback).toBe(true)
      expect(body.fallbackMessage).toBeDefined()
    })

    it('should return 429 if rate limit is exceeded', async () => {
      const ip = '192.168.1.100'
      const maxRequests = 2
      let response

      // Simulate exceeding the limit
      for (let i = 0; i < maxRequests + 1; i++) {
        const request = createMockRequest(validData, ip)
        response = await POST(request)
        if (response?.status === 429) break
      }

      expect(response?.status).toBe(429)
      const body = await response?.json()
      expect(body.error).toContain('Too many requests')
      expect(mockSendMail).toHaveBeenCalledTimes(maxRequests)
    })
  })

  describe('GET', () => {
    it('should return 405 Method Not Allowed', async () => {
      const response = await GET()
      const body = await response.json()

      expect(response.status).toBe(405)
      expect(body.error).toBe('Method not allowed')
    })
  })
})
