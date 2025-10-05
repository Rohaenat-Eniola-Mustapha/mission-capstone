import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const siteId = url.searchParams.get('id');

    if (siteId) {
      const { data: site, error: siteError } = await supabase
        .from('tourist_sites')
        .select('*')
        .eq('id', siteId)
        .maybeSingle();

      if (siteError) throw siteError;
      if (!site) {
        return new Response(JSON.stringify({ error: 'Site not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: alerts, error: alertsError } = await supabase
        .from('infrastructure_alerts')
        .select('*')
        .eq('site_id', siteId)
        .eq('is_active', true)
        .order('severity', { ascending: false });

      if (alertsError) throw alertsError;

      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select(`
          *,
          users (name, email)
        `)
        .eq('site_id', siteId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (feedbackError) throw feedbackError;

      return new Response(
        JSON.stringify({
          site,
          alerts: alerts || [],
          feedback: feedback || [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: sites, error } = await supabase
      .from('tourist_sites')
      .select(`
        *,
        infrastructure_alerts!inner(
          id,
          severity,
          is_active
        )
      `)
      .eq('infrastructure_alerts.is_active', true);

    if (error) throw error;

    const sitesWithCounts = await Promise.all(
      (sites || []).map(async (site) => {
        const { count } = await supabase
          .from('infrastructure_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('site_id', site.id)
          .eq('is_active', true);

        return {
          ...site,
          alert_count: count || 0,
        };
      })
    );

    const { data: allSites } = await supabase
      .from('tourist_sites')
      .select('*')
      .order('name');

    const sitesMap = new Map(sitesWithCounts.map(s => [s.id, s]));
    const finalSites = (allSites || []).map(site => 
      sitesMap.has(site.id) ? sitesMap.get(site.id) : { ...site, alert_count: 0 }
    );

    return new Response(JSON.stringify(finalSites), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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