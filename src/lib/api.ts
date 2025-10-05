import type { TouristSite, InfrastructureAlert, Feedback, AIRecommendation } from './supabase';

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

export async function fetchSiteById(id: string): Promise<{
  site: TouristSite;
  alerts: InfrastructureAlert[];
  feedback: Feedback[];
}> {
  const response = await fetch(`${API_BASE_URL}/get-sites?id=${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch site details');
  }

  return response.json();
}

export async function fetchAlerts(): Promise<InfrastructureAlert[]> {
  const response = await fetch(`${API_BASE_URL}/get-alerts`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }

  return response.json();
}

export async function submitFeedback(data: {
  site_id: string;
  message: string;
  rating?: number;
  user_id?: string;
}): Promise<{ success: boolean; feedback: Feedback }> {
  const response = await fetch(`${API_BASE_URL}/submit-feedback`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit feedback');
  }

  return response.json();
}

export async function getAIRecommendation(siteId: string): Promise<AIRecommendation> {
  const response = await fetch(`${API_BASE_URL}/ai-recommend?site_id=${siteId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get AI recommendation');
  }

  return response.json();
}
