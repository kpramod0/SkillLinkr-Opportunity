# SkillLinkr Opportunities Management System (OMS)

Version 1.0.0-rc.1 (Release Candidate 1)

## Overview
The Opportunities Management System (OMS) is a standalone microservice responsible for collecting, verifying, publishing, and managing opportunities (Hackathons, Workshops, Internships, Seminars) across educational institutions throughout India.

It serves as the backend engine for the SkillLinkr platform's Opportunity Discovery module, providing robust role-based access control (RBAC), approval workflows, and public APIs.

## Architecture & Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (via Supabase) with `opp_` schema prefix isolation
- **Authentication**: Supabase SSR (Server-Side Auth)
- **Background Jobs**: `pg_cron` for automated lifecycle management
- **Testing**: Vitest (Unit), Playwright (E2E)

## Quick Start
1. `npm install`
2. Configure `.env.local` with Supabase credentials
3. `npm run dev`

## Portals
- `/admin`: Super Admin & Regional Admin panel
- `/ambassador`: Campus Ambassador verification portal
- `/society`: College Society submission portal
