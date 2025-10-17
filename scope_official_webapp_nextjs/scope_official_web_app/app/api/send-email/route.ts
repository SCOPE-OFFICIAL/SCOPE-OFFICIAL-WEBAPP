/**
 * Send Email API Route
 * Sends beautiful HTML emails to users when their questions are answered
 */

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create email transporter
// You can use Gmail, SendGrid, or any SMTP service
const createTransporter = () => {
  // For Gmail (you'll need to enable "Less secure app access" or use App Password)
  // For production, use a service like SendGrid, Postmark, or Resend
  
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email
      pass: process.env.SMTP_PASS, // Your email password or app password
    },
  })
}

// Beautiful HTML email template
const createEmailTemplate = (data: {
  userName: string
  question: string
  answer: string
  answeredBy: string
  answeredDate: string
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Question Has Been Answered - SCOPE</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0e27;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0e27; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background: linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%); border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(90deg, #F24DC2 0%, #2C97FF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                SCOPE
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; letter-spacing: 1px;">
                Society of Core Oriented Projects
              </p>
            </td>
          </tr>

          <!-- Notification Badge -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 12px 24px; border-radius: 25px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                <span style="color: white; font-size: 16px; font-weight: 600;">✅ Your Question Has Been Answered!</span>
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <p style="color: #e5e7eb; font-size: 18px; margin: 0;">
                Hello <strong style="color: #F24DC2;">${data.userName}</strong>,
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! Our team has answered your question. We hope this information helps you!
              </p>
            </td>
          </tr>

          <!-- Question Card -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background: rgba(255,255,255,0.05); border-left: 4px solid #F24DC2; border-radius: 8px; padding: 20px; backdrop-filter: blur(10px);">
                <p style="color: #F24DC2; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">
                  Your Question
                </p>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.5; margin: 0; font-style: italic;">
                  "${data.question}"
                </p>
              </div>
            </td>
          </tr>

          <!-- Answer Card -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: linear-gradient(135deg, rgba(44, 151, 255, 0.1) 0%, rgba(242, 77, 194, 0.1) 100%); border: 1px solid rgba(44, 151, 255, 0.3); border-radius: 8px; padding: 20px;">
                <p style="color: #2C97FF; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">
                  Answer
                </p>
                <p style="color: #f3f4f6; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
${data.answer}
                </p>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                    <strong>Answered by:</strong> ${data.answeredBy}<br>
                    <strong>Date:</strong> ${data.answeredDate}
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#faq" 
                 style="display: inline-block; background: linear-gradient(90deg, #F24DC2 0%, #2C97FF 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(242, 77, 194, 0.4); transition: all 0.3s;">
                View More FAQs
              </a>
            </td>
          </tr>

          <!-- Additional Help -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0;">
                Have more questions? Feel free to ask anytime!<br>
                We're here to help you succeed.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: rgba(0,0,0,0.2); padding: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                <strong style="color: #9ca3af;">SCOPE</strong> - Wired for Innovation, Powered by Passion
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This email was sent because you submitted a question on our website.
              </p>
              <div style="margin-top: 15px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" style="color: #2C97FF; text-decoration: none; margin: 0 10px; font-size: 12px;">Visit Website</a>
                <span style="color: #4b5563;">•</span>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/aboutus" style="color: #2C97FF; text-decoration: none; margin: 0 10px; font-size: 12px;">About Us</a>
                <span style="color: #4b5563;">•</span>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#faq" style="color: #2C97FF; text-decoration: none; margin: 0 10px; font-size: 12px;">FAQ</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, userName, question, answer, answeredBy } = body

    if (!to || !userName || !question || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact administrator.' },
        { status: 500 }
      )
    }

    const transporter = createTransporter()

    const answeredDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const mailOptions = {
      from: {
        name: 'SCOPE - Society of Core Oriented Projects',
        address: process.env.SMTP_USER!
      },
      to: to,
      subject: '✅ Your Question Has Been Answered - SCOPE',
      html: createEmailTemplate({
        userName,
        question,
        answer,
        answeredBy: answeredBy || 'SCOPE Admin',
        answeredDate
      }),
      // Plain text fallback
      text: `
Hello ${userName},

Your question has been answered!

Your Question:
"${question}"

Answer:
${answer}

Answered by: ${answeredBy || 'SCOPE Admin'}
Date: ${answeredDate}

Visit our FAQ page for more information: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#faq

---
SCOPE - Society of Core Oriented Projects
Wired for Innovation, Powered by Passion
      `.trim()
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { 
        success: true,
        message: 'Email sent successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
