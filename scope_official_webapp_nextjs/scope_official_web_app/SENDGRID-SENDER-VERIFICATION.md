# SendGrid Sender Email Verification Guide

## 🚨 Issue
SendGrid requires you to verify the "FROM" email address before sending emails.

**Error Message:**
```
550 The from address does not match a verified Sender Identity
```

---

## ✅ Quick Fix - Two Options

### Option 1: Single Sender Verification (Recommended for Testing)

1. **Go to SendGrid Dashboard**
   - Login at: https://app.sendgrid.com/

2. **Navigate to Sender Authentication**
   - Click **Settings** → **Sender Authentication**
   - Or go directly to: https://app.sendgrid.com/settings/sender_auth

3. **Create Single Sender**
   - Click **"Verify a Single Sender"**
   - Click **"Create New Sender"**

4. **Fill in Sender Details**
   ```
   From Name: SCOPE - Society of Core Oriented Projects
   From Email: your-email@gmail.com (or any email you own)
   Reply To: your-email@gmail.com
   Company Address: Your organization address
   City: Your city
   State: Your state
   Zip: Your zip
   Country: Your country
   ```

5. **Verify Your Email**
   - SendGrid will send a verification email
   - Click the verification link in the email
   - ✅ Status will change to "Verified"

6. **Update .env.local**
   ```env
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=SCOPE - Society of Core Oriented Projects
   ```

---

### Option 2: Domain Authentication (Recommended for Production)

1. **Go to Sender Authentication**
   - https://app.sendgrid.com/settings/sender_auth

2. **Authenticate Your Domain**
   - Click **"Authenticate Your Domain"**
   - Select your DNS host (GoDaddy, Namecheap, etc.)
   - Follow the instructions to add DNS records

3. **Add DNS Records**
   - SendGrid will provide CNAME records
   - Add them to your domain DNS settings
   - Wait for verification (can take up to 48 hours)

4. **Use Any Email with Your Domain**
   ```env
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   SMTP_FROM_NAME=SCOPE - Society of Core Oriented Projects
   ```

---

## 🎯 Steps to Complete NOW

### 1. Verify Your Sender Email in SendGrid

**Quick Steps:**
1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Click "Verify a Single Sender"
3. Fill in your email details
4. Check your email inbox
5. Click verification link
6. Wait for "Verified" status

### 2. Update Your .env.local File

Replace this line:
```env
SMTP_FROM_EMAIL=your-verified-email@domain.com
```

With your **actual verified email**, for example:
```env
SMTP_FROM_EMAIL=rohan@example.com
```

Or if you're using Gmail:
```env
SMTP_FROM_EMAIL=your.name@gmail.com
```

### 3. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 📧 Example Configuration

### For Gmail:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
SMTP_FROM_EMAIL=yourname@gmail.com
SMTP_FROM_NAME=SCOPE - Society of Core Oriented Projects
```

### For Custom Domain:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
SMTP_FROM_EMAIL=noreply@scopeorg.com
SMTP_FROM_NAME=SCOPE - Society of Core Oriented Projects
```

---

## 🔍 Verification Checklist

Before testing emails again:

- [ ] Logged into SendGrid dashboard
- [ ] Navigated to Sender Authentication
- [ ] Created Single Sender Verification
- [ ] Received verification email from SendGrid
- [ ] Clicked verification link
- [ ] Sender shows "Verified" status in dashboard
- [ ] Updated `SMTP_FROM_EMAIL` in `.env.local` with verified email
- [ ] Updated `SMTP_FROM_NAME` in `.env.local` (optional)
- [ ] Restarted dev server
- [ ] Ready to test!

---

## 🎨 What Emails Will Look Like

**From:** SCOPE - Society of Core Oriented Projects <yourname@gmail.com>
**To:** user@example.com
**Subject:** ✅ Your Question Has Been Answered - SCOPE

Users will see the beautiful HTML email template we created!

---

## 🐛 Troubleshooting

### "From address does not match verified sender"
✅ **Solution**: Verify your sender email in SendGrid dashboard

### "Daily sending limit exceeded"
⚠️ **Cause**: Free SendGrid accounts have daily limits
✅ **Solution**: 
- Free tier: 100 emails/day
- Upgrade if you need more

### "Authentication failed"
✅ **Check**:
1. API key is correct in `.env.local`
2. SMTP_USER is exactly `apikey`
3. No extra spaces in credentials

### Email goes to spam
✅ **Solutions**:
1. Use domain authentication instead of single sender
2. Add SPF/DKIM records
3. Avoid spam trigger words in subject/content

---

## 📊 SendGrid Free Tier Limits

- **Daily Emails**: 100/day
- **Monthly Emails**: Free forever with 100/day
- **Verified Senders**: Unlimited single senders
- **Domain Authentication**: 1 domain (custom domains require DNS access)

---

## 🚀 After Verification

Once your sender email is verified:

1. **Test the email system**:
   - Submit a FAQ question on your website
   - Answer it in the admin panel
   - Click "Publish Answer"
   - Check the recipient's email inbox

2. **Check SendGrid Activity**:
   - Go to: https://app.sendgrid.com/email_activity
   - See all sent emails
   - Monitor delivery status

3. **You're Done!** 🎉
   - Email notifications will work perfectly
   - Users will receive beautiful emails
   - SendGrid will handle all email delivery

---

## 📞 Need Help?

- **SendGrid Docs**: https://docs.sendgrid.com/
- **Sender Verification**: https://sendgrid.com/docs/for-developers/sending-email/sender-identity/
- **Support**: https://support.sendgrid.com/

---

**Last Updated**: October 18, 2025
**Status**: ⚠️ Awaiting Sender Verification
