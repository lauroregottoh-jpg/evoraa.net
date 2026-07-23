# KELIA
# 06_Frontend_Specification.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the frontend behavior and user experience for KELIA MVP.

---

# Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- React Hook Form
- Zod

---

# Design Principles

- Mobile-first
- Responsive
- Fast loading
- Accessible
- Simple navigation
- Consistent components

---

# Public Pages

- Home
- About
- Pricing
- FAQ
- Contact
- Login
- Register

---

# Authenticated Pages

## Dashboard

Displays:

- Profile completion
- Suggested matches
- Notifications
- Subscription status

---

## Profile

Users can:

- Edit information
- Upload photos
- Update biography
- Update preferences

---

## Psychometric Tests

Flow:

1. Select test
2. Answer questions
3. Submit
4. Display completion
5. View results

---

## Matches

Features:

- Suggested matches
- Compatibility score
- View profile
- Start conversation (if allowed)

---

## Messaging

Features:

- Conversation list
- Message history
- Send text message
- Read status

Text messages only for MVP.

---

## Subscription

Display:

- Current plan
- Available plans
- Upgrade button
- Payment status

---

## Notifications

Display:

- New match
- New message
- Subscription updates

---

# Navigation

Bottom navigation (mobile)

- Home
- Matches
- Messages
- Notifications
- Profile

Desktop

- Left sidebar
- Main content
- Right utility panel (optional)

---

# Validation

Client-side validation using:

- Zod
- React Hook Form

Server validation always has priority.

---

# Loading States

Every page should include:

- Loading indicator
- Empty state
- Error state

---

# UI Components

- Button
- Card
- Avatar
- Badge
- Input
- Textarea
- Modal
- Dialog
- Toast
- Tabs
- Progress Bar
- Pagination

---

# Accessibility

- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Semantic HTML

---

# Performance

- Lazy loading where appropriate
- Optimized images
- Pagination
- Code splitting

---

# Out of Scope (V1)

- Dark mode
- Offline mode
- Native mobile app
- Voice messaging
- Video calls

---

# Next Document

07_Authentication_Authorization.md
