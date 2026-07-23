# KELIA
# 10_Payments_Subscriptions.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the subscription model and payment workflow for KELIA MVP.

The objective is to provide a simple, secure and scalable monetization model.

---

# Subscription Plans

## Free

Features:

- Create profile
- Complete assessments
- 3 match suggestions per day
- 5 conversations per month
- 5 messages per conversation

---

## Premium

Features:

- 10 match suggestions per day
- 15 conversations per month
- 70 total messages per month
- Advanced profile filters

---

## Premium+

Features:

- 20 match suggestions per day
- Unlimited conversations
- Unlimited messages
- Priority profile visibility
- Premium badge

---

# Payment Providers

Primary provider:

- CinetPay

Alternative:

- MakeTou (if official API supports payment creation, callbacks and verification)

Flutterwave and Stripe are not required for MVP.

---

# Payment Flow

1. User selects a plan.
2. Payment request is created.
3. User is redirected to the payment provider.
4. Provider sends a callback (webhook).
5. Backend verifies the transaction.
6. Subscription is activated.
7. Confirmation notification is sent.

---

# Subscription Status

Possible values:

- Active
- Pending
- Expired
- Cancelled
- Failed

---

# Renewal

For MVP:

- Manual renewal only.
- No automatic recurring billing.

---

# Access Control

The backend validates the subscription before allowing access to premium features.

If the subscription expires:

- Premium features are disabled.
- User returns to the Free plan.

---

# Payment History

Each payment stores:

- User ID
- Plan
- Provider
- Transaction reference
- Amount
- Currency
- Status
- Timestamp

---

# Refund Policy

Refund requests are handled manually by administrators.

No automatic refund process is included in MVP.

---

# Security

- Verify every payment callback.
- Never trust client-side payment status.
- Log all payment events.
- Use HTTPS exclusively.

---

# Future (Not MVP)

- Automatic renewals
- Promotional codes
- Family plans
- Gift subscriptions
- Multiple payment providers simultaneously

---

# Next Document

11_Admin_Backoffice.md
