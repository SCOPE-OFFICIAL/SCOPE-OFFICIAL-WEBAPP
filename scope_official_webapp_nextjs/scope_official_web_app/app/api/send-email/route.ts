import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const secure = port === 465 // true for 465, false for other ports

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

function createEmailTemplate(data: {
  userName: string
  question: string
  answer: string
  answeredBy: string
  answeredDate: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Question Has Been Answered - SCOPE</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0a0e27;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0a0e27;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:linear-gradient(135deg,#1a1f3a 0%,#2d1b4e 100%);border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
          <tr>
            <td style="background:linear-gradient(90deg,#F24DC2 0%,#2C97FF 100%);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:32px;font-weight:bold;">SCOPE</h1>
              <p style="margin:10px 0 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Society of Core Oriented Projects</p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 30px 20px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:12px 24px;border-radius:25px;">
                <span style="color:white;font-size:16px;font-weight:600;">✅ Your Question Has Been Answered!</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 20px;">
              <p style="color:#e5e7eb;font-size:18px;margin:0;">Hello <strong style="color:#F24DC2;">${escapeHtml(
                data.userName
              )}</strong>,</p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 30px;">
              <p style="color:#d1d5db;font-size:15px;line-height:1.6;margin:0;">Great news! Our team has answered your question.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 20px;">
              <div style="background:rgba(255,255,255,0.05);border-left:4px solid #F24DC2;border-radius:8px;padding:20px;">
                <p style="color:#F24DC2;font-size:13px;font-weight:600;text-transform:uppercase;margin:0 0 10px 0;">Your Question</p>
                <p style="color:#e5e7eb;font-size:16px;line-height:1.5;margin:0;font-style:italic;">"${escapeHtml(
                  data.question
                )}"</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 30px;">
              <div style="background:linear-gradient(135deg,rgba(44,151,255,0.1) 0%,rgba(242,77,194,0.1) 100%);border:1px solid rgba(44,151,255,0.3);border-radius:8px;padding:20px;">
                <p style="color:#2C97FF;font-size:13px;font-weight:600;text-transform:uppercase;margin:0 0 10px 0;">Answer</p>
                <p style="color:#f3f4f6;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(
                  data.answer
                )}</p>
                <div style="margin-top:20px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.1);">
                  <p style="color:#9ca3af;font-size:13px;margin:0;">
                    <strong>Answered by:</strong> ${escapeHtml(
                      data.answeredBy
                    )}<br />
                    <strong>Date:</strong> ${escapeHtml(data.answeredDate)}
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 40px;text-align:center;">
              <a href="${siteUrl}/#faq" style="display:inline-block;background:linear-gradient(90deg,#F24DC2 0%,#2C97FF 100%);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;">View More FAQs</a>
            </td>
          </tr>

          <tr>
            <td style="background:rgba(0,0,0,0.2);padding:30px;text-align:center;">
              <p style="color:#6b7280;font-size:13px;margin:0 0 10px 0;"><strong style="color:#9ca3af;">SCOPE</strong> - Wired for Innovation, Powered by Passion</p>
              <p style="color:#6b7280;font-size:12px;margin:0;">This email was sent because you submitted a question on our website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Minimal HTML escaping to avoid breaking the template
function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { to, userName, question, answer, answeredBy } = body ?? {}

    if (!to || !userName || !question || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.SMTP_FROM_EMAIL
    ) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const transporter = createTransporter()

    // Optionally verify — this may throw if misconfigured
    await transporter.verify()

    const answeredDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    await transporter.sendMail({
      from: {
        name: process.env.SMTP_FROM_NAME || 'SCOPE - Society of Core Oriented Projects',
        address: process.env.SMTP_FROM_EMAIL
      },
      to,
      subject: '✅ Your Question Has Been Answered - SCOPE',
      html: createEmailTemplate({
        userName,
        question,
        answer,
        answeredBy: answeredBy || 'SCOPE Admin',
        answeredDate
      }),
      text: [
        '',
        `Hello ${userName},`,
        '',
        'Your question has been answered.',
        '',
        'Question:',
        `"${question}"`,
        '',
        'Answer:',
        answer,
        '',
        `Answered by: ${answeredBy || 'SCOPE Admin'}`,
        `Date: ${answeredDate}`,
        '',
        `Visit our FAQ page: ${siteUrl}/#faq`,
        '',
        'SCOPE - Society of Core Oriented Projects',
        'Wired for Innovation, Powered by Passion'
      ].join('\n')
    })

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Email sending error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to send email', details: message },
      { status: 500 }
    )
  }
}