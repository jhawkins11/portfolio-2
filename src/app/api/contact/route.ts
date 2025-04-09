import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email validation regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// Schema validation for form data
interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Validate required fields
    const { name, email, subject, message } = body as ContactFormData

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

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
