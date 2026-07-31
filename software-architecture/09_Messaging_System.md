# KELIAA
# 09_Messaging_System.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the messaging system for KELIAA MVP.

The messaging feature is designed to encourage meaningful conversations between compatible members while preventing spam and abuse.

---

# Messaging Principles

- Private one-to-one conversations only
- Text messages only (MVP)
- Secure communication
- Respect subscription limits
- Real-time delivery

---

# Conversation Eligibility

A conversation can be created only if:

- Both users have active accounts
- Both users are matched
- Neither user has blocked the other
- Subscription limits allow messaging

---

# Conversation Flow

1. User opens a suggested match.
2. User starts a conversation.
3. Conversation record is created.
4. Messages are exchanged in real time.
5. Read status is updated.

---

# Message Structure

Each message stores:

- Message ID
- Conversation ID
- Sender ID
- Text
- Read status
- Created timestamp

---

# Subscription Limits

## Découverte

- Up to 5 conversations per month
- Up to 5 sent messages per conversation

## Alliance

- Up to 25 new conversations per month
- Up to 100 messages per conversation

## Essentiel (legacy, non public)

- Up to 15 conversations per month
- Up to 70 messages per conversation

---

# Real-Time Features

- Instant message delivery
- Read receipts
- Typing indicator (optional for MVP)

---

# User Actions

Members can:

- Start a conversation
- Send a message
- Read messages
- Delete their own message (optional)
- Report a conversation
- Block another user

---

# Moderation

Users may report:

- Harassment
- Fake profile
- Inappropriate content
- Spam

Reported conversations become visible to administrators for review.

---

# Security

- Only conversation participants can access messages.
- Server-side authorization required.
- All requests use HTTPS.
- Row Level Security enabled.

---

# Notifications

Trigger notifications when:

- New message received
- Unread conversation
- Conversation reported

---

# Out of Scope (V1)

- Voice messages
- Image sharing
- Video sharing
- File attachments
- Group chats
- Message reactions
- Message editing

---

# Next Document

10_Payments_Subscriptions.md
