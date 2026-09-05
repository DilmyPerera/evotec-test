# Customer Application Management System (CAMS)

## Project Description

A full-stack web application for managing customer registrations, application
submissions, and administrative operations through a secure role-based
system. Customers register, authenticate, and submit application forms, while
administrators securely search, filter, update, and delete submissions
through an admin dashboard. The system implements JWT-based authentication,
role-based authorization, server-side validation, secure password hashing,
and a PostgreSQL database.

## Tech Stack - and why

| Layer | Choice | Why |
|---|---|---|
| Frontend | **React 18 + Vite** | Vite gives near-instant dev server startup and HMR compared to CRA/Webpack, and React is the most transferable choice for a component-driven admin UI + public forms split. |
| Routing | **React Router v6** | Standard SPA router; its nested-route API maps cleanly onto the public/customer/admin route split (see `ProtectedRoute`). |
| UI Kit | **MUI (Material UI)** | Ships accessible, production-quality form controls, tables, and dialogs out of the box - this project is almost entirely forms and a data table, which is MUI's sweet spot, and it avoids hand-rolling input/validation-error styling. |
| HTTP client | **Axios** | Interceptor support is used directly (see `client/src/api/axiosClient.js`) to attach the access token to every request and to transparently refresh it on a `401` - `fetch` would need the same logic hand-written. |
| Backend | **Node.js + Express** | Minimal, unopinionated HTTP layer that keeps the request/response/middleware pipeline explicit - appropriate for an API this size, and keeps the whole stack in one language (JS) with the frontend. |
| Database | **PostgreSQL** | Relational data (users, submissions, uniqueness on email, enums for role/gender) fits a relational model better than a document store; Postgres is the most common production default. |
| ORM | **Prisma** | Type-safe query client generated from `schema.prisma`, plus a built-in migration workflow (`prisma migrate`) - avoids hand-written SQL/migrations and keeps the schema as the single source of truth. |
| Auth | **JWT (access + refresh), bcrypt, zod** | JWT keeps the API stateless (no server-side session store to scale); bcrypt is the standard for password hashing (salted, slow-by-design); zod gives declarative, typed request-body validation with structured error output instead of manual `if` checks in controllers. |

## Project Structure

```
/server               Express + Prisma API
  prisma/schema.prisma Database schema
  prisma/seed.js       Seeds a default admin account
  src/
    config/            Environment config (parses/validates process.env once)
    lib/               Prisma client instance (singleton)
    middleware/        auth, validation, error handling
    utils/             JWT, password hashing, async wrapper
    validators/        zod request schemas
    controllers/       Route handlers
    routes/            Express routers
    app.js             Express app wiring (middleware, routes, /health)
    index.js           Entrypoint - starts the HTTP server
/client               React + Vite SPA
  src/
    api/               Axios client (token attach + refresh) + token storage
    context/           AuthContext (login/register/logout, session state)
    components/        NavBar, ProtectedRoute, SubmissionEditDialog
    pages/             Home, Register, Login, Application, Admin Login, Admin Dashboard
/docker-compose.yml    Local PostgreSQL for development
/postman_collection.json  Importable Postman collection covering all endpoints
```

## Why the "special" files exist

These aren't part of the application's business logic, but each one solves a
specific operational problem:

- **`GET /health`** (`server/src/app.js`) - a dependency-free liveness probe.
  It deliberately doesn't touch the database, so it answers "is the process
  up and able to route requests" separately from "is the database reachable."
  This is what a container orchestrator, uptime monitor, or load balancer
  would poll to decide whether to route traffic to / restart an instance -
  and it's useful manually when checking if the API started correctly
  (`curl localhost:4000/health`).
- **`.env.example`** (in both `server/` and `client/`) - documents every
  environment variable the app reads *without* committing real secrets
  (JWT signing keys, DB credentials) to git. `.env` itself is git-ignored;
  `.env.example` is the checked-in contract new developers (and CI) copy
  from.
- **`docker-compose.yml`** - pins a disposable, reproducible Postgres
  (`postgres:16-alpine`) with credentials that match `DATABASE_URL` in
  `server/.env.example`, so `docker compose up -d` is the entire "set up a
  database" step. No local Postgres install/version drift between machines.
- **`prisma/schema.prisma`** - the single source of truth for the data
  model; Prisma generates both the typed query client and the SQL migrations
  from it, so the schema can't drift from the migrations that built it.
- **`prisma/seed.js`** - creates the first admin account. Since there's no
  public "become an admin" flow (by design - admin accounts shouldn't be
  self-service), something has to create the very first one; the seed script
  is that bootstrap, and further admins are created afterwards through the
  authenticated `POST /api/admin/admins` endpoint.
