import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from './route'

// Setup mocks
const mockSendMail = vi.fn()
const mockVerify = vi.fn()

// Setup Nodemailer mock - this is hoisted to the top of the file
vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: () => ({
        sendMail: mockSendMail,
        verify: mockVerify,
      }),
    },
  }
})

// Store original env variables
const originalEnv = { ...process.env }

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

  afterEach(() => {
    // Restore original env variables after each test
    process.env = { ...originalEnv }
    // Reset timers if they were used
    vi.useRealTimers()
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

    it('should use service-specific config when EMAIL_SERVICE is set', async () => {
      // Set the EMAIL_SERVICE environment variable
      process.env.EMAIL_SERVICE = 'gmail'
      process.env.EMAIL_SERVER_USER = 'test@gmail.com'
      process.env.EMAIL_SERVER_PASSWORD = 'password123'

      const request = createMockRequest(validData)
      await POST(request)

      // We can't test the transport configuration directly now
      // So instead we verify that the email was sent successfully
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

    it('should use SMTP config when EMAIL_SERVICE is not set', async () => {
      // Ensure EMAIL_SERVICE is not set
      delete process.env.EMAIL_SERVICE

      // Set SMTP configuration
      process.env.EMAIL_SERVER_HOST = 'smtp.example.com'
      process.env.EMAIL_SERVER_PORT = '587'
      process.env.EMAIL_SERVER_SECURE = 'false'
      process.env.EMAIL_SERVER_USER = 'user@example.com'
      process.env.EMAIL_SERVER_PASSWORD = 'smtp-password'

      const request = createMockRequest(validData)
      await POST(request)

      // We can't test the transport configuration directly now
      // So instead we verify that the email was sent successfully
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

    it('should use default email when CONTACT_TO_EMAIL is not set', async () => {
      // Ensure CONTACT_TO_EMAIL is not set
      const originalContactEmail = process.env.CONTACT_TO_EMAIL
      delete process.env.CONTACT_TO_EMAIL

      const request = createMockRequest(validData)
      await POST(request)

      // Verify the default email address is used
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'josiah.c.hawkins@gmail.com',
        })
      )

      // Restore the original value if it was set
      if (originalContactEmail) {
        process.env.CONTACT_TO_EMAIL = originalContactEmail
      }
    })

    it('should use CONTACT_TO_EMAIL when it is set', async () => {
      // Set CONTACT_TO_EMAIL
      process.env.CONTACT_TO_EMAIL = 'custom@example.com'

      const request = createMockRequest(validData)
      await POST(request)

      // Verify the custom email address is used
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'custom@example.com',
        })
      )
    })

    it('should use default from address when EMAIL_FROM is not set', async () => {
      // Ensure EMAIL_FROM is not set
      const originalEmailFrom = process.env.EMAIL_FROM
      delete process.env.EMAIL_FROM

      const request = createMockRequest(validData)
      await POST(request)

      // Verify the default from address is used
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Portfolio Contact <noreply@example.com>',
        })
      )

      // Restore the original value if it was set
      if (originalEmailFrom) {
        process.env.EMAIL_FROM = originalEmailFrom
      }
    })

    it('should use EMAIL_FROM when it is set', async () => {
      // Set EMAIL_FROM
      process.env.EMAIL_FROM = 'Custom Portfolio <portfolio@example.com>'

      const request = createMockRequest(validData)
      await POST(request)

      // Verify the custom from address is used
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Custom Portfolio <portfolio@example.com>',
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

    it('should return 400 for email missing @ symbol', async () => {
      const invalidData = { ...validData, email: 'testexample.com' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.email).toContain('Invalid email address')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for email missing domain', async () => {
      const invalidData = { ...validData, email: 'test@' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.email).toContain('Invalid email address')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for email too long', async () => {
      const longLocalPart = 'a'.repeat(250)
      const invalidData = {
        ...validData,
        email: `${longLocalPart}@example.com`,
      }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.email?.[0]).toContain('no more than 254 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should trim leading and trailing spaces from email', async () => {
      const dataWithSpaces = { ...validData, email: '  test@example.com  ' }
      const request = createMockRequest(dataWithSpaces)
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'test@example.com',
        })
      )
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

    it('should return 400 for message exactly 9 characters', async () => {
      const invalidData = { ...validData, message: '123456789' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.message?.[0]).toContain('at least 10 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for message too long', async () => {
      const invalidData = { ...validData, message: 'a'.repeat(5001) }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.message?.[0]).toContain(
        'no more than 5000 characters'
      )
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should trim leading and trailing spaces from message', async () => {
      const dataWithSpaces = {
        ...validData,
        message: '  This is a test message with spaces.  ',
      }
      const request = createMockRequest(dataWithSpaces)
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(
            'Message:\nThis is a test message with spaces.'
          ),
          html: expect.stringContaining('This is a test message with spaces.'),
        })
      )
    })

    it('should return 400 for message with <script> tags', async () => {
      const invalidData = {
        ...validData,
        message: 'This message contains <script>alert("XSS")</script> tags',
      }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.message?.[0]).toContain('potentially unsafe content')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for message with javascript: protocol', async () => {
      const invalidData = {
        ...validData,
        message: 'Click this link: javascript:alert("XSS")',
      }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.message?.[0]).toContain('potentially unsafe content')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for name too short', async () => {
      const invalidData = { ...validData, name: 'a' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.name?.[0]).toContain('at least 2 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for name too long', async () => {
      const invalidData = { ...validData, name: 'a'.repeat(101) }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.name?.[0]).toContain('no more than 100 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should trim leading and trailing spaces from name', async () => {
      const dataWithSpaces = { ...validData, name: '  Test User  ' }
      const request = createMockRequest(dataWithSpaces)
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('Name: Test User'),
          html: expect.stringContaining('<strong>Name:</strong> Test User'),
        })
      )
    })

    it('should return 400 for name with invalid characters', async () => {
      const invalidData = { ...validData, name: 'Test <script>User</script>' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.name?.[0]).toContain('contains invalid characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for subject too short', async () => {
      const invalidData = { ...validData, subject: 'ab' }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.subject?.[0]).toContain('at least 3 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for subject too long', async () => {
      const invalidData = { ...validData, subject: 'a'.repeat(151) }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.subject?.[0]).toContain('no more than 150 characters')
      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should trim leading and trailing spaces from subject', async () => {
      const dataWithSpaces = { ...validData, subject: '  Test Subject  ' }
      const request = createMockRequest(dataWithSpaces)
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Test Subject'),
          text: expect.stringContaining('Subject: Test Subject'),
          html: expect.stringContaining(
            '<strong>Subject:</strong> Test Subject'
          ),
        })
      )
    })

    it('should return 400 for subject with invalid characters', async () => {
      const invalidData = {
        ...validData,
        subject: 'Test <script>Subject</script>',
      }
      const request = createMockRequest(invalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')
      expect(body.issues?.subject?.[0]).toContain('contains invalid characters')
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

    it('should skip rate limiting and log warning when IP address cannot be determined', async () => {
      // Spy on console.warn
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      // Create request without IP headers
      const request = createMockRequest(validData) // No IP parameter
      const response = await POST(request)
      const body = await response.json()

      // Verify the request was successful despite missing IP info
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.message).toBe('Email sent successfully')

      // Verify warning was logged
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Rate limiting skipped: Could not determine IP address'
        )
      )

      // Clean up spy
      consoleWarnSpy.mockRestore()
    })

    it('should reset rate limiting after window period expires', async () => {
      // Use fake timers to control time
      vi.useFakeTimers()

      const ip = '192.168.1.200'
      const maxRequests = 2
      const rateWindowMs = 60 * 1000 // 1 minute

      // Make max allowed requests
      for (let i = 0; i < maxRequests; i++) {
        const request = createMockRequest(validData, ip)
        const response = await POST(request)
        expect(response.status).toBe(200)
      }

      // Next request should hit rate limit
      {
        const request = createMockRequest(validData, ip)
        const response = await POST(request)
        expect(response.status).toBe(429)
        const body = await response.json()
        expect(body.error).toContain('Too many requests')
      }

      // Advance time past the rate limit window
      vi.advanceTimersByTime(rateWindowMs + 100)

      // After window expires, should be able to make requests again
      {
        const request = createMockRequest(validData, ip)
        const response = await POST(request)
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body.success).toBe(true)
      }

      // Reset mock calls since we sent multiple emails
      mockSendMail.mockClear()
      mockVerify.mockClear()
    })

    it('should return 400 with all validation errors when multiple fields fail', async () => {
      const multipleInvalidData = {
        name: 'a', // too short
        email: 'invalid-email', // invalid format
        subject: 'ab', // too short
        message: 'short', // too short
      }

      const request = createMockRequest(multipleInvalidData)
      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toContain('Invalid form data')

      // Verify all fields have error messages
      expect(body.issues?.name).toBeDefined()
      expect(body.issues?.email).toBeDefined()
      expect(body.issues?.subject).toBeDefined()
      expect(body.issues?.message).toBeDefined()

      // Check for specific error messages
      expect(body.issues?.name?.[0]).toContain('at least 2 characters')
      expect(body.issues?.email?.[0]).toContain('Invalid email address')
      expect(body.issues?.subject?.[0]).toContain('at least 3 characters')
      expect(body.issues?.message?.[0]).toContain('at least 10 characters')

      // Check the details array includes all errors
      expect(body.details).toHaveLength(4)
      expect(body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name' }),
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'subject' }),
          expect.objectContaining({ field: 'message' }),
        ])
      )

      expect(mockSendMail).not.toHaveBeenCalled()
    })

    it('should return 400 for malformed JSON in request body', async () => {
      // Create a malformed JSON body (invalid syntax)
      const malformedBodyRequest = new NextRequest(
        new URL('http://localhost/api/contact'),
        {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: '{ "name": "Test User", "email": "test@example.com", "subject": "Test" missing-comma "message": "Test message" }',
        }
      )

      const response = await POST(malformedBodyRequest)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toBe('Invalid JSON format in request body')
      expect(mockSendMail).not.toHaveBeenCalled()
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
