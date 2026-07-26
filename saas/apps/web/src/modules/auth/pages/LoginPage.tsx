import { useState, type FormEvent } from 'react';
import { useAuth, isDevMode } from '@/shared/auth/AuthProvider';

export function LoginPage() {
  const { signIn, signInDev } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  }

  async function onDemo() {
    setError(null);
    setDemoLoading(true);
    try {
      await signInDev();
    } catch (err) {
      setError((err as Error).message || 'Impossible de démarrer le mode démo');
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-brand-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-800 text-lg font-bold text-white">
            P
          </span>
          <h1 className="text-2xl font-semibold text-slate-900">PMS Ops</h1>
          <p className="mt-1 text-sm text-slate-500">
            Connexion à la console de gestion locative
          </p>
        </div>

        <div className="panel space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label-field" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isDevMode}
              />
            </div>
            <div>
              <label className="label-field" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isDevMode}
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              className="btn-secondary w-full"
              disabled={loading || isDevMode}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
            {isDevMode ? (
              <p className="text-xs text-slate-500">
                Supabase non configuré — la connexion e-mail est désactivée.
              </p>
            ) : null}
          </form>

          <div className="border-t border-slate-100 pt-5">
            <button
              type="button"
              className="btn-primary w-full py-3 text-base"
              onClick={() => void onDemo()}
              disabled={demoLoading}
            >
              {demoLoading ? 'Chargement…' : 'Continuer en mode démo'}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Jeton local · organisation <code className="text-slate-500">org_demo</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
