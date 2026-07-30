# KELIAA
# 07_Authentication_Authorization.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines authentication, authorization and access control for KELIAA MVP.

---

# Authentication Provider

Supabase Auth

Supported methods (V1):

- Email + Password

Future versions may include:

- Google
- Apple
- Phone OTP

---

# Registration Flow

1. User enters email and password.
2. Email uniqueness is verified.
3. Account is created.
4. Email verification is sent.
5. User confirms email.
6. Default Free subscription is assigned.
7. User completes profile.

---

# Login Flow

1. User submits credentials.
2. Credentials are verified.
3. JWT session is created.
4. User is redirected to Dashboard.

---

# Password Recovery

Forgot Password

1. User requests reset.
2. Secure email is sent.
3. User chooses a new password.

---

# Session Management

- JWT authentication
- Secure cookies
- Automatic session refresh
- Logout invalidates local session

---

# Roles

## Visitor

Can:

- View public pages
- Register
- Login

---

## Member

Can:

- Manage profile
- Complete tests
- View matches
- Send messages when allowed
- Manage subscription

---

## Administrator

Can:

- Moderate users
- Review reports
- Suspend or restore accounts
- View platform statistics

---

# Authorization Rules

Only authenticated users can:

- Access dashboard
- View private profiles
- Complete tests
- Access messaging
- Manage subscriptions

Users may access only their own data unless explicitly authorized.

---

# Security Policies

- HTTPS only
- Email verification required
- Strong password policy
- Server-side authorization checks
- Row Level Security (RLS)

---

# Account Status

Possible states:

- Pending Verification
- Active
- Suspended
- Deleted

Suspended users cannot log in.

---

# Audit Logging

Record:

- Login
- Logout
- Password reset
- Failed login attempts
- Administrative actions

---

# Future Enhancements (Not V1)

- Multi-factor authentication
- Social login
- Biometric authentication
- Device management

---

# Next Document

08_Matching_Engine.md
