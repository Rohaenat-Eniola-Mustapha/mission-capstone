import { supabase } from './supabase';

// Fetch all tourist sites
export async function fetchSites() {
  const { data, error } = await supabase
    .from('tourist_sites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Fetch all alerts
export async function fetchAlerts() {
  const { data, error } = await supabase
    .from('infrastructure_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Fetch site details by ID with alerts + feedback joined
export async function fetchSiteById(id: string) {
  // 1. Get the site itself
  const { data: site, error: siteError } = await supabase
    .from('tourist_sites')
    .select('*')
    .eq('id', id)
    .single();

  if (siteError) throw new Error(siteError.message);

  // 2. Get infrastructure alerts for this site
  const { data: alerts, error: alertsError } = await supabase
    .from('infrastructure_alerts')
    .select('*')
    .eq('site_id', id)
    .order('created_at', { ascending: false });

  if (alertsError) throw new Error(alertsError.message);

  // 3. Get feedback for this site
  const { data: feedback, error: feedbackError } = await supabase
    .from('feedback')
    .select('*, users(name, email)')
    .eq('site_id', id)
    .order('created_at', { ascending: false });

  if (feedbackError) throw new Error(feedbackError.message);

  return { site, alerts, feedback };
}

// Submit feedback to the backend
export async function submitFeedback(siteId: string, message: string, rating?: number, userId?: string) {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        site_id: siteId,
        message,
        rating: rating || null,
        user_id: userId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error submitting feedback:', error.message);
    throw new Error('Failed to submit feedback');
  }
}
