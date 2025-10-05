import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TouristSite {
  id: string;
  name: string;
  state: string;
  description: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  alert_count?: number;
}

export interface InfrastructureAlert {
  id: string;
  site_id: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  is_active: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  site_id: string;
  message: string;
  rating?: number;
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

export interface AIRecommendation {
  site_id: string;
  site_name: string;
  suggestion: string;
  confidence: number;
  recommendation_id?: string;
  generated_at: string;
}
