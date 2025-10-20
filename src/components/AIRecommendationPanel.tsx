import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Loader2, MapPin, Clock } from 'lucide-react';
import type { AIRecommendation } from '../lib/supabase';
import { getAIRecommendation } from '../lib/ai';

interface AIRecommendationPanelProps {
  siteId: string;
}

export function AIRecommendationPanel({ siteId }: AIRecommendationPanelProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadRecommendation();
  }, [siteId]);

  const loadRecommendation = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getAIRecommendation(siteId);
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-sm border border-emerald-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="ml-3 text-emerald-800">Generating AI insights...</span>
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

  return (
    <div className="bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 rounded-lg shadow-md border border-emerald-200 p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendation</h3>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${confidenceColor}`}>
          <TrendingUp className="h-3 w-3 mr-1" />
          {confidencePercentage}% Confidence
        </div>
      </div>

      <p className="text-gray-700 bg-white rounded-md p-4 shadow-sm">
        {recommendation.suggestion}
      </p>

      {recommendation.alternative_sites?.length ? (
        <div className="bg-amber-50 rounded-md p-4 border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-2">Alternative Destinations</h4>
          <ul className="space-y-1">
            {recommendation.alternative_sites.map((site) => (
              <li key={site.id} className="flex items-center text-sm text-amber-800">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                {site.name} — {site.state} State
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="text-xs text-gray-500 flex items-center justify-between pt-2 border-t border-gray-200">
        <Clock className="h-3 w-3 mr-1" />
        Generated: {new Date(recommendation.generated_at).toLocaleString()}
      </div>
    </div>
  );
}