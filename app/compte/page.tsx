'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User, Package, LogOut, ShoppingBag, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Commande {
  id: number;
  numero: string;
  statut: string;
  montant_total: string;
  created_at: string;
  lignes?: Array<{
    id: number;
    quantite: number;
    sous_total: string;
    variante?: {
      taille: string;
      couleur: string;
      produit_nom?: string;
    };
  }>;
}

export default function ComptePage() {
  const router = useRouter();
  const [client, setClient] = useState<{ id: number; nom: string; prenom: string; email: string } | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const clientData = localStorage.getItem('client');

    if (!token || !clientData) {
      router.push('/connexion?redirect=/compte');
      return;
    }

    try {
      setClient(JSON.parse(clientData));
    } catch (e) {
      router.push('/connexion');
      return;
    }

    // Charger les commandes du client
    const fetchCommandes = async () => {
      try {
        const res = await api.get('/commandes');
        setCommandes(res.data.data || []);
      } catch (err: any) {
        console.error('Erreur chargement commandes', err);
        setError('Impossible de charger vos commandes.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Erreur déconnexion', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/connexion');
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirmee':
      case 'paye':
        return <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">Confirmée</span>;
      case 'en_preparation':
        return <span className="bg-amber-500/10 text-amber-600 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">En préparation</span>;
      case 'expediee':
        return <span className="bg-blue-500/10 text-blue-600 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">Expédiée</span>;
      case 'livree':
        return <span className="bg-emerald-700/10 text-emerald-800 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">Livrée</span>;
      case 'annulee':
        return <span className="bg-red-500/10 text-red-600 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">Annulée</span>;
      default:
        return <span className="bg-zinc-500/10 text-zinc-600 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">En attente</span>;
    }
  };

  if (!client) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-28 min-h-[85vh]">
      {/* Entête compte */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-8 mb-12 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-2">Espace Membre</p>
          <h1 className="text-3xl font-serif font-light tracking-wide text-foreground">
            Bonjour, {client.prenom} {client.nom}
          </h1>
          <p className="text-xs text-accent mt-1">{client.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/boutique"
            className="border border-border px-6 py-2.5 text-[10px] tracking-widest uppercase hover:border-primary transition-all font-medium"
          >
            Boutique
          </Link>
          <button
            onClick={handleLogout}
            className="border border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white px-6 py-2.5 text-[10px] tracking-widest uppercase transition-all duration-300 font-semibold flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={13} />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Contenu principal : Mes Commandes */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Package className="text-accent" size={20} />
          <h2 className="text-lg font-serif font-light uppercase tracking-wider text-foreground">
            Historique de mes commandes
          </h2>
        </div>

        {loading ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-xs uppercase tracking-widest text-accent">Chargement de vos commandes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs p-6 text-center">
            {error}
          </div>
        ) : commandes.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <Package className="mx-auto text-accent mb-4 opacity-40" size={40} />
            <p className="text-sm font-medium mb-2 text-foreground">Aucune commande pour le moment</p>
            <p className="text-xs text-accent max-w-sm mx-auto mb-6">
              Vous n'avez pas encore passé de commande avec ce compte. Découvrez notre catalogue d'exception.
            </p>
            <Link
              href="/boutique"
              className="inline-block bg-foreground text-background px-8 py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-accent hover:text-foreground transition-all"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {commandes.map((cmd) => (
              <div key={cmd.id} className="bg-card border border-border p-6 transition-all hover:border-accent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-4 gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-foreground block">
                      Commande #{cmd.numero}
                    </span>
                    <span className="text-[11px] text-accent font-light flex items-center gap-1.5 mt-1">
                      <Clock size={12} />
                      {new Date(cmd.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatutBadge(cmd.statut)}
                    <span className="text-sm font-bold text-foreground font-sans">
                      {parseFloat(cmd.montant_total).toFixed(2)} €
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-accent">
                    {cmd.lignes ? `${cmd.lignes.length} article(s)` : 'Détails disponibles'}
                  </span>

                  <Link
                    href={`/commandes/${cmd.id}/confirmation`}
                    className="text-[10px] tracking-widest uppercase font-bold text-foreground hover:text-accent flex items-center gap-1 transition-colors"
                  >
                    Voir le reçu
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