- **`postman_collection.json`** - a runnable, importable set of example
  requests (including auth flows) for manual API testing/exploration without
  needing to read the controller code to know what a request body looks
  like.
- **`.gitignore`** (root, `server/`, `client/`) - excludes `node_modules`,
  `.env`, and build output, so the repo stays small and no machine-specific
  or secret state gets committed.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker (for the bundled Postgres), or your own local PostgreSQL instance

### 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with user/password/db `evotec`/`evotec`/`evotec`
(matching the default `DATABASE_URL` in `server/.env.example`). If you'd rather
use an existing Postgres instance, just point `DATABASE_URL` at it instead.

### 2. Backend

```bash
cd server
cp .env.example .env      # adjust values if needed
npm install
npm run prisma:migrate    # creates tables
npm run prisma:seed       # creates the default admin account (see below)
npm run dev                # starts the API on http://localhost:4000
```

The seed script prints the seeded admin's email/password to the console -
use these to log in at `/admin/login` and (optionally) create further admins
via the protected `POST /api/admin/admins` endpoint.

Verify the API is up with:

```bash
curl http://localhost:4000/health   # -> {"status":"ok"}
```

### 3. Frontend

```bash
cd client
cp .env.example .env      # adjust VITE_API_BASE_URL if needed
npm install
npm run dev                # starts the app on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

## Environment Variables

### `server/.env.example`
| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `4000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets used to sign JWTs |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials for the seeded admin account |

### `client/.env.example`
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |

## API Endpoints

Full request/response examples are in [`postman_collection.json`](./postman_collection.json)
(import it into Postman). Summary:

### Health
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Liveness check, returns `{ status: 'ok' }` |

### Auth - `/api/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new customer (`email`, `password`, `confirmPassword`) |
| POST | `/login` | Public | Customer login → `{ user, accessToken, refreshToken }` |
| POST | `/admin/login` | Public | Admin login → `{ user, accessToken, refreshToken }` |
| POST | `/refresh` | Public | Exchange a `refreshToken` for a new token pair |

### Admin management - `/api/admin`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/admins` | Admin (JWT) | Create a new admin; auto-generates and returns a password |

### Submissions - `/api/submissions`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Customer (JWT) | Submit a form (`firstName`, `lastName`, `email`, `gender`, `mobileNumber`, `address`, `feedback?`) |
| GET | `/?gender=&search=` | Admin (JWT) | List all submissions, optionally filtered by gender and/or searched by first/last name |
| PATCH | `/:id` | Admin (JWT) | Update any field of a submission |
| DELETE | `/:id` | Admin (JWT) | Delete a submission |

All protected routes require `Authorization: Bearer <accessToken>`. Requests
with a missing/invalid token receive `401`; requests from the wrong role
receive `403`. Validation failures return `400` with a `details` array of
`{ field, message }`. Duplicate emails return `409`.

## Design Decisions

- **Access + refresh tokens, not a single long-lived JWT**: the access token
  is short-lived (`15m`) to limit the damage window if it leaks, while the
  refresh token (`7d`) lets the frontend silently re-authenticate
  (`client/src/api/axiosClient.js` intercepts a `401` and retries once after
  refreshing) instead of forcing a re-login every 15 minutes.
- **JWT over server-side sessions**: no session store (Redis, DB-backed
  sessions) to run or scale - the token itself carries `id`/`role`/`email`,
  and any API instance can verify it statelessly.
- **Role stored in the JWT payload, checked via middleware** (`authenticate`
  + `authorize` in `server/src/middleware/auth.js`): keeps role checks a
  one-line `authorize('ADMIN')` in route definitions rather than repeated
  logic in every controller.
- **zod validation as middleware** (`server/src/middleware/validate.js`):
  validation happens before a controller runs and short-circuits with a
  consistent `400` + `details` shape, so controllers only ever see
  already-valid `req.body`.
- **Centralized error handling** (`server/src/middleware/errorHandler.js`):
  controllers throw a plain `AppError` (or let Prisma throw) and never format
  HTTP responses themselves; Prisma's `P2002` (unique violation) and `P2025`
  (not found) are translated to `409`/`404` in one place instead of being
  caught per-controller.
- **Admin creation is not self-service**: there's no public admin signup -
  the seed script creates the first admin, and every subsequent admin must be
  created by an already-authenticated admin. This matches the intent that
  admin access is granted, not requested.
- **Audit fields (`userCreated`/`userModified`) store an email string, not a
  foreign key**: preserves an accurate history of who created/modified a
  submission even if that user's account is later changed or removed -
  a FK would either block deletion or silently lose the historical actor.
- **Mobile number validation** uses a generic local-number pattern
  (`server/src/validators/submissionValidators.js`) - adjust the regex there
  for a specific country format if needed.
