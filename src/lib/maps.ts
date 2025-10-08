import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let loader: Loader | null = null;
let googleMapsLoaded = false;

export function isGoogleMapsConfigured(): boolean {
  return GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
}

export async function loadGoogleMaps(): Promise<typeof google.maps | null> {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key not configured');
    return null;
  }

  if (googleMapsLoaded && window.google?.maps) {
    return window.google.maps;
  }

  if (!loader) {
    loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'routes', 'geometry'],
    });
  }

  try {
    await loader.load();
    googleMapsLoaded = true;
    return window.google.maps;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    return null;
  }
}

export interface RouteInfo {
  distance: string;
  duration: string;
  steps: string[];
  polyline?: string;
}

export async function calculateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteInfo | null> {
  const maps = await loadGoogleMaps();
  if (!maps) {
    return null;
  }

  try {
    const directionsService = new maps.DirectionsService();

    const result = await directionsService.route({
      origin: new maps.LatLng(origin.lat, origin.lng),
      destination: new maps.LatLng(destination.lat, destination.lng),
      travelMode: maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    });

    if (result.routes && result.routes.length > 0) {
      const route = result.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance?.text || 'Unknown',
        duration: leg.duration?.text || 'Unknown',
        steps: leg.steps.map((step) => step.instructions),
        polyline: route.overview_polyline,
      };
    }

    return null;
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
}

export async function findNearestSite(
  userLocation: { lat: number; lng: number },
  sites: Array<{ id: string; name: string; latitude: number; longitude: number }>
): Promise<{ site: typeof sites[0]; distance: number } | null> {
  const maps = await loadGoogleMaps();
  if (!maps) {
    return null;
  }

  const userLatLng = new maps.LatLng(userLocation.lat, userLocation.lng);

  let nearestSite = null;
  let minDistance = Infinity;

  for (const site of sites) {
    if (site.latitude && site.longitude) {
      const siteLatLng = new maps.LatLng(site.latitude, site.longitude);
      const distance = maps.geometry.spherical.computeDistanceBetween(userLatLng, siteLatLng);

      if (distance < minDistance) {
        minDistance = distance;
        nearestSite = site;
      }
    }
  }

  if (nearestSite) {
    return {
      site: nearestSite,
      distance: minDistance / 1000,
    };
  }

  return null;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export async function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting user location:', error);
        resolve(null);
      }
    );
  });
}
