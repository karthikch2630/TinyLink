import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link2, Plus, LayoutDashboard } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link2 className="w-8 h-8 text-cyan-500" />
            <span className="text-2xl font-bold text-gray-900">TinyLink</span>
          </div>

          <div className="flex items-center space-x-4">
            <RouterLink
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/')
                  ? 'bg-cyan-50 text-cyan-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </RouterLink>

            <RouterLink
              to="/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/create')
                  ? 'bg-cyan-500 text-white font-medium'
                  : 'bg-cyan-500 text-white hover:bg-cyan-600'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Create Link</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
