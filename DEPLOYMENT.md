# Deployment Guide

The OMS is designed for stateless edge deployment.

## Prerequisites
- Node.js 20+
- PostgreSQL (Supabase) Database

## Build
```bash
npm ci
npm run build
```

## Environment Variables
Ensure the following are set in the production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Required for Edge Functions / Webhooks)

## Vercel Deployment
This project is optimized for Vercel. 
Simply connect the repository and deploy. The Next.js App Router will handle ISR and SSR appropriately.
