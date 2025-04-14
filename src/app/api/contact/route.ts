import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Rate Limiting Setup
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 2 // Max 2 requests per window per IP

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must be no more than 100 characters' })
    .refine((val) => !/[<>]/.test(val), {
      message: 'Name contains invalid characters',
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(254, { message: 'Email must be no more than 254 characters' }),
  subject: z
    .string()
    .trim()
    .min(3, { message: 'Subject must be at least 3 characters long' })
    .max(150, { message: 'Subject must be no more than 150 characters' })
    .refine((val) => !/[<>]/.test(val), {
      message: 'Subject contains invalid characters',
    }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(5000, { message: 'Message must be no more than 5000 characters' })
    .refine((val) => !/(<script|javascript:)/i.test(val), {
      message: 'Message contains potentially unsafe content',
    }),
})

export async function POST(request: NextRequest) {
  // --- Apply Rate Limiting ---
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (ip !== 'unknown') {
    const now = Date.now()
    const record = ipRequestCounts.get(ip)

    if (record) {
      // Check if the time window has passed
      if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
        // Reset count if window expired
        ipRequestCounts.set(ip, { count: 1, timestamp: now })
      } else {
        // Increment count if within window
        record.count++
        // Check if limit exceeded
        if (record.count > RATE_LIMIT_MAX_REQUESTS) {
          console.warn(`Rate limit exceeded for IP: ${ip}`)
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          )
        }
        // Update the record (count incremented, timestamp remains the start of the window)
        ipRequestCounts.set(ip, {
          count: record.count,
          timestamp: record.timestamp,
        })
      }
    } else {
      // First request from this IP in a while
      ipRequestCounts.set(ip, { count: 1, timestamp: now })
    }
  } else {
    // Log warning for unknown IPs but allow request to proceed
    console.warn('Rate limiting skipped: Could not determine IP address.')
  }

  try {
    // Parse the request body
    const body = await request.json()

    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      console.warn(
        'Contact form validation failed:',
        validationResult.error.flatten()
      )
      return NextResponse.json(
        {
          error: 'Invalid form data provided',
          issues: validationResult.error.flatten().fieldErrors,
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validationResult.data

    // Configure Nodemailer transporter
    let transporter

    // Check if we're using a service provider or custom SMTP
    if (process.env.EMAIL_SERVICE) {
      // Use predefined service (Gmail, Outlook, etc)
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // 'gmail', 'outlook', etc.
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      })
    } else {
      // Use custom SMTP settings
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        secure: process.env.EMAIL_SERVER_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      })
    }

    // Verify connection configuration
    try {
      await transporter.verify()
      console.log('SMTP connection verified')
    } catch (error) {
      console.error('SMTP verification failed:', error)
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Portfolio Contact <noreply@example.com>',
      to: process.env.CONTACT_TO_EMAIL || 'josiah.c.hawkins@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    }

    // Send email
    try {
      await transporter.sendMail(mailOptions)

      return NextResponse.json(
        { success: true, message: 'Email sent successfully' },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Failed to send email:', emailError)

      // Return a more user-friendly error but include a fallback
      return NextResponse.json(
        {
          error: 'Unable to send email at this time',
          fallback: true,
          fallbackMessage:
            'Please contact directly at ' +
            (process.env.CONTACT_TO_EMAIL || 'josiah.c.hawkins@gmail.com'),
          submittedData: { name, email, subject }, // Don't include message for privacy/security
        },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      )
    }
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Rate limiting can be implemented here if needed
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
