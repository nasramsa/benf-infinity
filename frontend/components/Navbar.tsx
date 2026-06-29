'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { usePanier } from '@/store/panierStore';

export default function Navbar() {
  const articles = usePanier((s) => s.articles);
  const nombreArticles = articles.reduce((sum, a) => sum + a.quantite, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* Remplace /logo.png par le chemin réel de ton logo
              À placer dans frontend/public/logo.png */}
        <Image
            src="/logo.jpg"  // ← .jpg au lieu de .png
            alt="Benf-Infinity"
            width={120}
            height={40}
            className="object-contain"
        />
        </Link>

        {/* Navigation centrale */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/boutique"
            className="text-xs tracking-widest uppercase hover:text-gray-500 transition-colors"
          >
            Boutique
          </Link>
          <Link
            href="/a-propos"
            className="text-xs tracking-widest uppercase hover:text-gray-500 transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            className="text-xs tracking-widest uppercase hover:text-gray-500 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Icône panier */}
        <Link href="/panier" className="relative">
          <ShoppingBag size={20} />
          {nombreArticles > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {nombreArticles}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}