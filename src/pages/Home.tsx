import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Shield, AlertTriangle, Brain } from 'lucide-react';
import { fetchSites, fetchAlerts } from '../lib/api';
import type { TouristSite, InfrastructureAlert } from '../lib/supabase';

export function Home() {
  const [sites, setSites] = useState<TouristSite[]>([]);
  const [alerts, setAlerts] = useState<InfrastructureAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sitesData, alertsData] = await Promise.all([
        fetchSites(),
        fetchAlerts(),
      ]);
      setSites(sitesData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const safeSites = sites.filter(site => !site.alert_count || site.alert_count === 0);
  const highAlerts = alerts.filter(alert => alert.severity === 'high');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <MapPin className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            InfraTour Nigeria
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A digital framework enhancing tourism infrastructure accessibility across Nigeria.
            Get real-time alerts, AI-powered recommendations, and community insights for safe travel.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg p-8 mb-12 text-white">
          <div className="flex items-start space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Brain className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">AI-Powered Travel Insights</h2>
              <p className="text-blue-100 mb-4">
                Our intelligent system analyzes infrastructure alerts and visitor feedback to provide
                personalized recommendations for your Nigerian tourism experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{safeSites.length}</div>
                  <div className="text-sm text-blue-100">Safe Sites Today</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{sites.length}</div>
                  <div className="text-sm text-blue-100">Total Destinations</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{alerts.length}</div>
                  <div className="text-sm text-blue-100">Active Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-emerald-500">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Alerts</h3>
            <p className="text-gray-600 text-sm">
              Stay informed about infrastructure conditions, road access, facility status, and safety
              updates across all Nigerian tourist destinations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
            <p className="text-gray-600 text-sm">
              Get intelligent suggestions based on current conditions, historical data, and community
              feedback to optimize your travel experience.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Insights</h3>
            <p className="text-gray-600 text-sm">
              Access verified visitor reviews and ratings to make informed decisions about your next
              Nigerian tourism adventure.
            </p>
          </div>
        </div>

        {highAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-900">High Priority Alerts</h3>
            </div>
            <div className="space-y-2">
              {highAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="text-sm text-red-800">
                  <strong>{(alert as any).tourist_sites?.name || 'Site'}:</strong> {alert.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/sites"
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <MapPin className="h-5 w-5 mr-2" />
            Explore Tourist Sites
          </Link>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
