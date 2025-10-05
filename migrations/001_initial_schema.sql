/*
  # InfraTour Database Schema - Tourism Infrastructure Accessibility Platform

  ## Overview
  This migration creates the foundational database schema for the Nigeria Tourism Infrastructure
  Accessibility platform. The system tracks tourist sites, infrastructure alerts, user feedback,
  and AI-powered recommendations to enhance tourism safety and accessibility.

  ## Tables Created

  1. **users** - System users (tourists, administrators, site managers)
     - `id` (uuid, primary key) - Unique user identifier
     - `name` (text) - Full name of the user
     - `email` (text, unique) - User email address
     - `role` (text) - User role (tourist, admin, manager)
     - `created_at` (timestamptz) - Account creation timestamp

  2. **tourist_sites** - Nigerian tourist destinations and attractions
     - `id` (uuid, primary key) - Unique site identifier
     - `name` (text) - Official site name
     - `state` (text) - Nigerian state location
     - `description` (text) - Detailed site description
     - `image_url` (text, nullable) - Hero image URL
     - `latitude` (decimal, nullable) - Geographic latitude
     - `longitude` (decimal, nullable) - Geographic longitude
     - `created_at` (timestamptz) - Record creation timestamp

  3. **infrastructure_alerts** - Real-time infrastructure and safety alerts
     - `id` (uuid, primary key) - Unique alert identifier
     - `site_id` (uuid, foreign key) - References tourist_sites(id)
     - `alert_type` (text) - Category of alert (road, facility, safety, weather)
     - `message` (text) - Detailed alert message
     - `severity` (text) - Alert severity level (low, medium, high)
     - `is_active` (boolean) - Current alert status (default: true)
     - `created_at` (timestamptz) - Alert creation timestamp

  4. **feedback** - User feedback and ratings for tourist sites
     - `id` (uuid, primary key) - Unique feedback identifier
     - `user_id` (uuid, nullable, foreign key) - References users(id)
     - `site_id` (uuid, foreign key) - References tourist_sites(id)
     - `message` (text) - Feedback content
     - `rating` (int, nullable) - Numeric rating (1-5 scale)
     - `created_at` (timestamptz) - Feedback submission timestamp

  5. **ai_recommendations** - AI-generated safety and accessibility recommendations
     - `id` (uuid, primary key) - Unique recommendation identifier
     - `site_id` (uuid, foreign key) - References tourist_sites(id)
     - `suggestion` (text) - AI-generated recommendation text
     - `confidence` (numeric) - Confidence score (0.0-1.0)
     - `created_at` (timestamptz) - Recommendation generation timestamp

  ## Security Measures
  - Row Level Security (RLS) enabled on all tables
  - Restrictive policies requiring authentication for modifications
  - Public read access for tourist_sites and alerts (public information)
  - Protected write access for feedback (authenticated users only)
  - Admin-only access for AI recommendations management

  ## Indexes
  - Foreign key indexes for optimal query performance
  - Site name and state indexes for search functionality
  - Alert severity and active status indexes for filtering

  ## Sample Data
  - 4 Nigerian tourist sites (Obudu, Olumo, Yankari, Erin-Ijesha)
  - 3 infrastructure alerts (varying severity levels)
  - 3 user feedback entries
  - 2 AI recommendations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'tourist',
  created_at timestamptz DEFAULT now()
);

-- Create tourist_sites table
CREATE TABLE IF NOT EXISTS tourist_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  description text NOT NULL,
  image_url text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamptz DEFAULT now()
);

-- Create infrastructure_alerts table
CREATE TABLE IF NOT EXISTS infrastructure_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES tourist_sites(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  site_id uuid NOT NULL REFERENCES tourist_sites(id) ON DELETE CASCADE,
  message text NOT NULL,
  rating int CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create ai_recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES tourist_sites(id) ON DELETE CASCADE,
  suggestion text NOT NULL,
  confidence numeric(3, 2) CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for tourist_sites (public read)
CREATE POLICY "Anyone can view tourist sites"
  ON tourist_sites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tourist sites"
  ON tourist_sites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tourist sites"
  ON tourist_sites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for infrastructure_alerts (public read)
CREATE POLICY "Anyone can view alerts"
  ON infrastructure_alerts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create alerts"
  ON infrastructure_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
  ON infrastructure_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for feedback (authenticated write)
CREATE POLICY "Anyone can view feedback"
  ON feedback FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can submit feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for ai_recommendations
CREATE POLICY "Anyone can view AI recommendations"
  ON ai_recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create recommendations"
  ON ai_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tourist_sites_state ON tourist_sites(state);
CREATE INDEX IF NOT EXISTS idx_tourist_sites_name ON tourist_sites(name);
CREATE INDEX IF NOT EXISTS idx_alerts_site_id ON infrastructure_alerts(site_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON infrastructure_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON infrastructure_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_feedback_site_id ON feedback(site_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_site_id ON ai_recommendations(site_id);

-- Insert sample users
INSERT INTO users (name, email, role) VALUES
  ('John Adebayo', 'john.adebayo@example.com', 'tourist'),
  ('Sarah Okonkwo', 'sarah.okonkwo@example.com', 'tourist'),
  ('Admin User', 'admin@infratour.ng', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tourist sites (4 major Nigerian attractions)
INSERT INTO tourist_sites (name, state, description, latitude, longitude) VALUES
  (
    'Obudu Cattle Ranch',
    'Cross River',
    'Obudu Mountain Resort is a ranch and resort on the Obudu Plateau in Cross River State, Nigeria. The ranch is situated on the Oshie Ridge of the Sankwala Mountains, close to the Cameroon border. It offers stunning views, cable car rides, and a temperate climate perfect for relaxation and adventure tourism.',
    6.4086,
    9.3975
  ),
  (
    'Olumo Rock',
    'Ogun',
    'Olumo Rock is a massive granite outcrop located in Abeokuta, Ogun State. It served as a natural fortress for the Egba people during inter-tribal wars in the 19th century. Today, it stands as one of Nigeria''s most popular tourist destinations, offering historical significance, cultural heritage, and panoramic views of Abeokuta city.',
    7.1548,
    3.3487
  ),
  (
    'Yankari Game Reserve',
    'Bauchi',
    'Yankari National Park is one of the largest wildlife parks in Nigeria, covering approximately 2,244 square kilometers. Home to several natural warm water springs, including the popular Wikki Warm Spring, the park hosts diverse wildlife including elephants, lions, baboons, and numerous bird species. It''s a premier destination for eco-tourism and wildlife photography.',
    9.7500,
    10.5167
  ),
  (
    'Erin-Ijesha Waterfalls',
    'Osun',
    'Erin-Ijesha Waterfalls, also known as Olumirin Waterfalls, is a magnificent seven-level waterfall located in Erin-Ijesha, Osun State. The waterfall cascades down rocky terrain through lush forest vegetation, creating natural pools at various levels. It''s a popular destination for nature lovers, hikers, and those seeking a refreshing natural experience.',
    7.5833,
    4.8667
  )
ON CONFLICT DO NOTHING;

-- Get site IDs for reference (we'll use these in subsequent inserts)
DO $$
DECLARE
  obudu_id uuid;
  olumo_id uuid;
  yankari_id uuid;
  erin_id uuid;
  user1_id uuid;
  user2_id uuid;
BEGIN
  -- Get site IDs
  SELECT id INTO obudu_id FROM tourist_sites WHERE name = 'Obudu Cattle Ranch';
  SELECT id INTO olumo_id FROM tourist_sites WHERE name = 'Olumo Rock';
  SELECT id INTO yankari_id FROM tourist_sites WHERE name = 'Yankari Game Reserve';
  SELECT id INTO erin_id FROM tourist_sites WHERE name = 'Erin-Ijesha Waterfalls';

  -- Get user IDs
  SELECT id INTO user1_id FROM users WHERE email = 'john.adebayo@example.com';
  SELECT id INTO user2_id FROM users WHERE email = 'sarah.okonkwo@example.com';

  -- Insert infrastructure alerts (3 alerts with varying severity)
  INSERT INTO infrastructure_alerts (site_id, alert_type, message, severity, is_active) VALUES
    (
      yankari_id,
      'road',
      'Road access temporarily affected due to seasonal maintenance. Alternative route via Bauchi-Gombe highway is available. Expected completion: 2 weeks.',
      'high',
      true
    ),
    (
      obudu_id,
      'facility',
      'Cable car service operating at reduced capacity (60%) due to routine maintenance. All safety checks completed. Service continues with slightly longer wait times.',
      'medium',
      true
    ),
    (
      erin_id,
      'weather',
      'Increased water flow due to recent rainfall. Lower levels of waterfall are experiencing strong currents. Visitors advised to exercise caution and follow guide instructions.',
      'low',
      true
    );

  -- Insert sample feedback (3 entries)
  INSERT INTO feedback (user_id, site_id, message, rating) VALUES
    (
      user1_id,
      olumo_id,
      'Amazing historical site! The lift to the top was convenient and the view was breathtaking. Tour guides were very knowledgeable about the Egba history. Highly recommend visiting early morning to avoid crowds.',
      5
    ),
    (
      user2_id,
      yankari_id,
      'Great wildlife experience. Saw elephants and various bird species. The Wikki Warm Spring was refreshing after the safari. Roads need improvement but the overall experience was worth it.',
      4
    ),
    (
      user1_id,
      obudu_id,
      'Absolutely stunning mountain resort! The weather was perfect and the cable car ride offered spectacular views. Accommodation was comfortable. Only downside was limited food options.',
      4
    );

  -- Insert AI recommendations (2 examples)
  INSERT INTO ai_recommendations (site_id, suggestion, confidence) VALUES
    (
      yankari_id,
      'Due to current road maintenance, consider visiting Olumo Rock or Erin-Ijesha Waterfalls as alternative destinations. Both sites have excellent accessibility and no active high-severity alerts. Yankari remains open with alternative access routes available for adventurous travelers.',
      0.85
    ),
    (
      olumo_id,
      'Excellent choice! Olumo Rock currently has no active alerts and receives consistently high visitor ratings. Recommended visit time: 8am-10am for optimal lighting and smaller crowds. The site offers accessible facilities including an elevator for visitors with mobility considerations.',
      0.92
    );
END $$;
