'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePanier } from '@/store/panierStore';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { isShopifyEnabled, createShopifyCheckout } from '@/lib/shopify';

export default function PanierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { articles, retirerArticle, mettreAJourQuantite, total } = usePanier();
  const subtotal = total();
  const livraison = subtotal > 150 ? 0 : 15;
  const grandTotal = subtotal + livraison;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (isShopifyEnabled()) {
        const lineItems = articles.map(a => ({
          variantId: a.varianteId,
          quantity: a.quantite
        }));
        const checkoutUrl = await createShopifyCheckout(lineItems);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      }
      router.push('/commander');
    } catch (err) {
      console.error('Erreur de redirection checkout:', err);
      router.push('/commander');
    } finally {
      setLoading(false);
    }
  };

  if (articles.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <div className="border border-border p-6 rounded-full mb-6 bg-card text-accent">
          <ShoppingBag size={32} />
        </div>
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-4">Votre Panier</p>
        <h1 className="text-3xl font-serif font-light tracking-widest uppercase mb-6 text-foreground">
          Est vide
        </h1>
        <p className="text-xs text-accent max-w-sm leading-relaxed mb-8 font-light">
          Vous n'avez sélectionné aucun article pour le moment. Explorez notre collection exclusive pour commencer vos achats.
        </p>
        <div className="w-12 h-[1px] bg-accent mb-8" />
        <Link 
          href="/boutique" 
          className="border border-foreground bg-foreground text-background px-10 py-3 text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-foreground transition-all duration-300 font-medium"
        >
          Découvrir la collection
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.5em] uppercase text-accent font-semibold mb-4">Be Different. Be Yourself.</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-[0.2em] uppercase text-foreground">
          Votre Panier
        </h1>
        <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Liste articles gauche */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-border bg-card p-6 md:p-8">
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-8 pb-4 border-b border-border">
              Articles sélectionnés ({articles.reduce((acc, a) => acc + a.quantite, 0)})
            </h2>
            
            <div className="divide-y divide-border">
              {articles.map((article) => (
                <div key={article.varianteId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  
                  {/* Photo produit */}
                  <div className="w-24 aspect-[3/4] bg-background border border-border overflow-hidden p-1 relative flex-shrink-0">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.produitNom}
                        fill
                        className="object-cover p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-accent">No Image</div>
                    )}
                  </div>

                  {/* Détails */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-serif font-medium tracking-wide text-foreground">
                      {article.produitNom}
                    </h3>
                    <p className="text-[10px] text-accent tracking-widest mt-1.5 uppercase font-sans">
                      Taille : <span className="text-foreground font-semibold">{article.taille}</span> | Couleur : <span className="text-foreground font-semibold">{article.couleur}</span>
                    </p>
                    <p className="text-[11px] font-semibold text-foreground tracking-wider font-sans mt-3">
                      {article.prix.toFixed(2)} €
                    </p>
                  </div>

                  {/* Contrôles de quantité */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex border border-border bg-background">
                      <button
                        onClick={() => mettreAJourQuantite(article.varianteId, Math.max(1, article.quantite - 1))}
                        className="w-8 h-8 flex items-center justify-center text-sm text-accent hover:text-primary"
                      >
                        -
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-[11px] font-semibold">
                        {article.quantite}
                      </span>
                      <button
                        onClick={() => mettreAJourQuantite(article.varianteId, article.quantite + 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm text-accent hover:text-primary"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => retirerArticle(article.varianteId)}
                      className="text-accent hover:text-red-500 transition-colors p-2"
                      title="Retirer l'article"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Sous-total article */}
                  <div className="text-right w-full sm:w-auto hidden sm:block">
                    <p className="text-xs font-bold text-foreground tracking-wider font-sans">
                      {(article.prix * article.quantite).toFixed(2)} €
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Résumé commande droite */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-border bg-card p-6 md:p-8">
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-8 pb-4 border-b border-border">
              Résumé de la commande
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between text-accent">
                <span>Sous-total</span>
                <span className="font-sans font-medium">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-accent">
                <span>Livraison</span>
                <span className="font-sans font-medium">
                  {livraison === 0 ? 'Offerte' : `${livraison.toFixed(2)} €`}
                </span>
              </div>
              
              {livraison > 0 && (
                <p className="text-[9px] text-accent italic leading-relaxed">
                  Ajoutez encore {(150 - subtotal).toFixed(2)} € d'articles pour bénéficier de la livraison gratuite.
                </p>
              )}

              <div className="w-full h-[1px] bg-border my-6" />

              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Total estimé</span>
                <span className="font-sans tracking-wide">{grandTotal.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-8 bg-primary text-background py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-accent hover:text-background transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-border disabled:text-accent disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Redirection...
                </>
              ) : (
                <>
                  Procéder à la commande
                  <ArrowRight size={14} />
                </>
              )}
            </button>


            <p className="text-[9px] text-accent text-center mt-6 leading-relaxed">
              Taxes calculées lors de la saisie de l'adresse de livraison. Transactions sécurisées par Stripe et PayPal.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
