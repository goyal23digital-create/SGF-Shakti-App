import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useSettings } from '../api/hooks';
import { Logo } from '../components/Logo';

export function LoginPage() {
  const { data: settings } = useSettings();
  const [email, setEmail] = useState('admin@sgf.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)' }}>
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo logoDataUri={settings?.logoDataUri} size={72} />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {settings?.companyName || 'Shakti Gold Furniture'}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {settings?.tagline || 'Steel & Furniture ERP · 2026-27'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Sign in to continue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>
            )}
            <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">Default: admin@sgf.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
