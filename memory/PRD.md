# Tanmay Visuals — Product Requirements

## Original problem statement
Cinematic, dynamic single-page portfolio + lead-gen site for Tanmay Visuals (Creative Director, Video Editor, Content Creator, Delhi NCR). Layered 3D/motion system driven by CSS perspective, cursor tracking, Framer Motion springs — no Three.js/WebGL. Adapted to React (CRA) + FastAPI + MongoDB.

## Tech stack
- Frontend: React 19 (CRA/craco), Framer Motion, TailwindCSS, Radix/shadcn UI, Lucide icons
- Backend: FastAPI + Motor (MongoDB) + Resend (email — optional)
- Deployment: Kubernetes preview, all API routes prefixed `/api`

## User personas
1. **Prospect / brand owner** — arrives from Instagram/DM, wants to see credibility + immediately WhatsApp Tanmay.
2. **Talent / recruiter** — wants a portfolio glance (Work + Services + About).
3. **Tanmay (admin)** — logs into `/admin` with a key to add/remove work items and view leads + analytics.

## Core requirements (locked)
- 8-section single page: Nav → Hero → Credential marquee → About → Services → Work → Contact → Footer
- Fixed bottom-nav pill CTA (hides when Contact is in viewport)
- Global cursor glow + magnetic buttons + portrait 3D tilt + parallax
- WhatsApp CTA on every primary button → `wa.me/919266553033` with prefilled message
- Contact form POST `/api/contact` — MongoDB persistence + Resend email (works even if key missing)
- Admin panel at `/admin` protected by `X-Admin-Key` header
- Analytics tracking (page_view, whatsapp_click, cta_click, contact_submit)
- Mobile 390px+ responsive, `prefers-reduced-motion` respected

## What's implemented (2026-07-04)
- Backend: `/api/`, `/api/contact` (public), `/api/contacts` (admin), `/api/analytics/event`, `/api/analytics/summary` (admin), `/api/admin/verify`, `/api/work-items` (public read + admin CRUD) — all tested 13/13 pass
- Hero: reference-video-style layered composition — central portrait, floating info cards, two floating stat pills, gradient overlapping heading, cursor tilt + parallax, mount animation, live "On set 2026" badge
- Credential marquee: scroll-driven bi-directional rows
- About: scroll-linked character-by-character reveal + expandable "know more"
- Services: 6 numbered rows with hover lift, staggered entrance
- Work: 3 sticky-stacking cards with per-card gradient theming + admin-driven media grid
- Contact: dark-themed form with success/error state + Info block
- Bottom nav: white pill with magnetic CTA, auto-hides over Contact
- Admin panel: key login (session-persisted), stats dashboard, work-item CRUD, leads viewer

## Test credentials
- Admin key: `tanmay-admin-2026` (see `/app/memory/test_credentials.md`)

## Backlog / next tasks
### P0
- User to drop the real hero portrait upgrades / additional work videos via `/admin`

### P1
- Add `RESEND_API_KEY` in `backend/.env` to enable outbound email notifications
- Add Instagram Reel embed / self-hosted MP4 support in Work card media grid
- Add OG meta tags + favicon for social share previews

### P2
- Optional: Google Tag Manager / GA4 integration for richer analytics
- Optional: Blog / case-study section for SEO
- Optional: Rate-limit `/api/contact` at the ingress level
