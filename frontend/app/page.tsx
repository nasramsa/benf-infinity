// frontend/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="pt-16"> {/* Compense la navbar fixed */}

      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
        <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4">
          Mode Premium — Canada
        </p>
        <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase mb-8">
          Benf<span className="font-bold">∞</span>Infinity
        </h1>
        <p className="text-sm text-gray-500 max-w-md mb-12 leading-relaxed">
          Des pièces pensées pour durer. T-shirts premium, coupe moderne,
          fabriqués avec soin.
        </p>
        <Link
          href="/boutique"
          className="border border-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
        >
          Découvrir la collection
        </Link>
      </section>

      {/* Section mise en avant */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
            {/* Remplace par ta vraie photo produit */}
            <p className="text-gray-400 text-sm">Photo produit</p>
          </div>
          <div className="flex flex-col justify-center px-8">
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
              Nouveauté
            </p>
            <h2 className="text-3xl font-light tracking-wide mb-6">
              T-Shirt Infinity Classic
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Le t-shirt signature de la maison. Coton bio 200g, coupe droite
              moderne. Disponible en noir et blanc.
            </p>
            <Link
              href="/boutique"
              className="self-start border-b border-black text-xs tracking-widest uppercase pb-1 hover:text-gray-500 transition-colors"
            >
              Voir le produit
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}