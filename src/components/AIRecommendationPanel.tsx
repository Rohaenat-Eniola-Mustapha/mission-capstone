import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Loader2, Navigation, MapPin, Clock } from 'lucide-react';
import { getAIRecommendation } from '../lib/api';
import { getUserLocation, isGoogleMapsConfigured } from '../lib/maps';
import { RouteMap } from './RouteMap';
import type { AIRecommendation } from '../lib/supabase';

interface AIRecommendationPanelProps {
  siteId: string;
  siteLocation?: { lat: number; lng: number };
}

export function AIRecommendationPanel({ siteId, siteLocation }: AIRecommendationPanelProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    loadRecommendation();
  }, [siteId]);

  const loadRecommendation = async () => {
    setIsLoading(true);
    setError('');

    const location = await getUserLocation();
    setUserLocation(location);

    try {
      const data = await getAIRecommendation(siteId, location || undefined);
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-indigo-700">Generating AI insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-6">
        <p className="text-red-700 text-sm">{error}</p>
        <button
          onClick={loadRecommendation}
          className="mt-3 text-sm text-red-800 font-medium hover:text-red-900"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const confidencePercentage = Math.round(recommendation.confidence * 100);
  const confidenceColor =
    recommendation.confidence >= 0.8
      ? 'text-emerald-700 bg-emerald-100'
      : recommendation.confidence >= 0.6
      ? 'text-amber-700 bg-amber-100'
      : 'text-gray-700 bg-gray-100';

  const hasRouteInfo = recommendation.route_suggestions && recommendation.route_suggestions.length > 0;
  const hasAlternatives = recommendation.alternative_sites && recommendation.alternative_sites.length > 0;
  const canShowMap = isGoogleMapsConfigured() && userLocation && siteLocation;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg shadow-md border border-indigo-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendation</h3>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${confidenceColor}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {confidencePercentage}% Confidence
          </div>
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm mb-4">
          <p className="text-gray-700 leading-relaxed">{recommendation.suggestion}</p>
        </div>

        {hasRouteInfo && (
          <div className="bg-white rounded-md p-4 shadow-sm border border-gray-200 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Navigation className="h-5 w-5 mr-2 text-emerald-600" />
              Route Information
            </h4>
            <div className="space-y-3">
              {recommendation.route_suggestions!.map((route, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{route.destination}</div>
                      {route.via && <div className="text-xs text-gray-500">via {route.via}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    {route.distance && <div className="font-semibold text-gray-900">{route.distance}</div>}
                    {route.duration && (
                      <div className="text-xs text-gray-600 flex items-center justify-end">
                        <Clock className="h-3 w-3 mr-1" />
                        {route.duration}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasAlternatives && (
          <div className="bg-amber-50 rounded-md p-4 border border-amber-200 mb-4">
            <h4 className="font-semibold text-amber-900 mb-2">Alternative Destinations</h4>
            <div className="space-y-2">
              {recommendation.alternative_sites!.map((site) => (
                <div key={site.id} className="flex items-center text-sm text-amber-800">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">{site.name}</span>
                  <span className="mx-2 text-amber-600">•</span>
                  <span>{site.state} State</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {canShowMap && (
          <button
            onClick={() => setShowMap(!showMap)}
            className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {showMap ? 'Hide Route Map' : 'Show Route Map'}
          </button>
        )}

        <div className="mt-4 flex items-center text-xs text-gray-500">
          <span>Generated: {new Date(recommendation.generated_at).toLocaleString()}</span>
        </div>
      </div>

      {showMap && canShowMap && userLocation && siteLocation && (
        <RouteMap
          origin={userLocation}
          destination={siteLocation}
          destinationName={recommendation.site_name}
        />
      )}
    </div>
  );
}
