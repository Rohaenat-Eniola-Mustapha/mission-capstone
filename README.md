# InfraTour Nigeria

**A Digital Framework for Enhancing Tourism Infrastructure Accessibility in Nigeria**

InfraTour is a comprehensive web platform that addresses critical infrastructure challenges facing Nigerian tourism. By combining real-time infrastructure alerts, AI-powered recommendations, and community-driven feedback, InfraTour empowers tourists with the information they need to make safe, informed travel decisions across Nigeria's diverse destinations.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Code Examples](#code-examples)
- [Deployment](#deployment)
- [Design Resources](#design-resources)
- [Video Demo Script](#video-demo-script)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

### The Problem
Nigeria's tourism sector faces significant infrastructure challenges: unreliable road conditions, inadequate facility maintenance, limited safety information, and poor communication of real-time updates. These issues deter both domestic and international tourists, limiting economic growth and cultural exchange.

### The Solution
InfraTour provides a centralized platform where:
- **Real-time alerts** inform tourists about infrastructure conditions (roads, facilities, weather)
- **AI recommendations** analyze alerts and feedback to suggest optimal travel choices
- **Community feedback** shares authentic visitor experiences and ratings
- **Accessibility insights** help tourists make informed, safe decisions

### Impact
By increasing transparency and providing actionable insights, InfraTour enhances tourist confidence, promotes safer travel, and ultimately contributes to Nigeria's tourism economy.

---

## Features

### Core Functionality
- **Tourist Sites Directory:** Browse Nigerian attractions with detailed descriptions and locations
- **Infrastructure Alert System:** View real-time alerts categorized by severity (low, medium, high)
- **AI-Powered Recommendations:** Receive intelligent suggestions based on current conditions
- **Visitor Feedback:** Submit and read authentic reviews with star ratings
- **Search & Filter:** Find sites by name, state, or description
- **Responsive Design:** Optimized experience across desktop, tablet, and mobile devices

### AI Recommendation Engine
The platform includes a mock AI recommendation service that:
- Analyzes active infrastructure alerts by severity
- Considers historical visitor feedback and ratings
- Provides confidence scores (0.0-1.0) for recommendations
- Suggests alternative sites when high-severity alerts exist
- Can be easily extended with OpenAI integration for production use

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Supabase Edge Functions** - Serverless API endpoints
- **Deno** - Edge runtime environment
- **TypeScript** - Type-safe backend code

### Database
- **Supabase (PostgreSQL)** - Primary database
- **Row Level Security (RLS)** - Data access policies
- **SQL Migrations** - Version-controlled schema changes

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (already configured)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**

   The `.env` file is already configured with Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://bqslcckluijswoqnrnhh.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### Database Setup

The database has been pre-configured with:
- All required tables (users, tourist_sites, infrastructure_alerts, feedback, ai_recommendations)
- Sample data for 4 Nigerian tourist sites
- 3 infrastructure alerts with varying severity
- 3 visitor feedback entries
- 2 AI recommendation examples

**Migration file location:** `migrations/001_initial_schema.sql`

To view or modify the schema:
1. Navigate to the Supabase dashboard
2. Go to Database → Schema
3. Review tables and relationships

---

## Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIRecommendationPanel.tsx
│   │   ├── AlertBadge.tsx
│   │   ├── FeedbackForm.tsx
│   │   ├── Navbar.tsx
│   │   └── SiteCard.tsx
│   ├── lib/                 # Utilities and API clients
│   │   ├── api.ts          # API endpoint functions
│   │   └── supabase.ts     # Supabase client & types
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Sites.tsx
│   │   └── SiteDetail.tsx
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── supabase/
│   └── functions/          # Edge Functions
│       ├── get-sites/
│       ├── get-alerts/
│       ├── submit-feedback/
│       └── ai-recommend/
├── designs/                # Design documentation
│   ├── DESIGN_OVERVIEW.md
│   └── WIREFRAMES.md
├── migrations/            # SQL migration files
│   └── 001_initial_schema.sql
├── .env                   # Environment variables
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Database Schema

### Tables

#### `users`
```sql
id          uuid PRIMARY KEY
name        text NOT NULL
email       text UNIQUE NOT NULL
role        text DEFAULT 'tourist'
created_at  timestamptz DEFAULT now()
```

#### `tourist_sites`
```sql
id          uuid PRIMARY KEY
name        text NOT NULL
state       text NOT NULL
description text NOT NULL
image_url   text
latitude    decimal(10,8)
longitude   decimal(11,8)
created_at  timestamptz DEFAULT now()
```

#### `infrastructure_alerts`
```sql
id          uuid PRIMARY KEY
site_id     uuid REFERENCES tourist_sites(id)
alert_type  text NOT NULL
message     text NOT NULL
severity    text CHECK (severity IN ('low','medium','high'))
is_active   boolean DEFAULT true
created_at  timestamptz DEFAULT now()
```

#### `feedback`
```sql
id          uuid PRIMARY KEY
user_id     uuid REFERENCES users(id)
site_id     uuid REFERENCES tourist_sites(id)
message     text NOT NULL
rating      int CHECK (rating >= 1 AND rating <= 5)
created_at  timestamptz DEFAULT now()
```

#### `ai_recommendations`
```sql
id          uuid PRIMARY KEY
site_id     uuid REFERENCES tourist_sites(id)
suggestion  text NOT NULL
confidence  numeric(3,2) CHECK (confidence >= 0 AND confidence <= 1)
created_at  timestamptz DEFAULT now()
```

### Relationships
- `infrastructure_alerts.site_id` → `tourist_sites.id`
- `feedback.site_id` → `tourist_sites.id`
- `feedback.user_id` → `users.id`
- `ai_recommendations.site_id` → `tourist_sites.id`

### Security
All tables have Row Level Security (RLS) enabled with appropriate policies:
- Public read access for sites and alerts
- Authenticated write access for feedback
- Users can only modify their own data

---

## API Endpoints

All endpoints are deployed as Supabase Edge Functions.

**Base URL:** `https://bqslcckluijswoqnrnhh.supabase.co/functions/v1`

### `GET /get-sites`
Fetch all tourist sites with alert counts.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Obudu Cattle Ranch",
    "state": "Cross River",
    "description": "...",
    "alert_count": 1
  }
]
```

### `GET /get-sites?id={siteId}`
Fetch detailed information for a specific site.

**Response:**
```json
{
  "site": { /* site object */ },
  "alerts": [ /* array of alerts */ ],
  "feedback": [ /* array of feedback */ ]
}
```

### `GET /get-alerts`
Fetch all active infrastructure alerts.

**Response:**
```json
[
  {
    "id": "uuid",
    "site_id": "uuid",
    "alert_type": "road",
    "message": "Road access affected...",
    "severity": "high",
    "is_active": true,
    "tourist_sites": {
      "name": "Site Name",
      "state": "State"
    }
  }
]
```

### `POST /submit-feedback`
Submit visitor feedback for a site.

**Request Body:**
```json
{
  "site_id": "uuid",
  "message": "Great experience!",
  "rating": 5,
  "user_id": "uuid" // optional
}
```

**Response:**
```json
{
  "success": true,
  "feedback": { /* created feedback object */ }
}
```

### `GET /ai-recommend?site_id={siteId}`
Get AI-powered recommendation for a site.

**Response:**
```json
{
  "site_id": "uuid",
  "site_name": "Yankari Game Reserve",
  "suggestion": "Due to current high-severity alerts...",
  "confidence": 0.85,
  "generated_at": "2025-01-15T10:30:00Z"
}
```

---

## Code Examples

### Example 1: React Component with State Management

```tsx
// src/components/FeedbackForm.tsx
import { useState } from 'react';
import { submitFeedback } from '../lib/api';

interface FeedbackFormProps {
  siteId: string;
  onSuccess?: () => void;
}

export function FeedbackForm({ siteId, onSuccess }: FeedbackFormProps) {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitFeedback({
        site_id: siteId,
        message: message.trim(),
        rating: rating > 0 ? rating : undefined,
      });

      setMessage('');
      setRating(0);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example 2: Fetching Data from API

```tsx
// src/lib/api.ts
import type { TouristSite } from './supabase';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

const getHeaders = () => ({
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});

export async function fetchSites(): Promise<TouristSite[]> {
  const response = await fetch(`${API_BASE_URL}/get-sites`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sites');
  }

  return response.json();
}
```

### Example 3: Dynamic UI Update Based on State

```tsx
// src/pages/Sites.tsx
export function Sites() {
  const [sites, setSites] = useState<TouristSite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSites(sites);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.state.toLowerCase().includes(query)
    );
    setFilteredSites(filtered);
  }, [searchQuery, sites]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search sites..."
      />
      {/* Render filtered sites */}
    </div>
  );
}
```

---

## Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**
   ```bash
   # Push code to GitHub
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Backend Deployment (Supabase)

Edge Functions are already deployed to Supabase. No additional deployment needed.

**Deployed Functions:**
- `get-sites`
- `get-alerts`
- `submit-feedback`
- `ai-recommend`

### Database (Supabase)

Database is already provisioned and running at:
```
https://bqslcckluijswoqnrnhh.supabase.co
```

**To manage:**
1. Visit [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Database → Tables

---

## Design Resources

### Design Documentation
- **Style Guide:** `designs/DESIGN_OVERVIEW.md`
- **Wireframes:** `designs/WIREFRAMES.md`

### Color Palette
- **Primary:** Emerald Green (#059669)
- **Secondary:** Teal (#14b8a6)
- **Alerts:** Red (high), Amber (medium), Blue (low)
- **AI Features:** Indigo/Purple gradient

### Figma Mockups
Design files exported to `/designs/` folder. In a production environment, these would link to:
- Figma Community: `[placeholder-link]`
- Wireframes: Available as markdown in `designs/WIREFRAMES.md`
- Style Guide: Available in `designs/DESIGN_OVERVIEW.md`

---

## Video Demo Script

**Duration:** 5-7 minutes

### Script Outline

**[0:00 - 0:30] Introduction**
- "Welcome to InfraTour Nigeria, a digital platform enhancing tourism infrastructure accessibility."
- "This demo showcases how tourists can make informed, safe travel decisions using real-time data and AI recommendations."

**[0:30 - 1:30] Design Overview**
- Open Figma or show design documentation
- "Our design system uses emerald green as the primary brand color, representing growth and nature."
- Walk through wireframes: Home, Sites List, Site Detail
- "We prioritized accessibility, clear information hierarchy, and mobile-responsive layouts."

**[1:30 - 2:30] Home Page**
- Navigate to homepage
- "The homepage provides an overview with AI-powered insights."
- Point out:
  - AI metrics panel showing safe sites count
  - Feature cards (Real-Time Alerts, AI Recommendations, Community Insights)
  - High priority alerts section
  - Primary CTA button

**[2:30 - 3:30] Tourist Sites Directory**
- Click "Explore Tourist Sites"
- "Here users can browse all Nigerian tourist destinations."
- Demonstrate search functionality: type "Obudu"
- Show site cards with alert badges
- "Notice sites with active alerts display a prominent badge."

**[3:30 - 4:30] Site Details Page**
- Click on a site card (e.g., Yankari Game Reserve)
- "The detail page provides comprehensive information."
- Walk through:
  - Hero image and location
  - Full site description
  - Active alerts section with severity badges
  - Visitor feedback with ratings

**[4:30 - 5:30] AI Recommendations**
- Scroll to AI Recommendation panel
- "Our AI analyzes current alerts and feedback to provide recommendations."
- Point out confidence score and suggestion text
- "In this case, due to high-severity alerts, the AI suggests alternative destinations."

**[5:30 - 6:30] Submit Feedback**
- Scroll to feedback form
- Demonstrate:
  - Star rating selection
  - Text input
  - Submit button
- "After submission, feedback appears in the visitor section and influences future AI recommendations."

**[6:30 - 7:00] Database Overview**
- Switch to Supabase dashboard
- Show tables: tourist_sites, infrastructure_alerts, feedback, ai_recommendations
- "All data is stored in Supabase with Row Level Security for data protection."
- Show sample data in tables

**[7:00 - 7:15] Closing**
- "InfraTour empowers Nigerian tourists with transparency, real-time insights, and AI-powered recommendations."
- "Thank you for watching! Visit our GitHub repository for more information."

### Demo Recording Tips
1. Use high-resolution screen recording (1920x1080)
2. Enable browser extension for clear mouse cursor visibility
3. Speak clearly and pace yourself
4. Show both desktop and mobile responsive views
5. Highlight interactive elements (hover effects, transitions)
6. Include captions for accessibility

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and TypeScript conventions
- Add comments for complex logic
- Test all changes locally before submitting
- Update documentation as needed
- Ensure build succeeds (`npm run build`)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact & Support

**Project Repository:** `[GitHub URL Placeholder]`

**Documentation:**
- [Quick Start Guide](./QUICK_START.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Design System](./designs/DESIGN_OVERVIEW.md)

**Questions?** Open an issue on GitHub or contact the development team.

---

**Built with:** React, TypeScript, Supabase, Tailwind CSS, and Vite

**Demo Video:** `[YouTube Link Placeholder - Unlisted]`

---

*Enhancing Nigeria's tourism experience, one insight at a time.*
