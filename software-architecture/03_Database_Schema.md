# KELIA
# 03_Database_Schema.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the database structure for KELIA MVP.

Database Engine: PostgreSQL (Supabase)

---

# Core Tables

## users
Managed by Supabase Auth.

Additional profile data is stored in `profiles`.

---

## profiles

| Field | Type |
|-------|------|
| id | UUID (PK) |
| user_id | UUID (FK users) |
| first_name | TEXT |
| last_name | TEXT |
| gender | TEXT |
| birth_date | DATE |
| country | TEXT |
| city | TEXT |
| denomination | TEXT |
| biography | TEXT |
| avatar_url | TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## profile_photos

| Field | Type |
|-------|------|
| id | UUID |
| profile_id | UUID |
| photo_url | TEXT |
| is_primary | BOOLEAN |
| display_order | INTEGER |

---

## psychometric_tests

Stores available tests.

| Field | Type |
|-------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| version | TEXT |
| is_active | BOOLEAN |

---

## test_questions

| Field | Type |
|-------|------|
| id | UUID |
| test_id | UUID |
| question | TEXT |
| order_index | INTEGER |

---

## test_answers

Stores user answers.

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| question_id | UUID |
| answer_value | INTEGER |

---

## test_results

Stores computed scores and specific dimensional sub-scores.

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| test_id | UUID |
| score | DECIMAL |
| dimensions | JSONB |
| profile_code | TEXT |
| completed_at | TIMESTAMP |

---

## matches

| Field | Type |
|-------|------|
| id | UUID |
| user_one | UUID |
| user_two | UUID |
| compatibility_score | DECIMAL |
| status | TEXT |
| created_at | TIMESTAMP |

---

## conversations

| Field | Type |
|-------|------|
| id | UUID |
| match_id | UUID |
| created_at | TIMESTAMP |

---

## messages

| Field | Type |
|-------|------|
| id | UUID |
| conversation_id | UUID |
| sender_id | UUID |
| message | TEXT |
| is_read | BOOLEAN |
| created_at | TIMESTAMP |

---

## subscriptions

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| plan | TEXT |
| starts_at | TIMESTAMP |
| ends_at | TIMESTAMP |
| status | TEXT |

---

## payments

| Field | Type |
|-------|------|
| id | UUID |
| subscription_id | UUID |
| provider | TEXT |
| transaction_reference | TEXT |
| amount | DECIMAL |
| currency | TEXT |
| metadata | JSONB |
| status | TEXT |
| created_at | TIMESTAMP |

---

## notifications

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| title | TEXT |
| body | TEXT |
| is_read | BOOLEAN |
| created_at | TIMESTAMP |

---

## reports

User reporting and moderation.

| Field | Type |
|-------|------|
| id | UUID |
| reporter_id | UUID |
| reported_user_id | UUID |
| reason | TEXT |
| status | TEXT |

---

# Relationships

users
→ profiles

profiles
→ profile_photos

users
→ test_answers

test_questions
→ test_answers

users
→ test_results

users
→ matches

matches
→ conversations

conversations
→ messages

users
→ subscriptions

subscriptions
→ payments

users
→ notifications

---

# Storage Buckets

## avatars
- **Visibility:** Public (for primary photo) or Protected (via Signed URLs for private gallery)
- **RLS Policies:**
  - `INSERT`: Authenticated users can upload their own photos.
  - `SELECT`: Public access to the primary photo, restricted access for secondary photos based on matches.
  - `DELETE`: Users can delete their own photos.

---

# Indexes

Create indexes on:

- user_id
- conversation_id
- match_id
- created_at
- compatibility_score

---

# Next Document

04_API_Specification.md
