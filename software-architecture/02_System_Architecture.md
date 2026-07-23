# KELIA
# 02_System_Architecture.md

**Version:** 1.0 (MVP)
**Status:** Approved for Development

---

# 1. Objective

This document defines the high-level architecture of KELIA MVP.

The architecture is designed to:

- Minimize operational costs
- Use free tiers whenever possible
- Be easy to maintain
- Scale without major redesign

---

# 2. Architecture Style

**Architecture Pattern**

Modular Monolith

This approach keeps all business logic in one application while separating features into modules.

Modules:

- Authentication
- User Profiles
- Psychometric Tests
- Matching
- Messaging
- Payments
- Notifications
- Administration

---

# 3. High-Level Flow

```text
User
   │
   ▼
Next.js Frontend
   │
   ▼
Supabase Auth
   │
   ▼
Business Logic
   │
   ├── Profiles
   ├── Tests
   ├── Matching
   ├── Messages
   ├── Payments
   └── Admin
   │
   ▼
PostgreSQL Database
```

---

# 4. Main Components

## Frontend

Responsibilities:

- Authentication
- Profile management
- Test completion
- Matching interface
- Messaging
- Subscription management

Technology:

- Next.js
- React
- TypeScript

---

## Backend

Responsibilities:

- Business rules
- Data validation
- Authorization
- Payment processing
- Match generation

Technology:

- Supabase
- Edge Functions (only where needed)

---

## Database

Stores:

- Users
- Profiles
- Test responses
- Match scores
- Messages
- Subscriptions
- Payments
- Notifications

Engine:

- PostgreSQL

---

# 5. Request Flow

Example:

1. User logs in.
2. Authentication is verified.
3. Request is authorized.
4. Data is read or updated.
5. Response is returned to the client.

---

# 6. Module Communication

Authentication
→ Profiles

Profiles
→ Psychometric Tests

Psychometric Tests
→ Matching Engine

Matching Engine
→ Suggested Matches

Messaging
→ Conversations

Payments
→ Subscription Status

Subscription Status
→ Feature Access

---

# 7. Security Principles

- HTTPS only
- Row Level Security
- JWT authentication
- Server-side validation
- Least privilege access

---

# 8. Scalability

MVP target:

- Up to 5,000 active users

Future scaling:

- Redis cache
- Background workers
- Dedicated search engine

These are NOT required for V1.

---

# 9. External Services (MVP)

- Supabase
- Vercel
- GitHub
- CinetPay (or MakeTou if API is validated)
- Resend

---

# 10. Out of Scope (V1)

The following are intentionally excluded:

- AI assistant
- Video calls
- Recommendation engine based on AI
- Microservices
- GraphQL
- Native mobile applications

---

# 11. Next Document

03_Database_Schema.md
