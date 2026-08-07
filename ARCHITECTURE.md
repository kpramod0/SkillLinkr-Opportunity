# Architecture Specification

## Standalone Microservice
The OMS operates entirely independently of the core SkillLinkr codebase. It shares no UI components or Next.js routing with the main app. 
Integration occurs exclusively through the `/api/v1/public` REST endpoints.

## Database Isolation
All tables in the OMS use the `opp_` prefix (e.g., `opp_opportunities`, `opp_users`). This ensures that if the databases are ever merged, there are zero naming collisions.

## Lifecycle State Machine
Opportunities flow through a strict state machine:
`draft` -> `submitted` -> `under_review` (Ambassador) -> `ready_for_publish` (Admin) -> `published` -> `live` -> `completed` -> `archived`

Transitions are enforced via the `AuditEngine` and Database constraints.

## Background Jobs
We use `pg_cron` (Migration 015) to run async jobs inside Postgres:
- Auto-transition `published` to `live` when `event_start_date` is reached.
- Auto-transition `live` to `completed` when `event_end_date` passes.
