import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { SiteCard } from '../components/SiteCard';
import { fetchSites } from '../lib/api';
import type { TouristSite } from '../lib/supabase';

export function Sites() {
  const [sites, setSites] = useState<TouristSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<TouristSite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSites(sites);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.state.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query)
    );
    setFilteredSites(filtered);
  }, [searchQuery, sites]);

  const loadSites = async () => {
    try {
      const data = await fetchSites();
      setSites(data);
      setFilteredSites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sites');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tourist sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadSites}
            className="mt-4 text-red-800 font-medium hover:text-red-900"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Nigerian Tourist Sites</h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Explore Nigeria's diverse attractions with real-time infrastructure insights and AI-powered
            recommendations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, state, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {filteredSites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery ? 'No sites match your search.' : 'No tourist sites available.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredSites.length} of {sites.length} sites
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
