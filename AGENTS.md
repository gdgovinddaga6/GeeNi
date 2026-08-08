# AI Agent Instructions

This repository is designed for AI-assisted software development.

Every coding agent must follow these rules.

---

# Rule 1

Never invent requirements.

If something is not documented,
ask for clarification or leave a TODO.

---

# Rule 2

Read documentation before coding.

Required reading order

1. README.md
2. docs/00_Project/Vision.md
3. Relevant feature documentation
4. Relevant task documentation

---

# Rule 3

Never redesign UI.

Implementation must follow the Design System.

---

# Rule 4

Accessibility is mandatory.

Requirements

- WCAG AA
- Keyboard navigation
- Screen reader support
- Focus states
- Proper semantic HTML

---

# Rule 5

Performance

Homepage

<2 seconds

Lighthouse

95+

CLS

<0.1

LCP

<2.5 seconds

---

# Rule 6

Code Standards

- TypeScript only
- No any
- Functional Components
- Server Components by default
- Client Components only when required

---

# Rule 7

Architecture

Presentation Layer

↓

Business Logic

↓

Data Layer

Never mix responsibilities.

---

# Rule 8

Component Philosophy

Components must be

Reusable

Composable

Accessible

Documented

Testable

---

# Rule 9

Every PR must

Compile

Pass lint

Pass tests

Pass type checks

---

# Rule 10

Think like a senior engineer.

Prefer readability over cleverness.

Simple beats complex.