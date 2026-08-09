import ProductDetails from './ProductDetails';
import Link from 'next/link';
import { getShopifyProductBySlug, isShopifyEnabled, UnifiedProduct } from '@/lib/shopify';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getProduit(slug: string): Promise<UnifiedProduct | null> {
  // Essayer Shopify en priorité si configuré
  if (isShopifyEnabled()) {
    try {
      const shopifyProduct = await getShopifyProductBySlug(slug);
      if (shopifyProduct) {
        return shopifyProduct;
      }
    } catch (err) {
      console.error(`Shopify loading error for product ${slug}, falling back to local API:`, err);
    }
  }

  // Fallback Laravel API
  try {
    const res = await fetch(`${API_URL}/produits/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Erreur lors du chargement du produit ${slug} :`, error);
    return null;
  }
}

export default async function ProduitPage({ params }: PageProps) {
  const { slug } = await params;
  const produit = await getProduit(slug);

  if (!produit) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-4">Produit</p>
        <h1 className="text-3xl font-serif font-light tracking-widest uppercase mb-6 text-foreground">
          Introuvable
        </h1>
        <p className="text-xs text-accent max-w-md leading-relaxed mb-8 font-light">
          Ce produit n&apos;existe pas ou est actuellement indisponible dans notre boutique.
        </p>
        <div className="w-12 h-[1px] bg-accent mb-8" />
        <Link 
          href="/boutique" 
          className="border border-foreground bg-foreground text-background px-10 py-3 text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-foreground transition-all duration-300 font-medium"
        >
          Retour à la boutique
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      <ProductDetails produit={produit} />
    </main>
  );
}
