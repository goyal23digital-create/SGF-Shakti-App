import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSettings } from '../api/hooks';
import { Logo } from './Logo';

const NAV = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/inventory', icon: '📦', label: 'Production In' },
  { to: '/sales', icon: '🛒', label: 'Sales / Dispatch' },
  { to: '/returns', icon: '↩️', label: 'Returns' },
  { to: '/payments', icon: '💰', label: 'Payments' },
  { to: '/expenses', icon: '💸', label: 'Expenses' },
  { to: '/parties', icon: '👥', label: 'Parties' },
  { to: '/items', icon: '📋', label: 'Items' },
  { to: '/reports', icon: '📈', label: 'Reports' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export function Layout() {
  const navigate = useNavigate();
  const { data: settings } = useSettings();

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', settings?.accentColor || '#4f46e5');
  }, [settings?.accentColor]);

  function logout() { localStorage.removeItem('token'); navigate('/login'); }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-56 flex flex-col flex-shrink-0" style={{ background: '#1a1f2e' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo logoDataUri={settings?.logoDataUri} size={36} />
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm leading-tight truncate">
                {settings?.companyName || 'Shakti Gold Furniture'}
              </div>
              {settings?.tagline && (
                <div className="text-white/40 text-xs truncate">{settings.tagline}</div>
              )}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
              style={({ isActive }) => (isActive ? { background: 'var(--accent)' } : undefined)}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
