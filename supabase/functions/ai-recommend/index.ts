import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const siteId = url.searchParams.get('site_id');

    if (!siteId) {
      return new Response(
        JSON.stringify({ error: 'site_id parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: site, error: siteError } = await supabase
      .from('tourist_sites')
      .select('*')
      .eq('id', siteId)
      .maybeSingle();

    if (siteError) throw siteError;
    if (!site) {
      return new Response(
        JSON.stringify({ error: 'Site not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: alerts, error: alertsError } = await supabase
      .from('infrastructure_alerts')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true);

    if (alertsError) throw alertsError;

    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('rating')
      .eq('site_id', siteId);

    if (feedbackError) throw feedbackError;

    const highAlerts = (alerts || []).filter(a => a.severity === 'high');
    const mediumAlerts = (alerts || []).filter(a => a.severity === 'medium');
    const avgRating = feedback && feedback.length > 0
      ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.filter(f => f.rating).length
      : 0;

    let suggestion = '';
    let confidence = 0.5;

    if (highAlerts.length > 0) {
      const { data: altSites } = await supabase
        .from('tourist_sites')
        .select(`
          *,
          infrastructure_alerts!inner(severity, is_active)
        `)
        .neq('id', siteId)
        .eq('infrastructure_alerts.is_active', true)
        .neq('infrastructure_alerts.severity', 'high')
        .limit(2);

      const alternativeNames = (altSites || []).map(s => s.name).join(' or ');
      
      suggestion = `Due to current high-severity infrastructure alerts at ${site.name}, we recommend considering alternative destinations such as ${alternativeNames || 'other sites with lower alert levels'}. ${site.name} remains accessible, but visitors should be aware of: ${highAlerts[0].message}`;
      confidence = 0.85;
    } else if (mediumAlerts.length >= 2) {
      suggestion = `${site.name} is currently experiencing ${mediumAlerts.length} medium-severity infrastructure alerts. The site is open and safe to visit with appropriate precautions. Key considerations: ${mediumAlerts.map(a => a.alert_type).join(', ')}. We recommend checking current conditions before your visit and following all posted guidelines.`;
      confidence = 0.65;
    } else if (mediumAlerts.length === 1) {
      suggestion = `${site.name} has one active infrastructure notice: ${mediumAlerts[0].message} Despite this, the site remains a good choice for visitors. ${avgRating >= 4 ? 'Recent visitor ratings are excellent!' : 'Please review current visitor feedback for the latest insights.'}`;
      confidence = 0.70;
    } else {
      suggestion = `Excellent choice! ${site.name} currently has no active high or medium severity alerts. ${avgRating >= 4 ? `The site receives outstanding visitor ratings (average: ${avgRating.toFixed(1)}/5.0).` : ''} This is an ideal time to visit. We recommend arriving early morning for optimal experience and smaller crowds.`;
      confidence = 0.92;
    }

    const { data: existingRec } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let recommendationId;
    if (existingRec) {
      const { data: updated } = await supabase
        .from('ai_recommendations')
        .update({ suggestion, confidence, created_at: new Date().toISOString() })
        .eq('id', existingRec.id)
        .select()
        .single();
      recommendationId = updated?.id;
    } else {
      const { data: inserted } = await supabase
        .from('ai_recommendations')
        .insert({ site_id: siteId, suggestion, confidence })
        .select()
        .single();
      recommendationId = inserted?.id;
    }

    return new Response(
      JSON.stringify({
        site_id: siteId,
        site_name: site.name,
        suggestion,
        confidence,
        recommendation_id: recommendationId,
        generated_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});