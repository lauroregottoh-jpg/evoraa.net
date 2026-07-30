
# KELIAA
# 18_AI_Development_Instructions.md

**Version:** 1.0 (MVP)

---

# Purpose

This document defines the rules that any AI development agent (Claude Code, Codex, ChatGPT, etc.) must follow when building the KELIAA MVP.

These instructions take precedence over assumptions. If a specification is missing or ambiguous, the AI must stop and request clarification.

---

# General Rules

1. Read every document in the `software-architecture` folder before writing any code.
2. Do not invent features that are not specified.
3. Respect the MVP scope.
4. Prefer simple, maintainable solutions over complex architectures.
5. Keep the code clean, modular and well documented.

---

# Technology Stack

Use only the technologies defined in `01_Tech_Stack.md`.

Do not replace technologies without explicit approval.

---

# Development Process

Follow the implementation roadmap exactly:

1. Project setup
2. Authentication
3. User profiles
4. Assessments
5. Matching
6. Messaging
7. Payments
8. Notifications
9. Administration
10. Testing
11. Deployment

Complete one phase before starting the next.

---

# Database

- Follow the approved schema.
- Do not rename tables or columns.
- Create migrations for every schema change.
- Never delete production data automatically.

---

# API

- Respect the documented endpoints.
- Keep request and response formats consistent.
- Return meaningful error messages.
- Validate all user input.

---

# Frontend

- Mobile-first design.
- Reusable components.
- Accessible interface.
- Consistent styling across the application.

---

# Security

Always implement:

- authentication checks;
- authorization checks;
- input validation;
- protection against common web vulnerabilities;
- secure environment variable management.

---

# Testing

Before completing a phase:

- Run unit tests.
- Run integration tests when applicable.
- Fix all critical errors.
- Do not continue with failing tests.

---

# Git Workflow

After each completed phase:

- Commit changes with a clear message.
- Keep commits focused on one logical change.
- Avoid mixing unrelated features.

---

# When in Doubt

If documentation is unclear:

1. Stop development.
2. Explain the ambiguity.
3. Ask for clarification.
4. Wait for approval before continuing.

Never guess functional requirements.

---

# Definition of Done

A feature is complete only if:

- It matches the documentation.
- It compiles successfully.
- Tests pass.
- No critical errors remain.
- Code is ready for production review.

