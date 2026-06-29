// app/boutique/page.tsx
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

// Server Component : le fetch se fait côté serveur (SEO optimal)
async function getProduits() {
  const res = await api.get('/produits');
  return res.data.data; // Laravel Resource wraps in { data: [...] }
}

export default async function BoutiquePage() {
  const produits = await getProduits();

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-light tracking-widest mb-12 text-center uppercase">
        Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {produits.map((produit: any) => (
          <Link key={produit.id} href={`/produits/${produit.slug}`} className="group">
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
              {produit.medias?.[0] && (
                <Image
                  src={produit.medias[0].url}
                  alt={produit.nom}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <h2 className="text-sm font-medium tracking-wide">{produit.nom}</h2>
            <p className="text-sm text-gray-500 mt-1">{produit.prix_base} $ CAD</p>
          </Link>
        ))}
      </div>
    </main>
  );
}