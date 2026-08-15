# 💍 Project GeeNi

> More than a wedding website. A timeless digital experience.

![Version](https://img.shields.io/badge/version-v0.1.0-blue)
![Status](https://img.shields.io/badge/status-Planning-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

---

# Overview

Project GeeNi is a luxury digital wedding platform built for:

- **Bride:** Nidhi Bang
- **Groom:** Govind Daga
- **Wedding Hashtag:** #GeeNi

Unlike traditional wedding websites, Project GeeNi evolves throughout the wedding journey.

## Before Wedding

- Elegant Invitation
- Countdown
- RSVP
- Event Information
- Venue & Maps
- Hotels
- FAQs

## During Wedding

- Today's Celebration
- QR Code Photo Upload
- Live Gallery
- Guestbook
- Notifications

## After Wedding

- Digital Wedding Album
- AI Generated Albums
- Memory Timeline
- Time Capsule
- Anniversary Mode

---

# Design Philosophy

The experience should feel like a combination of

- Aman Resorts
- Apple
- Sabyasachi
- Luxury Editorial Design

The website should prioritize emotion over information.

---

# Project Goals

- Create an unforgettable digital wedding experience.
- Make navigation effortless for every guest.
- Collect every possible wedding memory.
- Build something that remains meaningful years after the wedding.

---

# Technology

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Backend

- Next.js Route Handlers
- DynamoDB

Storage

- Amazon S3
- CloudFront

Authentication

- Google Login (feature switch)
- OTP Login (planned)

Hosting

- AWS Amplify Hosting
- App Runner or ECS via Docker

---

# Feature switches

Set these in `.env.local` or your Amplify environment:

- `NEXT_PUBLIC_FEATURE_UPLOAD` — `true` to show guest uploads, `false` to close them
- `NEXT_PUBLIC_FEATURE_GOOGLE_AUTH` — `true` to require Google sign-in before upload

Copy `.env.example` to get started.

---

# Deploy on AWS

1. Create media infrastructure:

```bash
aws cloudformation deploy \
  --template-file infra/template.yaml \
  --stack-name geeni-media \
  --parameter-overrides SiteOrigin=https://your-app.amplifyapp.com AppName=geeni \
  --capabilities CAPABILITY_NAMED_IAM
```

2. Copy stack outputs into Amplify (or App Runner) environment variables: `AWS_S3_BUCKET`, `NEXT_PUBLIC_MEDIA_BASE_URL` / `AWS_CLOUDFRONT_URL`, `AWS_DYNAMODB_MEDIA_TABLE`, `AWS_DYNAMODB_RATE_LIMITS_TABLE`, and `AWS_REGION`.
3. Attach the stack’s app role (or an equivalent policy) to Amplify SSR / App Runner so the app can sign S3 uploads and write DynamoDB without long-lived access keys.
4. Connect the repo to Amplify Hosting. `amplify.yml` installs, lints, tests, and builds the Next.js app.
5. For Google sign-in, create an OAuth client whose authorized redirect URI is `https://<your-domain>/api/auth/callback/google`, then set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.
6. Drop official gallery photos into `gallery-assets/` and run `npm run sync:gallery`.

Container hosting:

```bash
docker build -t geeni .
docker run --env-file .env -p 3000:3000 geeni
```

---

# Repository Structure

```
docs/
features/
tasks/
frontend/
backend/
database/
planning/
```

---

# Development Philosophy

Everything begins with documentation.

No feature should be implemented unless it has a specification.

---

# Current Status

- [x] Vision
- [ ] Product Requirements
- [ ] Design System
- [ ] UI
- [ ] Backend
- [ ] AI Features

---

Built with ❤️ for #GeeNi