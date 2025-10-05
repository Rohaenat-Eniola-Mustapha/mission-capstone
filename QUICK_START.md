# InfraTour Quick Start Guide

Get InfraTour running locally in under 5 minutes.

---

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- Git

---

## Installation

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd project

# Install dependencies
npm install
```

### 2. Environment Setup

The `.env` file is already configured with Supabase credentials:

```env
VITE_SUPABASE_URL=https://bqslcckluijswoqnrnhh.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key>
```

**No additional setup needed!**

### 3. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:5173**

---

## Quick Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Home, Sites, SiteDetail)
├── lib/            # API client and utilities
└── App.tsx         # Main app with routing
```

---

## Key Features

### Browse Tourist Sites
1. Navigate to "Tourist Sites" in navbar
2. View all Nigerian destinations
3. Search by name or state
4. Click card to view details

### View Site Details
1. Click any site card
2. See full description
3. Check active infrastructure alerts
4. Read visitor feedback
5. Get AI recommendations

### Submit Feedback
1. Navigate to site details
2. Scroll to "Share Your Experience"
3. Select rating (optional)
4. Write feedback message
5. Click "Submit Feedback"

---

## Database

**Pre-configured with sample data:**
- 4 Nigerian tourist sites
- 3 infrastructure alerts
- 3 visitor feedback entries
- 2 AI recommendations

**Access:** Supabase Dashboard at https://app.supabase.com

---

## API Endpoints

All endpoints are deployed and ready to use:

- **GET** `/get-sites` - List all sites
- **GET** `/get-sites?id={id}` - Site details
- **GET** `/get-alerts` - All alerts
- **POST** `/submit-feedback` - Submit feedback
- **GET** `/ai-recommend?site_id={id}` - AI recommendation

**Base URL:** `https://bqslcckluijswoqnrnhh.supabase.co/functions/v1`

---

## Testing the Platform

### Test Flow 1: Browse and Search
1. Start on homepage
2. Click "Explore Tourist Sites"
3. Use search: type "Obudu"
4. View filtered results

### Test Flow 2: View Site with Alerts
1. Navigate to Sites page
2. Click "Yankari Game Reserve" (has high alert)
3. Review active alerts section
4. Check AI recommendation (suggests alternatives)

### Test Flow 3: Submit Feedback
1. Navigate to any site detail page
2. Scroll to feedback form
3. Rate 5 stars
4. Write: "Great experience!"
5. Submit
6. See success message

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Environment Variables Not Loading
```bash
# Restart dev server
# Ctrl+C to stop, then npm run dev again
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Next Steps

- **Deploy:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- **Design:** Review [designs/DESIGN_OVERVIEW.md](./designs/DESIGN_OVERVIEW.md)
- **Full Documentation:** Read complete [README.md](./README.md)

---

## Common Issues

**Q: Can I use a different database?**
A: The app is configured for Supabase. Using another database requires modifying the API layer.

**Q: How do I add new tourist sites?**
A: Use Supabase Dashboard → Table Editor → tourist_sites → Insert row

**Q: Where are Edge Functions deployed?**
A: Already deployed to Supabase. Check `supabase/functions/` for source code.

**Q: Can I customize the design?**
A: Yes! Edit Tailwind classes in components. See `designs/DESIGN_OVERVIEW.md` for current system.

---

## Support

**Issues:** Open an issue on GitHub
**Docs:** See [README.md](./README.md)
**Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**You're ready to go!** Start with `npm run dev` and explore the platform.
