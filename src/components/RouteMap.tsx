import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { loadGoogleMaps, isGoogleMapsConfigured, calculateRoute, type RouteInfo } from '../lib/maps';

interface RouteMapProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  destinationName: string;
}

export function RouteMap({ origin, destination, destinationName }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initializeMap();
  }, [origin, destination]);

  const initializeMap = async () => {
    if (!isGoogleMapsConfigured()) {
      setError('Google Maps API key not configured. Add your API key to .env file.');
      setLoading(false);
      return;
    }

    if (!mapRef.current) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const maps = await loadGoogleMaps();
      if (!maps) {
        setError('Failed to load Google Maps');
        setLoading(false);
        return;
      }

      const mapInstance = new maps.Map(mapRef.current, {
        center: destination,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(mapInstance);

      const directionsService = new maps.DirectionsService();
      const directionsRenderer = new maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
      });

      const result = await directionsService.route({
        origin: new maps.LatLng(origin.lat, origin.lng),
        destination: new maps.LatLng(destination.lat, destination.lng),
        travelMode: maps.TravelMode.DRIVING,
      });

      directionsRenderer.setDirections(result);

      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        const leg = route.legs[0];

        setRouteInfo({
          distance: leg.distance?.text || 'Unknown',
          duration: leg.duration?.text || 'Unknown',
          steps: leg.steps.map((step) => step.instructions),
        });
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isGoogleMapsConfigured()) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">Google Maps Not Configured</h3>
            <p className="text-sm text-amber-800 mb-3">
              To enable route recommendations and maps, you need to configure a Google Maps API key.
            </p>
            <div className="bg-white rounded-md p-3 text-xs font-mono text-gray-700">
              <p className="mb-2">1. Get an API key from: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></p>
              <p className="mb-2">2. Enable these APIs: Maps JavaScript API, Directions API, Places API</p>
              <p>3. Add to .env file: VITE_GOOGLE_MAPS_API_KEY=your_key_here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-gray-600">Loading route map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-emerald-600" />
          Route to {destinationName}
        </h3>
      </div>

      {routeInfo && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-xs text-gray-500">Distance</div>
              <div className="font-semibold text-gray-900">{routeInfo.distance}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-semibold text-gray-900">{routeInfo.duration}</div>
            </div>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-96" />

      {routeInfo && routeInfo.steps && routeInfo.steps.length > 0 && (
        <div className="p-4 max-h-64 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 mb-3">Directions</h4>
          <ol className="space-y-2">
            {routeInfo.steps.map((step, index) => (
              <li key={index} className="flex space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <span
                  className="text-sm text-gray-700 flex-1"
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
