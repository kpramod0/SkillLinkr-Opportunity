# Disaster Recovery Plan
## SkillLinkr Opportunities Management System (OMS)

### 1. Database Backup & Restore
Since this module uses Supabase (PostgreSQL), Point-in-Time Recovery (PITR) is enabled.

#### Restore Procedure
1. Navigate to Supabase Dashboard > Database > Backups
2. Select the desired restore point (up to 7 days for Pro plan).
3. Confirm restore. This process takes ~2-5 minutes depending on DB size.

### 2. High Availability
The Next.js application is deployed on Vercel utilizing Edge caching globally. 
If a region goes down, Vercel automatically routes to the next healthy region.

### 3. Data Integrity & Reversion
Because we **never permanently delete** data:
- Accidental deletions are non-existent.
- Malicious changes to an opportunity can be reverted using the `opp_opportunity_versions` table.

#### Reversion Query
```sql
UPDATE opp_opportunities
SET 
  title = (SELECT snapshot->>'title' FROM opp_opportunity_versions WHERE opportunity_id = 'id' AND version_number = 1),
  description = (SELECT snapshot->>'description' FROM opp_opportunity_versions WHERE opportunity_id = 'id' AND version_number = 1)
WHERE id = 'id';
```

### 4. Background Jobs Failure
If `pg_cron` fails, the `publish-scheduled-opportunities` won't run.
- **Immediate Mitigation:** Run the manual bulk publish action from the Super Admin portal.
- **Root Cause Check:** Check Supabase SQL Editor logs for cron job failures.
