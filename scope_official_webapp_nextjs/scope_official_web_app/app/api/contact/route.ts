import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type ContactPayload = {
  name?: string
  email?: string
  question?: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const secure = port === 465

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload

    const name = (body.name || '').trim()
    const email = (body.email || '').trim()
    const question = (body.question || '').trim()

    if (!name || !email || !question) {
      return NextResponse.json(
        { error: 'Name, email, and question are required.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const requiredEnvVars = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
      'SMTP_FROM_EMAIL',
      'CONTACT_RECEIVER_EMAIL',
    ]

    const missingEnvVar = requiredEnvVars.find((key) => !process.env[key])
    if (missingEnvVar) {
      console.error(`Missing email configuration: ${missingEnvVar}`)
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    const transporter = createTransporter()

    await transporter.sendMail({
      from: {
        name: process.env.SMTP_FROM_NAME || 'SCOPE Website',
        address: process.env.SMTP_FROM_EMAIL!,
      },
      to: process.env.CONTACT_RECEIVER_EMAIL!,
      replyTo: email,
      subject: `New Contact Question from ${name}`,
      text: [
        'New question submitted from the website contact form.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Question:',
        question,
      ].join('\n'),
      html: `
        <h2>New Contact / Ask a Question Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Question:</strong></p>
        <p>${escapeHtml(question).replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ message: 'Question submitted successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to send your question. Please try again later.' },
      { status: 500 }
    )
  }
}
