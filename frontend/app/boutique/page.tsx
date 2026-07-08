// app/boutique/page.tsx
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

async function getProduits() {
  try {
    const res = await api.get('/produits');
    return res.data.data; // Laravel Resource wraps in { data: [...] }
  } catch (error) {
    console.error('Erreur lors du chargement des produits :', error);
    return null;
  }
}

export default async function BoutiquePage() {
  const produits = await getProduits();

  if (!produits || produits.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-4">Collection</p>
        <h1 className="text-3xl font-serif font-light tracking-widest uppercase mb-6 text-foreground">
          Indisponible
        </h1>
        <p className="text-xs text-accent max-w-md leading-relaxed mb-8 font-light">
          Notre catalogue est momentanément inaccessible. Veuillez vous assurer que le serveur API tourne sur le port 8000.
        </p>
        <div className="w-12 h-[1px] bg-accent mb-8" />
        <Link 
          href="/" 
          className="border border-foreground bg-foreground text-background px-10 py-3 text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-foreground transition-all duration-300 font-medium"
        >
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.5em] uppercase text-accent font-semibold mb-4 font-sans">          Be Different. Be Yourself.
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-[0.2em] uppercase text-foreground">
          Collection
        </h1>
        <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {produits.map((produit: any) => (
          <Link key={produit.id} href={`/produits/${produit.slug}`} className="group flex flex-col">
            <div className="aspect-[3/4] bg-card border border-border overflow-hidden mb-6 p-2 relative">
              {produit.medias?.[0] ? (
                <Image
                  src={produit.medias[0].url}
                  alt={produit.nom}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-background flex items-center justify-center border border-dashed border-border">
                  <span className="text-accent text-[10px] uppercase tracking-widest">Image indisponible</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-serif font-medium tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
                  {produit.nom}
                </h2>
                <p className="text-[11px] text-accent tracking-widest mt-1 uppercase font-sans">T-Shirt Premium</p>
              </div>
              <p className="text-xs font-semibold text-foreground tracking-wider font-sans">
                {parseFloat(produit.prix_base).toFixed(2)} €
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}