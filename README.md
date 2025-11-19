# InfraTour

## Project Overview
Tourists visiting major destinations in Nigeria often face challenges such as poor road conditions, lack of real-time information, and limited access to reliable travel routes.

InfraTour provides a digital web-based framework that enhances tourism accessibility by offering:

1. Real-time infrastructure alerts (e.g., blocked roads, flooding, safety issues)

2. Community feedback on site accessibility and conditions

3. AI-powered recommendations suggesting safer or alternative destinations

The platform bridges the gap between tourists, communities, and government authorities, promoting informed travel and sustainable tourism infrastructure management in Nigeria.

## GitHub Repository & Live DEmo

Repository Link: https://github.com/Rohaenat-Eniola-Mustapha/mission-capstone
Live Site: https://mission-capstone-kappa.vercel.app/

## How to Set Up the Environment
1. Clone the repository:

  ```bash
  git clone https://github.com/Rohaenat-Eniola-Mustapha/mission-capstone
  ```

2. Install dependencies
For both frontend and backend:
```bash
npm install
```

3. Set up environment variables

Create a .env file in the root directory and include:
```json
VITE_SUPABASE_URL=<>
VITE_SUPABASE_ANON_KEY=<>
VITE_GOOGLE_MAPS_API_KEY=<>
OPENAI_API_KEY=<>
```

4. Run the development server
```bash
npm run dev
```

Then open http://localhost:5173
 to view the website.

## Designs (Figma Mockups)

You can view the UI and style guide here:

Figma Link: https://www.figma.com/design/qE0jeDl23Si0U1f69bkoNq/Capstone?node-id=2-2&t=qzI6bqa5sjKna6sp-1


## System Overview

### Frontend:

1. React + TypeScript + Tailwind CSS
2. Responsive, mobile-first UI
3. Pages:
     - Home
     - Tourist Sites
     - Site Details (with feedback & AI recommendation panel)

### Backend:

1. Node.js + Express (or Supabase Edge Functions)
2. REST API endpoints:
    - /api/sites
    
    - /api/alerts
    
    - /api/feedback
    
    - /api/ai/recommend

### Database (Supabase / PostgreSQL):
1. Tables:
    - users
    - tourist_sites
    - infrastructure_alerts
    - feedback
    - ai_recommendations

## Deployment Plan
Component	Platform	Purpose
Frontend	Vercel
	For hosting the React app (automatic GitHub deployment)
Backend	 Supabase Edge Functions
	For hosting API routes
Database	Supabase
	PostgreSQL database with Row Level Security
Version Control	GitHub
	Repository for collaboration and updates
AI Integration	OpenAI API 	For generating personalized tourism recommendations

### Deployment Steps:

1. Push your final project to GitHub.
2. Connect the frontend repo to Vercel — it auto-detects React.
3. Link Supabase environment variables in Vercel.
4. Deploy → Verify live build.
5. Visit my deployed site:
    https://mission-capstone-kappa.vercel.app/

## Testing Scenarios:

Functional Testing: Feedback submission, alerts display, AI suggestion.

Data Variation Testing: Multiple feedback entries with different ratings.

Performance Testing:

Tested on Chrome (desktop) and mobile browser.

Page load time: ~2.4s on 4G connection.

## Analysis

The web app achieved its core objective of bridging communication between tourists and infrastructure authorities.

Feedback functionality initially failed due to Supabase RLS, later resolved through policy updates.

AI Recommendation feature functions effectively, suggesting alternative sites with confidence values.

Deployment on Vercel was smooth and reproducible.

Overall, the system demonstrates how AI and open data platforms like Supabase can enhance sustainable tourism planning in Nigeria.

## Discussion

The project milestones — from Supabase setup, UI design, feedback integration, and AI recommendation — each played a critical role in creating a complete and functional prototype.

This web app empowers tourism agencies and visitors to share real-time insights, promoting accountability and informed decisions in infrastructure maintenance and development.

## Recommendations & Future Work

- Admin Dashboard: Allow registered site owners (e.g., Obudu Cattle Ranch) to manage site info, links, and contact details.

- Interactive Maps: Integrate OpenStreetMap to visualize site locations.

- Offline Mode: Enable caching for users with poor internet.

- Authentication: Role-based admin and moderator access for better data management.

- Enhanced AI: Use larger models for context-aware tourism insights.

## Demo Video

Youtube Link: https://youtu.be/1HXOnyN6i_A