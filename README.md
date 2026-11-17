# KIXORA — Luxury Footwear

KIXORA is a full-stack e-commerce platform for a premium footwear store. The project has three parts:

- **REST API** (Express 5 + MongoDB) — products, orders, payments, reviews, members
- **Admin panel** (server-rendered EJS) — manage products, orders, users and reviews, protected with 2FA
- **Web app** (`kixora-client/`, React 19 + Vite) — the customer-facing storefront (PWA)

## Features

**For customers**
- Sign up, log in, Google sign-in (Firebase), password reset
- Product catalog with search, sorting, filters and product pages
- **AI search** — find products with natural-language queries, powered by Gemini
- Cart with size selection, checkout and payment (test mode or manual confirmation)
- Order history and status tracking
- Wishlist (likes), product reviews and ratings
- Help center, contact form, newsletter subscription

**For admins**
- Dashboard with revenue, order and customer statistics
- Create and edit products, upload images
- Manage order and user statuses, loyalty points
- Moderate and reply to reviews
- Inbox for customer messages, export subscribers as CSV
- Security: TOTP two-factor authentication, admin management

## Tech stack

| Area | Stack |
|---|---|
| Backend | Node.js 20+, TypeScript, Express 5, Mongoose 8, Zod, JWT, express-session |
| Security | Helmet, CSP, rate limiting, NoSQL sanitizer, bcrypt, otplib (2FA) |
| Infrastructure | Redis (optional: cache and rate limits), Sentry, Nodemailer, Multer, PM2 |
| Frontend | React 19, Vite, Redux Toolkit, React Router 7, MUI, Firebase Auth, Axios |
| Testing | `node:test` + mongodb-memory-server (backend), Vitest (frontend) |
| CI | GitHub Actions — typecheck, lint, tests, build |

## Project structure

```
kixora/
├── src/                  # Backend
│   ├── controllers/      # HTTP handlers (member, product, order, payment, admin, ...)
│   ├── services/         # Business logic
│   ├── models/           # Mongoose schemas
│   ├── middlewares/      # Auth, CSP, error handling
│   ├── libs/             # Config, validation, cache, Redis, mailer, AI search, ...
│   ├── views/            # Admin panel EJS templates
│   ├── router.ts         # Public API (/member, /product, /order, /payment, ...)
│   ├── routerAdmin.ts    # Admin panel (/admin)
│   └── server.ts         # Entry point
├── kixora-client/        # React web app
│   ├── src/app/          # Screens, components, services, Redux store
│   └── server.mjs        # Production static server + /api proxy
├── test/                 # Unit and end-to-end tests
├── docs/AUDIT.md         # Security and architecture audit report
└── ecosystem.config.js   # PM2 configuration
```

## Getting started

**Requirements:** Node.js 20+, MongoDB (local or Atlas). Redis is optional.

1. Install dependencies:

   ```bash
   npm install
   cd kixora-client && npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values (at least `MONGO_URL`):

   ```bash
   cp .env.example .env
   ```

3. Start the backend (default port `3001`):

   ```bash
   npm run dev
   ```

4. In another terminal, start the frontend:

   ```bash
   cd kixora-client && npm run dev
   ```

Admin panel: `http://localhost:3001/admin`

## Key environment variables

| Variable | Purpose |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET`, `SESSION_SECRET` | Required in production |
| `ALLOWED_ORIGINS` | Origins allowed by CORS |
| `FIREBASE_PROJECT_ID` | Verifies Google sign-in tokens |
| `GEMINI_API_KEY` | AI search (the endpoint returns 503 without it) |
| `PAYMENT_MODE` | `test` or `manual` |
| `REDIS_URL` | Required to run more than one instance |
| `SMTP_URL` | Outgoing email (password reset, notifications) |

See [.env.example](.env.example) for the full list.

## Scripts

**Backend (repository root)**

| Command | Description |
|---|---|
| `npm run dev` | Development mode (nodemon) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the production server |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests (in-memory MongoDB) |

**Frontend (`kixora-client/`)**

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | oxlint |
| `npm test` | Vitest |
| `npm start` | Serve the built app with the `/api` proxy |

## Deployment

- **Backend:** Railway (or any server via PM2). Mount persistent storage and point `UPLOAD_DIR` to it for uploaded images.
- **Frontend:** Railway (`server.mjs` + `/api` proxy) or Vercel (`vercel.json`).
- Set the same `PROXY_SECRET` on both services so rate limits see the real visitor IP.

## License

ISC
