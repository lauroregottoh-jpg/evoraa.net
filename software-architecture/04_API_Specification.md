# KELIAA
# 04_API_Specification.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the backend integration strategy for KELIAA MVP.

Instead of a traditional REST API for all operations, the architecture uses **Supabase Native** (Supabase SDK + Row Level Security) for most CRUD operations (Profiles, Messages, Tests). 

REST API / Edge Functions are reserved ONLY for complex business logic that cannot be securely handled client-side:
- Matching Engine triggers
- Payment webhooks
- Test result consolidation

Base URL for Custom Edge Functions/API Routes:

```
/api/v1
```

Authentication

- JWT (Supabase Auth)
- HTTPS required

---

# Authentication & Profile (Supabase Native)

Registration, Login, and Logout are handled directly via the `supabase.auth` client SDK.

Profile and Photo operations (Get, Update, Upload, Delete) are handled directly via the `supabase.from('profiles')` and `supabase.storage.from('avatars')` SDK methods, protected by PostgreSQL Row Level Security (RLS) rules.

---

# Psychometric Tests

## List Tests

GET /tests

---

## Get Questions

GET /tests/{testId}

---

## Submit Answers

POST /tests/{testId}/submit

Body

```json
{
  "answers":[]
}
```

---

## Get Results

GET /tests/results

---

# Matching

## Suggested Matches

GET /matches

Query Parameters

- page
- limit

---

## Match Details

GET /matches/{id}

---

# Messaging (Supabase Native)

Conversations and Messages (List, Send, Mark as Read) are handled directly via the Supabase SDK (`supabase.from('messages')`) with real-time subscriptions (`supabase.channel()`). Row Level Security (RLS) ensures users can only read and write messages in their own matched conversations.

---

# Subscription

## Current Subscription

GET /subscriptions/current

---

## Available Plans

GET /subscriptions/plans

---

## Subscribe

POST /subscriptions

---

# Payments

## Create Payment

POST /payments

---

## Payment Callback

POST /payments/webhook

Called by payment provider.

---

# Notifications

GET /notifications

PATCH /notifications/{id}/read

---

# Admin

GET /admin/dashboard

GET /admin/reports

PATCH /admin/reports/{id}

PATCH /admin/users/{id}

---

# HTTP Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

---

# Security Rules

- JWT required for protected routes
- Row Level Security enabled
- Validate all inputs
- Rate limiting on authentication endpoints

---

# Versioning

Current Version

v1

Future

/api/v2

---

# Next Document

05_Backend_Specification.md
