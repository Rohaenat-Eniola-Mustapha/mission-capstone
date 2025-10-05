# InfraTour Deployment Guide

This guide provides detailed instructions for deploying the InfraTour platform to production environments.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Management](#database-management)
- [Environment Variables](#environment-variables)
- [CI/CD Setup](#cicd-setup)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## Overview

**InfraTour Architecture:**
- **Frontend:** React SPA deployed on Vercel
- **Backend:** Supabase Edge Functions (serverless)
- **Database:** Supabase (PostgreSQL with RLS)
- **CDN:** Vercel Edge Network

**Deployment Strategy:** Git-based continuous deployment with preview environments for pull requests.

---

## Prerequisites

Before deploying, ensure you have:

1. **Accounts:**
   - GitHub account with repository access
   - Vercel account (free tier sufficient)
   - Supabase account (already configured)

2. **Tools:**
   - Git CLI
   - Node.js 18+
   - npm or yarn

3. **Access:**
   - Repository push access
   - Vercel project admin access
   - Supabase project dashboard access

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"

# Push to GitHub
git remote add origin https://github.com/your-username/infratour-nigeria.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration

#### Step 3: Configure Build Settings

**Framework Preset:** Vite
**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

**Development Command:**
```bash
npm run dev
```

#### Step 4: Add Environment Variables

In Vercel project settings, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://bqslcckluijswoqnrnhh.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `<your-anon-key>` | Production, Preview, Development |

**Security Note:** The anon key is safe to expose in frontend code as it's paired with RLS policies.

#### Step 5: Deploy

Click "Deploy" button. Vercel will:
1. Install dependencies
2. Run build command
3. Deploy to CDN
4. Provide a production URL

**Expected Build Time:** 2-3 minutes

#### Step 6: Verify Deployment

Visit the provided Vercel URL and test:
- Homepage loads correctly
- Navigation works
- Sites list displays data
- Site details page shows alerts and feedback
- Feedback form submits successfully
- AI recommendations load

### Option 2: Netlify

#### Step 1: Build Settings

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Step 3: Environment Variables

In Netlify dashboard → Site settings → Build & deploy → Environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Option 3: Traditional Hosting

```bash
# Build production assets
npm run build

# Upload contents of 'dist' folder to:
# - AWS S3 + CloudFront
# - DigitalOcean Spaces
# - Any static hosting provider

# Ensure index.html is served for all routes (SPA)
```

---

## Backend Deployment

### Supabase Edge Functions

**Status:** Edge Functions are already deployed.

**Deployed Functions:**
- `get-sites` - Fetch tourist sites
- `get-alerts` - Fetch infrastructure alerts
- `submit-feedback` - Submit visitor feedback
- `ai-recommend` - Generate AI recommendations

#### Redeploying Functions

If you need to update a function:

1. **Modify Function Code**
   ```typescript
   // supabase/functions/function-name/index.ts
   // Make your changes
   ```

2. **Deploy via Supabase CLI**

   The functions are deployed using the Supabase Management API. To redeploy manually:

   ```bash
   # Contact your Supabase admin or use the dashboard
   # Functions are deployed through the Supabase platform
   ```

3. **Verify Function**

   Test the endpoint:
   ```bash
   curl https://bqslcckluijswoqnrnhh.supabase.co/functions/v1/get-sites \
     -H "Authorization: Bearer <anon-key>"
   ```

#### Function Logs

View logs in Supabase Dashboard:
1. Navigate to Edge Functions
2. Select function
3. View "Logs" tab for real-time debugging

---

## Database Management

### Current Setup

**Database URL:** `https://bqslcckluijswoqnrnhh.supabase.co`

**Tables:**
- `users`
- `tourist_sites`
- `infrastructure_alerts`
- `feedback`
- `ai_recommendations`

### Running Migrations

**Location:** `migrations/001_initial_schema.sql`

**Migration Already Applied:** The initial schema has been deployed.

#### Future Migrations

To add new migrations:

1. **Create Migration File**
   ```sql
   -- migrations/002_add_new_feature.sql

   /*
     # Add New Feature

     1. Changes
       - Description of changes

     2. Security
       - RLS policies
   */

   ALTER TABLE tourist_sites ADD COLUMN new_field text;
   ```

2. **Apply via Supabase Dashboard**
   - Go to Database → Schema
   - Run SQL manually or use migrations tool

3. **Update Documentation**
   - Add migration notes to README
   - Update schema documentation

### Database Backups

**Automatic Backups:** Supabase provides daily backups (retained for 7 days on free tier).

**Manual Backup:**
1. Supabase Dashboard → Database → Backups
2. Click "Manual Backup"
3. Download or store in cloud

**Recovery:**
- Contact Supabase support
- Restore from backup point-in-time

---

## Environment Variables

### Production Environment

```env
# Frontend (.env.production)
VITE_SUPABASE_URL=https://bqslcckluijswoqnrnhh.supabase.co
VITE_SUPABASE_ANON_KEY=<production-anon-key>
```

### Development Environment

```env
# Frontend (.env.local)
VITE_SUPABASE_URL=https://bqslcckluijswoqnrnhh.supabase.co
VITE_SUPABASE_ANON_KEY=<dev-anon-key>
```

### Security Best Practices

1. **Never commit .env files** - Already in `.gitignore`
2. **Use different keys** for development/production (if available)
3. **Rotate keys** periodically
4. **Anon key is safe** for frontend use (protected by RLS)
5. **Service role key** should NEVER be exposed to frontend

---

## CI/CD Setup

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Vercel Automatic Deployment

Vercel automatically deploys:
- **Production:** On push to `main` branch
- **Preview:** On pull requests
- **Development:** On push to other branches

---

## Domain Configuration

### Custom Domain Setup

#### Step 1: Add Domain in Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Enter your domain (e.g., `infratour.ng`)
3. Follow DNS configuration instructions

#### Step 2: Configure DNS

Add these records to your DNS provider:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

#### Step 3: SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

**Expected Propagation Time:** 24-48 hours

#### Step 4: Verify

```bash
curl -I https://infratour.ng
# Should return 200 OK with valid SSL
```

---

## Monitoring & Maintenance

### Uptime Monitoring

**Tools:**
- Vercel Analytics (built-in)
- UptimeRobot (free external monitoring)
- Pingdom

**Setup UptimeRobot:**
1. Create account at uptimerobot.com
2. Add monitor for your Vercel URL
3. Set alert email/SMS
4. Monitor every 5 minutes

### Performance Monitoring

**Vercel Analytics:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Lighthouse scores
- View in Vercel Dashboard → Analytics

**Supabase Dashboard:**
- Database queries performance
- Edge Function invocations
- Error rates
- Response times

### Error Tracking

**Frontend Errors:**
- Browser console (for development)
- Sentry (for production - optional)

**Backend Errors:**
- Supabase Edge Function logs
- Check Dashboard → Edge Functions → Logs

### Regular Maintenance Tasks

**Weekly:**
- Review error logs
- Check uptime reports
- Monitor database size

**Monthly:**
- Update dependencies (`npm outdated`)
- Review and optimize slow queries
- Check SSL certificate expiry

**Quarterly:**
- Security audit
- Performance optimization
- User feedback analysis

---

## Rollback Procedures

### Frontend Rollback

#### Vercel Rollback

1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click three dots → "Promote to Production"
4. Confirm rollback

**Rollback Time:** Instant (< 1 minute)

#### Git Rollback

```bash
# Find commit to rollback to
git log --oneline

# Revert to specific commit
git revert <commit-hash>
git push origin main

# Vercel will auto-deploy the revert
```

### Database Rollback

**Restore from Backup:**

1. Supabase Dashboard → Database → Backups
2. Select backup point
3. Click "Restore"
4. Confirm data restoration

**Warning:** Database rollback affects all users immediately.

### Edge Function Rollback

Edge Functions maintain version history in Supabase. Contact Supabase support or redeploy previous version from git history.

---

## Troubleshooting

### Build Failures

**Issue:** `npm run build` fails

**Solutions:**
1. Check Node.js version (must be 18+)
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
4. Check TypeScript errors: `npm run typecheck`

### Environment Variable Issues

**Issue:** "Cannot read environment variables"

**Solutions:**
1. Verify `.env` file exists and contains correct values
2. Restart dev server after changing `.env`
3. Ensure variables start with `VITE_` prefix
4. Check Vercel environment variables are set for all environments

### API Connection Errors

**Issue:** Frontend cannot connect to Supabase

**Solutions:**
1. Verify `VITE_SUPABASE_URL` is correct
2. Check `VITE_SUPABASE_ANON_KEY` is valid
3. Test Edge Function directly with curl
4. Check browser console for CORS errors
5. Verify Supabase project is active (not paused)

### Database Query Failures

**Issue:** Queries returning empty or failing

**Solutions:**
1. Check RLS policies are not too restrictive
2. Verify table names and column names match schema
3. Test query in Supabase SQL editor
4. Check function logs for errors
5. Verify foreign key constraints

### Performance Issues

**Issue:** Slow page loads

**Solutions:**
1. Check Vercel Analytics for bottlenecks
2. Optimize images (use WebP format)
3. Enable Vercel Image Optimization
4. Review database query performance
5. Add database indexes for frequent queries
6. Implement caching strategies

### CORS Errors

**Issue:** "CORS policy blocked"

**Solutions:**
1. Verify Edge Functions include CORS headers
2. Check `Access-Control-Allow-Origin: *` is set
3. Handle OPTIONS preflight requests
4. Test with curl to isolate frontend vs. backend issue

---

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] Edge Functions responding correctly
- [ ] Database queries executing successfully
- [ ] Monitoring tools configured
- [ ] Error tracking active
- [ ] Backup schedule confirmed
- [ ] Team access configured
- [ ] Documentation updated
- [ ] Stakeholders notified

---

## Support & Resources

**Vercel Documentation:** https://vercel.com/docs
**Supabase Documentation:** https://supabase.com/docs
**Vite Documentation:** https://vitejs.dev

**Project Repository:** `[GitHub URL]`
**Issues:** `[GitHub Issues URL]`

---

*Last Updated: January 2025*
