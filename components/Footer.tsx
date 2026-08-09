import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <Image 
              src="/logo-benf.jpg" 
              alt="BENF∞INFINITY" 
              width={36} 
              height={36} 
              className="rounded-full"
            />
            <span className="font-serif text-sm tracking-[0.15em] uppercase font-light">
              BENF<span className="font-semibold text-white/60">∞</span>INFINITY
            </span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed font-light">
            Be Different. Be Yourself.<br />
            Streetwear premium, matières éthiques,<br />
            coupes intemporelles.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-5 text-white/70">
            Navigation
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/boutique" className="text-xs text-white/40 hover:text-white transition-colors font-light">Boutique</Link>
            <Link href="/a-propos" className="text-xs text-white/40 hover:text-white transition-colors font-light">À propos</Link>
            <Link href="/contact" className="text-xs text-white/40 hover:text-white transition-colors font-light">Contact</Link>
          </div>
        </div>

        {/* Assistance */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-5 text-white/70">
            Assistance
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/commander" className="text-xs text-white/40 hover:text-white transition-colors font-light">Mon compte</Link>
            <Link href="/panier" className="text-xs text-white/40 hover:text-white transition-colors font-light">Panier</Link>
            <Link href="/contact" className="text-xs text-white/40 hover:text-white transition-colors font-light">Nous contacter</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-5 text-white/70">
            Contact
          </p>
          <div className="flex flex-col gap-3 text-xs text-white/40 font-light">
            <p>contact@benf-infinity.com</p>
            <p>Instagram : @benfinfinity</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10">
        <p className="text-[10px] tracking-widest text-white/30 text-center font-light uppercase">
          © {new Date().getFullYear()} BENF∞INFINITY. Tous droits réservés. Be Different. Be Yourself.
        </p>
      </div>
    </footer>
  );
}