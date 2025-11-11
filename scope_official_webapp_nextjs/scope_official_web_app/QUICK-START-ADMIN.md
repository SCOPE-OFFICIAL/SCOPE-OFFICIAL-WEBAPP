# 🚀 Quick Start - Admin Management System

Get your admin management system up and running in 5 minutes!

## ⚡ Quick Setup Steps

### 1️⃣ Run the SQL Script in Supabase (2 minutes)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the sidebar
4. Click **New Query**
5. Copy the contents of `supabase_setup_admins.sql`
6. **IMPORTANT**: Update lines 64-67 with your information:
   ```sql
   INSERT INTO public.admins (email, password, name, role)
   VALUES (
     'your-email@scope.com',     -- 👈 Your email
     'your-password',            -- 👈 Your password
     'Your Name',                -- 👈 Your name
     'super_admin'
   );
   ```
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. ✅ You should see "Success. No rows returned"

### 2️⃣ Verify Your Environment Variables (1 minute)

Check your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
NEXTAUTH_SECRET=your-random-secret-key
```

**Don't have these?** Get them from:
- Supabase Dashboard → Settings → API
- Copy **Project URL** and **service_role key**

### 3️⃣ Start Your Application (30 seconds)

```bash
cd scope_official_web_app
pnpm dev
```

### 4️⃣ Login & Test (1 minute)

1. Open browser: http://localhost:3000/admin/login
2. Enter the email/password you set in the SQL script
3. Click **Sign In**
4. You should see the Admin Dashboard! 🎉

### 5️⃣ Add Your Club Members (30 seconds per member)

1. Click **Manage Admins** from the dashboard
2. Click **+ Add New Admin**
3. Fill in:
   - **Name**: Club member's name
   - **Email**: Their email
   - **Password**: A password (they'll see it)
   - **Role**: Admin or Super Admin
4. Click **Add Admin**
5. ✅ Done! Share their credentials with them

---

## 🎯 What You Get

### Admin Management Page (`/admin/admins`)
- ✅ View all registered admins
- ✅ See their emails and passwords
- ✅ Add new admins quickly
- ✅ Delete admins
- ✅ Copy credentials to clipboard
- ✅ Track last login times
- ✅ Role badges (Admin vs Super Admin)

### Updated Login System
- ✅ Authenticates against database
- ✅ Fallback to environment variables
- ✅ Tracks last login timestamp
- ✅ JWT token authentication
- ✅ 7-day session expiry

### Dashboard Integration
- ✅ New "Manage Admins" quick action button
- ✅ Access from `/admin/dashboard`

---

## 📱 Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/admin/login` | Admin login page |
| Dashboard | `/admin/dashboard` | Main admin dashboard |
| Manage Admins | `/admin/admins` | Add/view/delete admins |

---

## 🔐 Security Notes

1. **Passwords are visible**: By design, all admins can see everyone's passwords
2. **Service Role Key**: Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
3. **Share Carefully**: Only give admin access to trusted club members
4. **Environment Fallback**: You can always login with env var credentials if database fails

---

## ❓ Quick Troubleshooting

**Can't login?**
- Check email/password are exactly correct (case-sensitive)
- Verify the admin exists in Supabase (SQL Editor → Run: `SELECT * FROM admins;`)

**API errors?**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Restart your dev server after changing `.env.local`

**Table doesn't exist?**
- Re-run the SQL script in Supabase
- Check the SQL Editor for any error messages

---

## 🎊 You're Done!

Your admin management system is ready. Share the credentials with your club members and start collaborating!

**Need help?** Check `ADMIN-MANAGEMENT-SETUP.md` for detailed documentation.
