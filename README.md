# InfraTour

##Project Overview
Tourists visiting major destinations in Nigeria often face challenges due to poor road conditions, lack of real-time travel information, and limited access to efficient transport routes. This project presents a digital web-based framework that enhances tourism accessibility by providing:

- Real-time infrastructure alerts (e.g., blocked roads, safety concerns)
- Community feedback on site accessibility and conditions
- AI-powered recommendations suggesting safer or alternative destinations

The system bridges the information gap between tourists and infrastructure authorities, promoting better travel decisions and boosting the tourism experience in Nigeria.

🔗 GitHub Repository

Repository Link: https://github.com/Rohaenat-Eniola-Mustapha/mission-capstone

## How to Set Up the Environment
1. Clone the repository
git clone https://github.com/Rohaenat-Eniola-Mustapha/mission-capstone
cd InfraTour

2. Install dependencies
For both frontend and backend:

npm install

3. Set up environment variables

Create a .env file in the root directory and include:

VITE_SUPABASE_URL=<>
VITE_SUPABASE_ANON_KEY=<>
VITE_GOOGLE_MAPS_API_KEY=<>
OPENAI_API_KEY=<>

4. Run the development server
npm run dev


Then open http://localhost:5173
 to view the website.

## Designs (Figma Mockups & Screenshots)

You can view the UI and style guide here:
🔗 Figma Link: https://www.figma.com/design/qE0jeDl23Si0U1f69bkoNq/Capstone?node-id=2-2&t=qzI6bqa5sjKna6sp-1


## System Overview

Frontend:

React + TypeScript + Tailwind CSS

Responsive, mobile-first UI

Pages: Home, Tourist Sites, Site Details (with feedback & AI recommendation panel)

Backend:

Node.js + Express (or Supabase Edge Functions)

REST API endpoints:

/api/sites

/api/alerts

/api/feedback

/api/ai/recommend

Database (Supabase / PostgreSQL):
Tables:

users

tourist_sites

infrastructure_alerts

feedback

ai_recommendations

🚀 Deployment Plan
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

Deployment Steps:

Push your final project to GitHub.

Connect the frontend to Vercel (it automatically detects React).

Deploy the backend to Render or use Supabase Functions.

Link the database URL and keys in the .env file.

Test the live site by visiting the Vercel deployment URL.
\n\n## Google Maps Integration\n\nInfraTour now includes **optional** Google Maps integration for enhanced route recommendations:\n\n### Features\n- **Interactive route maps** from user location to tourist sites\n- **Turn-by-turn directions** with accurate distance and duration\n- **Alternative route suggestions** when infrastructure alerts exist\n- **Automatic distance calculations** in AI recommendations\n\n### Setup (Optional)\n\nGoogle Maps is **completely optional**. The app works fully without it, using calculated estimates for distance and duration.\n\nTo enable interactive maps:\n\n1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)\n2. Enable these APIs:\n   - Maps JavaScript API\n   - Directions API\n3. Add to your `.env` file:\n   ```\n   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here\n   ```\n4. Restart the dev server\n\n If you don't configure Google Maps, the app still provides:\n- Distance estimates using Haversine formula\n- Duration calculations based on average speed\n- All AI recommendations with route information\n- Full functionality except interactive maps\n\n
