import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inventory', label: 'Production In' },
  { to: '/sales', label: 'Sales / Dispatch' },
  { to: '/returns', label: 'Returns' },
  { to: '/payments', label: 'Payments' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/parties', label: 'Parties' },
  { to: '/items', label: 'Items' },
  { to: '/reports', label: 'Reports' },
];

export function Layout() {
  const navigate = useNavigate();
  function logout() { localStorage.removeItem('token'); navigate('/login'); }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-52 bg-gray-900 text-white flex flex-col">
        <div className="px-4 py-4 border-b border-gray-700">
          <div className="text-brand-500 font-bold text-lg leading-tight">Shakti Gold</div>
          <div className="text-gray-400 text-xs">Furniture ERP</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${isActive ? 'bg-brand-600 text-white' : 'text-gray-300'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-700 text-left border-t border-gray-700">
          Sign out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
