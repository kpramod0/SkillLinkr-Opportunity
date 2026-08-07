# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0-rc.1] - 2026-08-07

### Added
- Complete standalone Next.js 16 application scaffolding.
- PostgreSQL schema migrations (001 through 015) including `pg_cron` jobs.
- Strict Row Level Security (RLS) policies implemented for all 18 tables.
- Role-Based Access Control (RBAC) via Supabase SSR in `src/middleware.ts`.
- Society Portal for opportunity submission.
- Ambassador Portal for localized review and verification.
- Admin Portal for final publishing, priority management, and auditing.
- Robust Public REST APIs (`/api/v1/public/*`) for Discover module integration.
- `sharp`-based image processing pipeline generating large, medium, and thumbnail variants.
- End-to-end (E2E) test scaffolding using Playwright.
- Unit testing scaffolding using Vitest.

### Security
- Airtight role boundaries; societies cannot access ambassador routes, ambassadors cannot access admin routes.
- Fully parameterized SQL via Supabase JS client to prevent SQL injection.
- Zod validation integrated into API mutation endpoints.
