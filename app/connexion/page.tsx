'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/compte';

  const [isLogin, setIsLogin] = useState(true);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const client = localStorage.getItem('client');

    if (token && client) {
      router.push(redirectTarget);
    }
  }, [router, redirectTarget]);

  const switchMode = (nextIsLogin: boolean) => {
    setIsLogin(nextIsLogin);
    setError('');
    setPassword('');
    setPasswordConfirmation('');
    setNom('');
    setPrenom('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const res = await api.post('/auth/login', { email, password });
        if (!res.data?.token) {
          throw new Error('Aucun token reçu');
        }
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('client', JSON.stringify(res.data.client));
      } else {
        // Inscription
        if (password !== passwordConfirmation) {
          setError('Les mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }

        const res = await api.post('/auth/register', {
          nom,
          prenom,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        if (!res.data?.token) {
          throw new Error('Aucun token reçu');
        }
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('client', JSON.stringify(res.data.client));
      }

      // Notifier l'application du changement de session
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirection
      router.push(redirectTarget);
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || err?.message || 'Une erreur s\'est produite. Veuillez vérifier vos identifiants.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-24 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-2">Espace Client</p>
        <h1 className="text-3xl font-serif font-light tracking-wide uppercase text-foreground">
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </h1>
      </div>

      {/* Selecteur Connexion / Inscription */}
      <div className="flex border-b border-border mb-8">
        <button
          type="button"
          onClick={() => switchMode(true)}
          className={`flex-1 py-3 text-xs tracking-widest uppercase transition-colors font-medium cursor-pointer ${
            isLogin ? 'border-b-2 border-primary text-primary font-bold' : 'text-accent hover:text-foreground'
          }`}
        >
          Se connecter
        </button>
        <button
          type="button"
          onClick={() => switchMode(false)}
          className={`flex-1 py-3 text-xs tracking-widest uppercase transition-colors font-medium cursor-pointer ${
            !isLogin ? 'border-b-2 border-primary text-primary font-bold' : 'text-accent hover:text-foreground'
          }`}
        >
          S'inscrire
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs p-4 mb-6 rounded-none">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">Prénom</label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full bg-card border border-border px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
                placeholder="Ex: Jean"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">Nom</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full bg-card border border-border px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
                placeholder="Ex: Dupont"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">Adresse E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-card border border-border px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-card border border-border px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full bg-card border border-border px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-accent hover:text-foreground transition-all duration-300 disabled:opacity-50 mt-6 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
          <ArrowRight size={14} />
        </button>
      </form>
    </main>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-accent">Chargement...</p>
      </div>
    }>
      <ConnexionForm />
    </Suspense>
  );
}
