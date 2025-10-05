import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">InfraTour</h1>
              <p className="text-xs text-gray-500">Nigeria Tourism Platform</p>
            </div>
          </Link>

          <div className="flex space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/sites"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/sites')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Tourist Sites
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
