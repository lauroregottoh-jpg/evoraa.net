# KELIA
# 05_Backend_Specification.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the backend business logic for KELIA MVP.

The backend is responsible for enforcing all business rules independently of the user interface.

---

# Backend Modules

- Authentication
- User Profiles
- Psychometric Tests
- Matching
- Messaging
- Subscriptions
- Payments
- Notifications
- Administration

---

# User Registration Flow

1. User creates an account.
2. Supabase Auth creates the authentication record.
3. A profile is automatically created.
4. Default subscription is set to **Free**.
5. User is redirected to profile completion.

---

# Profile Management

Users can:

- Edit profile
- Upload photos
- Update location
- Update denomination
- Update biography

Validation Rules

- Required fields must be completed.
- Birth date must indicate legal age.
- Uploaded files must be images.

---

# Psychometric Tests

Rules

- Users answer questions.
- Answers are stored.
- Scores are calculated.
- Results are saved.
- Results become available to the Matching Engine.

A user may retake a test only if the application explicitly allows it.

---

# Matching Logic

A profile becomes eligible for matching only if:

- Registration completed
- Profile completed
- Required tests completed

The backend computes compatibility and stores suggested matches.

---

# Messaging

Messaging is only allowed between matched users.

Rules

- Text only (V1)
- Store every message
- Update read status
- Prevent access to conversations involving other users

---

# Subscription Rules

Plans

- Free
- Premium
- Premium+

The backend checks subscription limits before granting access to premium features.

---

# Payment Processing

Workflow

1. Create payment request.
2. Redirect user to payment provider.
3. Wait for provider callback.
4. Validate callback.
5. Activate subscription.
6. Store transaction.

---

# Notifications

Events

- New match
- New message
- Payment confirmed
- Subscription expiration reminder

---

# Administration

Administrators can:

- View reports
- Suspend users
- Restore users
- Review moderation queue

Every administrative action should be logged.

---

# Error Handling

Return standardized API errors.

Example

- Validation error
- Unauthorized
- Resource not found
- Internal server error

Sensitive information must never be exposed.

---

# Logging

Log:

- Authentication events
- Payments
- Errors
- Administrative actions

---

# Performance

- Pagination for all lists
- Indexed database queries
- Minimize unnecessary requests

---

# Out of Scope (V1)

- AI services
- Video/audio messaging
- Group conversations
- Voice notes
- Recommendation engine

---

# Next Document

06_Frontend_Specification.md
