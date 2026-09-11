# CareHub Web Panel

Browser console for the CareHub hospital platform. It mirrors the React Native app’s teal healthcare theme and talks to the same Supabase project (Auth + Postgres + RLS).

**Roles:** Admin · Doctor · Patient  
**App:** Vite + React 19 + TypeScript  
**Default URL:** [http://localhost:5173](http://localhost:5173)

---

## What it does

| Role | Capabilities |
|------|----------------|
| **Admin** | Dashboard stats, hospital CRUD, departments, doctor approve/reject/suspend, system-wide appointments |
| **Doctor** | Home overview, create/manage availability slots, confirm/complete/cancel visits |
| **Patient** | Home overview, browse approved doctors, book open slots, view/cancel visits |

Auth screens use a premium split-layout login/register experience (glassmorphism brand panel + floating login card).

---

## Stack

| Layer | Choice |
|-------|--------|
| Bundler | Vite 8 |
| UI | React 19, CSS Modules |
| Routing | React Router 7 (role-gated) |
| Backend | Supabase JS (`@supabase/supabase-js`) — anon/publishable key + RLS |
| Motion | Framer Motion |
| Icons | Lucide React |
| Font | Plus Jakarta Sans |
| Lint | Oxlint |

---

## Quick start

### From monorepo root

```bash
yarn web:install   # first time
yarn web:dev       # http://localhost:5173
yarn web:build     # production build → webpanel/dist
```

### From `webpanel/`

```bash
cd webpanel
cp .env.example .env
npm install
npm run dev
```

### Environment

Create `webpanel/.env` (same project as the mobile app):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key
VITE_NODE_API_BASE_URL=http://127.0.0.1:3001
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Anon / publishable key (never commit the service role key here) |
| `VITE_NODE_API_BASE_URL` | Node backend URL for booking SMS notify (`POST /notify/booking-sms`). Node must be running. |

Restart the Vite dev server after changing env vars.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port **5173** (opens browser) |
| `npm run build` | Typecheck (`tsc -b`) + production build |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | Oxlint |

Root shortcuts: `yarn web:dev` · `yarn web:build` · `yarn web:install`

---

## Routes

### Public

| Path | Page |
|------|------|
| `/login` | Sign in (email/password, remember me, forgot password, SSO placeholders) |
| `/register` | Create **Patient** or **Doctor** account |

### Shared (authenticated)

| Path | Behavior |
|------|----------|
| `/` | Redirects to `/admin`, `/doctor`, or `/patient` by role |

### Admin (`role = ADMIN`)

| Path | Page |
|------|------|
| `/admin` | Dashboard + pending doctor applications |
| `/admin/hospitals` | Create / edit / delete hospitals |
| `/admin/departments` | Departments by hospital |
| `/admin/doctors` | Filter & approve / reject / suspend |
| `/admin/appointments` | All visits |

### Doctor (`role = DOCTOR`)

| Path | Page |
|------|------|
| `/doctor` | Today’s visits & pending counts |
| `/doctor/schedule` | Add / remove availability slots |
| `/doctor/visits` | Manage appointment status |

### Patient (`role = PATIENT`)

| Path | Page |
|------|------|
| `/patient` | Upcoming visits |
| `/patient/doctors` | Find approved doctors & book slots |
| `/patient/visits` | History + cancel |

Unauthorized roles are blocked by `ProtectedRoute`. Unknown paths redirect to `/`.

---

## Architecture

```
webpanel/
├── index.html
├── .env.example
├── vite.config.ts          # @ → src alias, port 5173
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/global.css   # design tokens, base styles
    ├── theme/tokens.ts     # palette aligned with mobile
    ├── types/database.ts   # domain types
    ├── lib/supabase.ts     # Supabase client
    ├── services/
    │   ├── authService.ts  # signIn / signUp / profile
    │   └── dataService.ts  # hospitals, slots, appointments, …
    ├── routes/
    │   ├── AppRouter.tsx
    │   └── ProtectedRoute.tsx
    ├── features/
    │   ├── auth/           # Login, Register, AuthContext, brand panel
    │   ├── admin/
    │   ├── doctor/
    │   ├── patient/
    │   └── shared/         # tables / list CSS shared across roles
    └── shared/components/
        ├── layout/         # AppShell (sidebar, mobile bar, bottom nav)
        ├── ui/             # Button, Card, Field, Badge, Shimmer, …
        └── motion/         # PageTransition
```

### Data flow

1. User signs in via Supabase Auth (`authService`).
2. `AuthContext` loads `users` (+ doctor/patient profile) and exposes `user.role`.
3. Pages call `dataService` helpers; RLS enforces what each role can read/write.
4. UI uses shared kit (`Card`, `PageHeader`, skeletons) for consistent loading and layout.

---

## Auth notes

- **Patients & doctors** self-register at `/register` (role stored in auth metadata / profile).
- **Admins** are not self-serve — promote a user to `ADMIN` in Supabase (`users.role`).
- **Remember me** stores the email in `localStorage` (`carehub.web.rememberEmail`).
- **Forgot password** uses `supabase.auth.resetPasswordForEmail`.
- **Google / Microsoft** buttons are UI placeholders until OAuth providers are enabled in Supabase.

---

## Design system

| Token | Value |
|-------|--------|
| Primary teal | `#0B7285` (app shell) / login accent `#0F766E` |
| Surfaces | Soft white `#F8FAFC`, white cards |
| Text | `#1E293B` / `#0F172A` |
| Font | Plus Jakarta Sans |
| Motion | Framer Motion page + card fades |

**Responsive shell**

- **Desktop:** sticky teal sidebar  
- **≤900px:** top bar + drawer + bottom nav  
- Cards and tables use fluid padding; empty states stay compact  

---

## Prerequisites

1. Supabase project with CareHub migrations applied (same as the mobile app).
2. Valid anon key in `.env`.
3. At least one user per role you want to test (admin via DB, others via `/register`).

Related backends in this monorepo (not required to open the web UI):

- Mobile app — Expo / React Native  
- `api/` — FastAPI  
- `nodejsbackend/` — Retell voice tools  

---

## Development tips

- Path alias: import with `@/…` (configured in `vite.config.ts` + `tsconfig`).
- Prefer CSS Modules next to components; shared list/table styles live in `features/shared/tables.module.css`.
- Keep secrets out of the client — only `VITE_*` anon credentials.
- After schema changes, regenerate or update `types/database.ts` to match.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank app / auth warnings in console | Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, restart `npm run dev` |
| Login works but pages empty | Check RLS policies and that the user has the expected `users.role` |
| Redirected away from `/admin` | User is not `ADMIN` — update role in Supabase |
| Patient can’t book | Ensure a `patients` row / `patient_id` exists (complete profile; mobile may create it first) |
| Build fails on types | Run `npm run build` and fix reported `tsc` errors |

---

## Production

```bash
cd webpanel
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, S3, nginx). Configure the host’s SPA fallback so all routes serve `index.html`.

Set production env vars for `VITE_SUPABASE_*` at build time (Vite inlines them).

---

## License

Private — part of the CareHub / testing-supabase monorepo.
