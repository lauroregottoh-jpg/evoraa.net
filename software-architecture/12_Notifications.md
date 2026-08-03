# KELLIA
# 12_Notifications.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the notification system for KELLIA MVP.

The notification service keeps users informed about important activities while avoiding unnecessary interruptions.

---

# Objectives

- Inform users in real time
- Increase engagement
- Support subscription lifecycle
- Improve user experience

---

# Notification Channels

## In-App Notifications (MVP)

Supported.

Displayed inside the application.

---

## Email Notifications (MVP)

Provider:

- Resend

Used for:

- Email verification
- Password reset
- Welcome email
- Payment confirmation
- Subscription expiration reminder

---

## Push Notifications

Not included in MVP.

Reserved for future versions.

---

# Notification Types

## Authentication

- Welcome
- Email verification
- Password reset

---

## Matching

- New match suggestion
- Compatibility updated

---

## Messaging

- New message
- Unread conversation reminder

---

## Subscription

- Payment successful
- Payment failed
- Subscription activated
- Subscription expires soon
- Subscription expired

---

## Administration

- Account suspended
- Account restored
- Important platform announcement

---

# Notification Structure

Each notification contains:

- Notification ID
- User ID
- Category
- Title
- Message
- Read status
- Created date

---

# User Actions

Users can:

- View notifications
- Mark one as read
- Mark all as read
- Delete a notification

---

# Retention Policy

Notifications remain available until deleted by the user.

---

# Security

- Notifications are private.
- Users can access only their own notifications.
- All requests require authentication.

---

# Out of Scope (MVP)

- SMS notifications
- Push notifications
- Marketing campaigns
- Scheduled reminders
- Notification preferences

---

# Next Document

13_Security.md
