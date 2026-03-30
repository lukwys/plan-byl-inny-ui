# Plan był inny — Blog Frontend

Next.js 16 frontend for a travel, bikepacking, diving, and DIY blog.

## Requirements

- Node.js 18+
- pnpm
- Running Strapi backend (default: `http://127.0.0.1:1337`)

## Environment variables

Create a `.env` file:

```env
STRAPI_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=

SITE_URL=http://localhost:3000

RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
COMMENTS_FROM_EMAIL=
RESEND_AUDIENCE_ID=
RESEND_CONTACTS_API_KEY=

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## Development

```bash
pnpm install
pnpm dev       # dev server with Turbopack at http://localhost:3000
pnpm build     # production build
pnpm start     # start production server
pnpm lint      # ESLint
```
