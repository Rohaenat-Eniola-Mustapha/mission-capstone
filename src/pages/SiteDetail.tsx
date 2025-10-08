import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, AlertTriangle, MessageSquare, Star, ArrowLeft } from 'lucide-react';
import { AlertBadge } from '../components/AlertBadge';
import { FeedbackForm } from '../components/FeedbackForm';
import { AIRecommendationPanel } from '../components/AIRecommendationPanel';
import { fetchSiteById } from '../lib/api';
import type { TouristSite, InfrastructureAlert, Feedback } from '../lib/supabase';

export function SiteDetail() {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<TouristSite | null>(null);
  const [alerts, setAlerts] = useState<InfrastructureAlert[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadSiteData();
    }
  }, [id]);

  const loadSiteData = async () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchSiteById(id);
      setSite(data.site);
      setAlerts(data.alerts);
      setFeedback(data.feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load site details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site details...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-700">{error || 'Site not found'}</p>
          <Link
            to="/sites"
            className="mt-4 inline-block text-red-800 font-medium hover:text-red-900"
          >
            Back to sites
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    feedback.filter((f) => f.rating).length > 0
      ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) /
        feedback.filter((f) => f.rating).length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-96 bg-gradient-to-br from-emerald-400 to-teal-500 relative overflow-hidden">
        {site.image_url ? (
          <img
            src={site.image_url}
            alt={site.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-32 w-32 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/sites"
              className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to sites
            </Link>
            <h1 className="text-4xl font-bold mb-2">{site.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span className="text-lg">{site.state} State</span>
              </div>
              {avgRating > 0 && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg">{avgRating.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Site</h2>
              <p className="text-gray-700 leading-relaxed">{site.description}</p>
            </div>

            {alerts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Active Alerts</h2>
                </div>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <AlertBadge severity={alert.severity} />
                        <span className="text-xs text-gray-500">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1 capitalize">
                        {alert.alert_type.replace('_', ' ')}
                      </div>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feedback.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 text-emerald-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Visitor Feedback</h2>
                </div>
                <div className="space-y-4">
                  {feedback.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {item.users?.name || 'Anonymous'}
                          </span>
                          {item.rating && (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < item.rating!
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FeedbackForm siteId={site.id} onSuccess={loadSiteData} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AIRecommendationPanel
                siteId={site.id}
                siteLocation={site.latitude && site.longitude ? { lat: site.latitude, lng: site.longitude } : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
