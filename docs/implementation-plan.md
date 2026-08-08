# Project GeeNi Implementation Plan

## 1. Foundation
- Scaffold a Next.js App Router application with TypeScript and Tailwind CSS.
- Establish the design tokens and shared UI primitives for buttons, cards, spacing, and typography.
- Implement a responsive layout shell with a premium navigation and footer.

## 2. Information Architecture
- Build the primary route structure from the documented sitemap: home, story, events, venue, gallery, upload, RSVP, contact, FAQ, privacy.
- Keep each page focused on a single primary action and a calm visual hierarchy.

## 3. Visual System
- Use a warm traditional + modern luxury palette rooted in ivory, champagne, blush, sage, and antique gold.
- Apply serif headings and polished sans-serif body copy to create an editorial tone.
- Use generous spacing, soft borders, and subtle shadows to express luxury without clutter.

## 4. Experience Flow
- Design the homepage as the emotional entry point, with a clear hero, celebration compass, quick actions, story preview, and featured event.
- Create event and venue pages that make the schedule and travel details instantly understandable.
- Build gallery and upload pages that emphasize effortless memory sharing and elegant presentation.

## 5. Technical Approach
- Use Server Components by default and promote reusable client-side interaction patterns only where necessary.
- Optimize media through Next.js image handling and lazy loading.
- Prepare the project for future Supabase-backed guest uploads, auth, and gallery management.

## 6. Quality Targets
- Meet the documented Lighthouse, accessibility, and Core Web Vitals goals.
- Keep navigation keyboard-accessible, provide semantic structure, and maintain contrast compliance.
- Iterate on spacing, motion, and page hierarchy until the experience feels calm and premium.
