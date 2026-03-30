# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with Turbopack
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

No test framework is configured.

## Architecture

Next.js 16 App Router blog frontend for a Polish travel/bikepacking blog ("Plan był inny"). Content is served from a **Strapi CMS** backend; the frontend fetches it server-side and renders with ISR.

### Data flow

1. `src/services/strapi.ts` — all Strapi API calls (posts, categories, comments, about page). Uses `qs.stringify()` for query building and reads config from `src/config/strapi.ts`.
2. Server components fetch from `strapiService` at request time or build time with `revalidate`.
3. Forms use **server actions** (`src/actions/`) with Zod validation (`src/lib/validation/`) and Cloudflare Turnstile CAPTCHA verification before submission.
4. Email delivery (contact form, comment/newsletter verification) goes through **Resend** (`src/config/resend.ts`), using React Email templates in `src/components/emails/`.

### Key directories

- `src/app/` — pages and API routes. Dynamic routes: `/wpis/[slug]` (post), `/kategoria/[slug]` (category). API routes handle email verification for comments and newsletter.
- `src/components/` — UI components. Comments system is in `src/components/comments/`.
- `src/actions/` — server actions: `comment-action`, `contact-action`, `newsletter-action`.
- `src/services/` — `strapi.ts` is the sole data-fetching layer.
- `src/lib/` — utilities: date formatting, HTTP helper, security tokens, Strapi image URL helpers.
- `src/types/` — TypeScript types for all Strapi entities.
- `src/config/` — environment-based config for Strapi, Resend, Turnstile, and Next.js image domains.

### Content blocks

Blog posts support polymorphic content blocks via a `__component` field:
- `content.paragraph-md` — markdown rendered with `react-markdown`
- `content.gallery` — image gallery using Next.js `<Image>`

### Strapi images

Always use `getStrapiImage()` (`src/lib/strapi/get-strapi-image.ts`) to build image URLs. Locally, images are served directly from Strapi (relative URLs get prefixed with `STRAPI_URL`); in production they come from an external host (absolute URL is returned as-is).

### Conventions

- `"use client"` only when strictly necessary (event handlers, browser APIs). Server Components are the default.
- Styling is Tailwind-only — no CSS modules or other solutions.
- TypeScript types go in `src/types/`. Component prop types can be defined locally in the component file.

### Path alias

`@/*` maps to `./src/*`.

## Environment variables

Required in `.env`:
```
STRAPI_URL, STRAPI_API_TOKEN
SITE_URL
RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, COMMENTS_FROM_EMAIL
RESEND_AUDIENCE_ID, RESEND_CONTACTS_API_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY
```
