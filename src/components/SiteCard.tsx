import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle } from 'lucide-react';
import { AlertBadge } from './AlertBadge';
import type { TouristSite } from '../lib/supabase';

interface SiteCardProps {
  site: TouristSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const hasAlerts = site.alert_count && site.alert_count > 0;

  return (
    <Link
      to={`/sites/${site.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 overflow-hidden group"
    >
      <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 relative overflow-hidden">
        {site.image_url ? (
          <img
            src={site.image_url}
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-20 w-20 text-white opacity-50" />
          </div>
        )}
        {hasAlerts && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {site.alert_count} Alert{site.alert_count > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
            {site.name}
          </h3>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
          <span>{site.state} State</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {site.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-700 group-hover:text-emerald-800">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
