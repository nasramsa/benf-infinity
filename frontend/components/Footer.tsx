import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <p className="text-xs tracking-widest uppercase font-medium mb-4">
            Benf-Infinity
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Mode premium fabriquée au Canada.<br />
            Livraison mondiale.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase font-medium mb-4">
            Navigation
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/boutique" className="text-xs text-gray-400 hover:text-black transition-colors">Boutique</Link>
            <Link href="/a-propos" className="text-xs text-gray-400 hover:text-black transition-colors">À propos</Link>
            <Link href="/contact" className="text-xs text-gray-400 hover:text-black transition-colors">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase font-medium mb-4">
            Support
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/commandes/suivi" className="text-xs text-gray-400 hover:text-black transition-colors">Suivi de commande</Link>
            <Link href="/contact" className="text-xs text-gray-400 hover:text-black transition-colors">Nous contacter</Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-300 text-center">
          © {new Date().getFullYear()} Benf-Infinity. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}