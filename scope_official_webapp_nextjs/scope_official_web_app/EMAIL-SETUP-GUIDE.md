# Email Configuration for SCOPE Website

## Required Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration for Email Notifications
# These are required for sending email notifications to users

# Gmail Example:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Setup Instructions

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SCOPE Website"
   - Copy the 16-character password
3. **Add to `.env.local`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up** at https://sendgrid.com (Free tier: 100 emails/day)
2. **Create API Key**:
   - Go to Settings > API Keys
   - Create API Key with "Mail Send" permissions
3. **Add to `.env.local`**:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

### Option 3: Mailgun

1. **Sign up** at https://mailgun.com
2. **Get SMTP credentials** from Dashboard > Sending > Domain Settings
3. **Add to `.env.local`**:
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASS=your-mailgun-password
   ```

### Option 4: Amazon SES

1. **Sign up** for AWS and enable SES
2. **Get SMTP credentials** from SES Console
3. **Add to `.env.local`**:
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-ses-smtp-username
   SMTP_PASS=your-ses-smtp-password
   ```

---

## Required Packages

Install nodemailer for email functionality:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

Or with pnpm:

```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

---

## Testing the Email System

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Submit a test question**:
   - Go to http://localhost:3000/#faq
   - Fill out the question form with your email
   - Submit the question

3. **Answer the question as admin**:
   - Login to admin panel
   - Go to FAQ Management > User Questions tab
   - Click "Answer Question"
   - Write an answer
   - Click "Publish Answer"

4. **Check your email**:
   - You should receive a beautiful HTML email
   - Email includes: gradient header, formatted question/answer, call-to-action buttons

---

## Email Features

### Beautiful HTML Template
- ✅ Gradient header with SCOPE branding
- ✅ Responsive design (works on mobile)
- ✅ Color-coded sections
- ✅ Question highlighted in styled card
- ✅ Answer in gradient box
- ✅ Metadata (answered by, date)
- ✅ Call-to-action button linking to FAQ page
- ✅ Professional footer with links
- ✅ Plain text fallback for email clients

### Email Content Includes:
- User's name (personalized greeting)
- Their original question
- The admin's answer
- Date and time answered
- Link to view more FAQs
- Link back to website

### Automatic Features:
- Sent immediately when admin publishes answer
- Only sent if user provided email address
- Graceful fallback if email fails
- Admin gets confirmation notification
- Error handling with user-friendly messages

---

## Troubleshooting

### Error: "Cannot find module 'nodemailer'"
**Solution**: Install the package
```bash
npm install nodemailer @types/nodemailer
```

### Error: "SMTP credentials not configured"
**Solution**: Add SMTP variables to `.env.local` file

### Error: "Invalid login" (Gmail)
**Solutions**:
- Use App Password instead of regular password
- Enable "Less secure app access" (not recommended)
- Check if 2FA is enabled

### Email not sending
**Check**:
1. Environment variables are correct
2. SMTP credentials are valid
3. Firewall not blocking port 587
4. Check server logs for errors

### Email goes to spam
**Solutions**:
- Use a verified domain email
- Add SPF/DKIM records (production)
- Use professional email service (SendGrid, Mailgun)
- Avoid spam trigger words

---

## Production Recommendations

### For Production Deployment:

1. **Use Professional Email Service**
   - SendGrid (recommended)
   - Mailgun
   - Amazon SES
   - Postmark

2. **Set Up Domain Authentication**
   - Add SPF records
   - Configure DKIM
   - Set up DMARC

3. **Monitor Email Delivery**
   - Track bounces
   - Monitor spam reports
   - Check delivery rates

4. **Environment Variables**
   - Use platform environment variables (Vercel, Netlify, etc.)
   - Never commit `.env.local` to git
   - Use different SMTP accounts for dev/prod

5. **Rate Limiting**
   - Implement rate limiting for email sending
   - Prevent abuse
   - Monitor usage

---

## Email Template Customization

The email template is in `app/api/send-email/route.ts`

### Customize:
- Colors and gradients
- Logo and branding
- Footer content
- Call-to-action buttons
- Text content

### Variables Available:
```typescript
{
  userName: string       // User's name
  question: string       // Original question
  answer: string        // Admin's answer
  answeredBy: string    // Admin name
  answeredDate: string  // Formatted date
}
```

---

## Security Best Practices

1. ✅ **Never expose SMTP credentials**
   - Use environment variables only
   - Don't commit to version control

2. ✅ **Validate email addresses**
   - Check format before sending
   - Prevent injection attacks

3. ✅ **Rate limiting**
   - Prevent spam
   - Limit emails per user/hour

4. ✅ **Sanitize content**
   - Escape HTML in user input
   - Prevent XSS attacks

5. ✅ **Use secure connections**
   - TLS/SSL for SMTP
   - Encrypted passwords

---

## Support

For issues or questions:
- Check server logs for error details
- Verify environment variables
- Test SMTP connection separately
- Contact your email service provider

---

**Last Updated**: October 18, 2025
