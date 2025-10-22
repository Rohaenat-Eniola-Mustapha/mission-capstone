import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fetch all tourist sites
export async function fetchSites() {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-sites`, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!response.ok) throw new Error('Failed to fetch sites');
  return await response.json();
}

// Fetch all alerts
export async function fetchAlerts() {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-alerts`, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!response.ok) throw new Error('Failed to fetch alerts');
  return await response.json();
}

// Fetch site details by ID with alerts + feedback joined
export async function fetchSiteById(id: string) {
  const { data: site, error: siteError } = await supabase
    .from('tourist_sites')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (siteError) throw new Error(siteError.message);
  if (!site) throw new Error('Site not found');

  const { data: alerts, error: alertsError } = await supabase
    .from('infrastructure_alerts')
    .select('*')
    .eq('site_id', id)
    .order('created_at', { ascending: false });

  if (alertsError) throw new Error(alertsError.message);

  const { data: feedback, error: feedbackError } = await supabase
    .from('feedback')
    .select('*, users(name, email)')
    .eq('site_id', id)
    .order('created_at', { ascending: false });

  if (feedbackError) throw new Error(feedbackError.message);

  return { site, alerts, feedback };
}

// Define feedback type
export interface SubmitFeedbackParams {
  site_id: string;
  message: string;
  rating?: number;
  user_id?: string;
}

// FIXED: Submit feedback using Edge Function
export async function submitFeedback(params: SubmitFeedbackParams) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to submit feedback');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error submitting feedback:', error.message);
    throw new Error('Failed to submit feedback');
  }
}