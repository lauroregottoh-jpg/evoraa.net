# KELLIA
# 15_Deployment.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the deployment process for KELLIA MVP.

The objective is to deploy the application with minimal cost while ensuring reliability and security.

---

# Production Environment

Frontend
- Vercel (Free)

Backend
- Supabase

Database
- PostgreSQL (Supabase)

Repository
- GitHub

Domain
- Custom domain

SSL
- Enabled automatically

---

# Environment Variables

Configure securely:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- CINETPAY_API_KEY (or MakeTou API credentials)
- APP_URL

Never expose private keys in the frontend.

---

# Deployment Workflow

1. Push code to GitHub.
2. Connect repository to Vercel.
3. Configure environment variables.
4. Deploy frontend.
5. Connect Supabase project.
6. Run database migrations.
7. Verify authentication.
8. Verify payments.
9. Verify email delivery.
10. Perform production smoke tests.

---

# Production Checklist

Before launch:

- Domain configured
- HTTPS active
- Database migrations completed
- Email verification working
- Payment callbacks tested
- Backups enabled
- Error monitoring enabled

---

# Monitoring

Monitor:

- Application availability
- Authentication errors
- Payment failures
- API errors
- Database usage

---

# Rollback Strategy

If deployment fails:

1. Roll back to previous release.
2. Restore database only if required.
3. Investigate issue.
4. Redeploy after validation.

---

# Backup Strategy

- Use Supabase backups.
- Export critical data regularly.
- Store backups securely.

---

# MVP Scope

Deployment targets only:

- Web application
- Desktop browsers
- Mobile browsers (responsive)

Native mobile applications are excluded.

---

# Next Document

16_Implementation_Roadmap.md
