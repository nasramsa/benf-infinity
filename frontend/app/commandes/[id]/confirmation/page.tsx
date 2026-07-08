'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle2, Package, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

interface LigneCommande {
  id: number;
  quantite: number;
  prix_unitaire: string;
  sous_total: string;
  variante?: {
    id: number;
    sku: string;
    taille: string;
    couleur: string;
    produit_nom?: string;
    image_url?: string;
  };
}

interface Commande {
  id: number;
  numero: string;
  statut: string;
  montant_total: string;
  created_at: string;
  lignes?: LigneCommande[];
  livraison?: {
    statut: string;
    adresse?: {
      rue: string;
      ville: string;
      province: string;
      code_postal: string;
      pays: string;
    };
  };
}

export default function ConfirmationCommandePage() {
  const { id } = useParams();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await api.get(`/commandes/${id}`);
        setCommande(res.data.data);
      } catch (err: any) {
        console.error('Error fetching order', err);
        setError('Impossible de récupérer les détails de la commande.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCommande();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <span className="text-xs text-accent uppercase tracking-widest animate-pulse">Récupération des détails de la commande...</span>
      </main>
    );
  }

  if (error || !commande) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-4">Erreur</p>
        <h1 className="text-3xl font-serif font-light tracking-widest uppercase mb-6 text-foreground">
          Commande introuvable
        </h1>
        <p className="text-xs text-accent max-w-sm leading-relaxed mb-8 font-light">
          {error || "Nous n'avons pas pu charger les informations de cette commande."}
        </p>
        <Link 
          href="/" 
          className="border border-foreground bg-foreground text-background px-10 py-3 text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-foreground transition-all duration-300 font-medium"
        >
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  // Mapper les statuts
  const statutLivraison = commande.livraison?.statut || 'en_attente';
  const etapes = [
    { key: 'en_attente', label: 'Reçue', icon: CheckCircle2, completed: true },
    { key: 'confirmee', label: 'Confirmée', icon: ShieldCheck, completed: ['confirmee', 'preparee', 'expediee', 'livree'].includes(commande.statut) },
    { key: 'expediee', label: 'Expédiée', icon: Truck, completed: ['expediee', 'livree'].includes(statutLivraison) },
    { key: 'livree', label: 'Livrée', icon: Package, completed: statutLivraison === 'livree' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-32 min-h-screen">
      
      {/* En-tête de succès */}
      <div className="text-center mb-16">
        <div className="inline-flex border border-emerald-100 p-4 rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <CheckCircle2 size={36} />
        </div>
        <p className="text-[10px] tracking-[0.5em] uppercase text-accent font-semibold mb-3">Maison de Couture</p>
        <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide text-foreground">
          Merci pour votre commande
        </h1>
        <p className="text-xs text-accent mt-3 font-light">
          Commande <span className="font-sans font-semibold text-foreground">#{commande.numero}</span> confirmée le {commande.created_at}.
        </p>
        <div className="w-16 h-[1px] bg-accent mx-auto mt-8" />
      </div>

      {/* Suivi de livraison */}
      <div className="border border-border bg-card p-6 md:p-8 mb-12">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-8 pb-4 border-b border-border">
          Statut de livraison
        </h2>

        <div className="grid grid-cols-4 gap-2 relative">
          {etapes.map((etape, idx) => {
            const Icon = etape.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  etape.completed 
                    ? 'bg-primary border-primary text-background' 
                    : 'bg-background border-border text-accent'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`text-[9px] tracking-wider uppercase font-semibold mt-3 ${
                  etape.completed ? 'text-foreground' : 'text-accent'
                }`}>
                  {etape.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Détails articles */}
        <div className="border border-border bg-card p-6 md:p-8">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-6 pb-4 border-b border-border">
            Articles commandés
          </h2>
          <div className="divide-y divide-border">
            {commande.lignes?.map((ligne) => (
              <div key={ligne.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                <div className="w-12 aspect-[3/4] bg-background border border-border relative flex-shrink-0">
                  {ligne.variante?.image_url && (
                    <Image
                      src={ligne.variante.image_url}
                      alt={ligne.variante.produit_nom || 'Article'}
                      fill
                      className="object-cover p-0.5"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif font-medium text-foreground truncate">{ligne.variante?.produit_nom}</h4>
                  <p className="text-[9px] text-accent tracking-widest mt-0.5 uppercase">
                    {ligne.variante?.taille} | {ligne.variante?.couleur} × {ligne.quantite}
                  </p>
                </div>
                <span className="text-xs font-semibold text-foreground font-sans">
                  {parseFloat(ligne.sous_total).toFixed(2)} $
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-[1px] bg-border my-6" />

          <div className="flex justify-between text-xs font-bold text-foreground uppercase tracking-widest">
            <span>Total réglé</span>
            <span className="font-sans text-sm">{parseFloat(commande.montant_total).toFixed(2)} $ CAD</span>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="border border-border bg-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-6 pb-4 border-b border-border">
              Adresse d'expédition
            </h2>
            {commande.livraison?.adresse ? (
              <div className="text-xs text-accent leading-relaxed space-y-1 font-light">
                <p className="font-semibold text-foreground">{commande.livraison.adresse.rue}</p>
                <p>{commande.livraison.adresse.ville}, {commande.livraison.adresse.province}</p>
                <p>{commande.livraison.adresse.code_postal}</p>
                <p className="uppercase tracking-wider font-medium text-foreground mt-2">{commande.livraison.adresse.pays}</p>
              </div>
            ) : (
              <p className="text-xs text-accent italic">Aucune adresse fournie.</p>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <Link
              href="/boutique"
              className="w-full bg-primary text-background py-3.5 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-accent hover:text-background transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Continuer mes achats
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </main>
  );
}
