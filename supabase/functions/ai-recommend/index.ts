import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RouteSuggestion {
  destination: string;
  distance?: string;
  duration?: string;
  via?: string;
}

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
    const userLat = url.searchParams.get('user_lat');
    const userLng = url.searchParams.get('user_lng');

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
    let routeSuggestions: RouteSuggestion[] = [];
    let alternativeSites: any[] = [];

    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    function estimateDuration(distanceKm: number): string {
      const avgSpeedKmh = 60;
      const hours = distanceKm / avgSpeedKmh;
      const totalMinutes = Math.round(hours * 60);
      
      if (totalMinutes < 60) {
        return `${totalMinutes} mins`;
      } else {
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return mins > 0 ? `${hrs} hr ${mins} mins` : `${hrs} hr`;
      }
    }

    if (highAlerts.length > 0) {
      const { data: altSites } = await supabase
        .from('tourist_sites')
        .select('*')
        .neq('id', siteId)
        .limit(3);

      if (altSites && altSites.length > 0) {
        alternativeSites = altSites;
        
        if (userLat && userLng) {
          const userLatNum = parseFloat(userLat);
          const userLngNum = parseFloat(userLng);
          
          routeSuggestions = altSites.map(altSite => {
            const distance = calculateDistance(
              userLatNum, 
              userLngNum, 
              altSite.latitude, 
              altSite.longitude
            );
            
            return {
              destination: altSite.name,
              distance: `${distance.toFixed(1)} km`,
              duration: estimateDuration(distance),
              via: altSite.state,
            };
          }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }

        const alternativeNames = altSites.map(s => s.name).join(', ');
        const roadAlert = highAlerts.find(a => a.alert_type === 'road');
        
        suggestion = `Due to current high-severity ${roadAlert ? 'road' : 'infrastructure'} alerts at ${site.name}, we strongly recommend considering alternative destinations: ${alternativeNames}. `;
        
        if (routeSuggestions.length > 0) {
          const nearest = routeSuggestions[0];
          suggestion += `The nearest alternative is ${nearest.destination} (approximately ${nearest.distance}, ${nearest.duration} drive). `;
        }
        
        suggestion += `${site.name} remains accessible via alternative routes, but travel times may be significantly longer. Alert: ${highAlerts[0].message}`;
        confidence = 0.85;
      }
    } else if (mediumAlerts.length >= 2) {
      if (userLat && userLng && site.latitude && site.longitude) {
        const distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          site.latitude,
          site.longitude
        );
        
        routeSuggestions.push({
          destination: site.name,
          distance: `${distance.toFixed(1)} km`,
          duration: estimateDuration(distance),
          via: site.state,
        });
      }
      
      suggestion = `${site.name} is currently experiencing ${mediumAlerts.length} medium-severity infrastructure alerts. The site is open and safe to visit with appropriate precautions. `;
      
      if (routeSuggestions.length > 0) {
        suggestion += `Travel distance: approximately ${routeSuggestions[0].distance} (${routeSuggestions[0].duration}). `;
      }
      
      suggestion += `Key considerations: ${mediumAlerts.map(a => a.alert_type).join(', ')}. We recommend checking current conditions before your visit and following all posted guidelines.`;
      confidence = 0.65;
    } else if (mediumAlerts.length === 1) {
      if (userLat && userLng && site.latitude && site.longitude) {
        const distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          site.latitude,
          site.longitude
        );
        
        routeSuggestions.push({
          destination: site.name,
          distance: `${distance.toFixed(1)} km`,
          duration: estimateDuration(distance),
          via: site.state,
        });
      }
      
      suggestion = `${site.name} has one active infrastructure notice: ${mediumAlerts[0].message} Despite this, the site remains a good choice for visitors. `;
      
      if (routeSuggestions.length > 0) {
        suggestion += `Estimated travel: ${routeSuggestions[0].distance}, approximately ${routeSuggestions[0].duration} from your location. `;
      }
      
      suggestion += avgRating >= 4 ? 'Recent visitor ratings are excellent!' : 'Please review current visitor feedback for the latest insights.';
      confidence = 0.70;
    } else {
      if (userLat && userLng && site.latitude && site.longitude) {
        const distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          site.latitude,
          site.longitude
        );
        
        routeSuggestions.push({
          destination: site.name,
          distance: `${distance.toFixed(1)} km`,
          duration: estimateDuration(distance),
          via: site.state,
        });
      }
      
      suggestion = `Excellent choice! ${site.name} currently has no active high or medium severity alerts. `;
      
      if (avgRating >= 4) {
        suggestion += `The site receives outstanding visitor ratings (average: ${avgRating.toFixed(1)}/5.0). `;
      }
      
      if (routeSuggestions.length > 0) {
        suggestion += `Travel distance: approximately ${routeSuggestions[0].distance} (${routeSuggestions[0].duration} drive). `;
      }
      
      suggestion += 'This is an ideal time to visit. We recommend arriving early morning for optimal experience and smaller crowds.';
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
        site_location: { lat: site.latitude, lng: site.longitude },
        suggestion,
        confidence,
        route_suggestions: routeSuggestions,
        alternative_sites: alternativeSites.map(s => ({
          id: s.id,
          name: s.name,
          state: s.state,
          location: { lat: s.latitude, lng: s.longitude },
        })),
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