import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Loader2 } from 'lucide-react';
import { getAIRecommendation } from '../lib/api';
import type { AIRecommendation } from '../lib/supabase';

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

  return (
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

      <div className="bg-white rounded-md p-4 shadow-sm">
        <p className="text-gray-700 leading-relaxed">{recommendation.suggestion}</p>
      </div>

      <div className="mt-4 flex items-center text-xs text-gray-500">
        <span>Generated: {new Date(recommendation.generated_at).toLocaleString()}</span>
      </div>
    </div>
  );
}
