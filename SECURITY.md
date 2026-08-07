# Security Specification

## 1. Row Level Security (RLS)
The database enforces security at the Postgres level. Even if the backend API is compromised, the `opp_users.role` bound to the active session strictly limits SELECT/UPDATE/INSERT/DELETE operations.

## 2. No Permanent Deletes
All destructive actions are soft-deletes (archiving). Data retention is enforced via `ON DELETE RESTRICT` constraints on critical foreign keys.

## 3. Middleware RBAC
The `src/middleware.ts` intercepts all requests before they hit the React application. It verifies the session and blocks navigation to unauthorized portals.
- Attempting to access `/admin` as a `society` redirects to `/`.

## 4. Input Validation
All mutation APIs utilize strict `Zod` validation schemas. Unexpected fields are stripped, and malformed requests return `400 Bad Request`.
