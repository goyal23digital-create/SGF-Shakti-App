import { Outlet, NavLink, useNavigate } from 'react-router-dom';

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
];

export function Layout() {
  const navigate = useNavigate();
  function logout() { localStorage.removeItem('token'); navigate('/login'); }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-56 flex flex-col flex-shrink-0" style={{ background: '#1a1f2e' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              SGF
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">Shakti Gold</div>
              <div className="text-white/40 text-xs">Furniture ERP</div>
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
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
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
