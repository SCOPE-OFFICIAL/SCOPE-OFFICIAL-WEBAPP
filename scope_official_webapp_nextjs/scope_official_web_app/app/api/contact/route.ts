import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

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

    const questionRef = await addDoc(collection(db, 'user-questions'), {
      user_name: name,
      user_email: email,
      question,
      answer: null,
      category: 'contact',
      status: 'pending',
      is_public: false,
      submitted_at: new Date().toISOString(),
      answered_at: null,
      source: 'contact-form',
    })

    const smtpConfigured = Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM_EMAIL &&
      process.env.CONTACT_RECEIVER_EMAIL
    )

    if (smtpConfigured) {
      try {
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
      } catch (mailError) {
        console.error('Contact email delivery failed, but question was stored:', mailError)
      }
    }

    return NextResponse.json(
      {
        message: 'Question submitted successfully.',
        id: questionRef.id,
        emailSent: smtpConfigured,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to send your question. Please try again later.' },
      { status: 500 }
    )
  }
}
