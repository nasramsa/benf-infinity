import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section — Full bleed dark with product image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image 
            src="/products/tshirt-noir-dark.png" 
            alt="BENF∞INFINITY T-Shirt Noir" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.6em] uppercase text-white/60 font-semibold mb-8 animate-fade-in-up">
            Be Different. Be Yourself.
          </p>
          
          <h1 className="text-5xl md:text-8xl font-serif font-light tracking-[0.2em] uppercase text-white mb-6 animate-fade-in-up animation-delay-100">
            BENF<span className="font-bold text-white/80">∞</span>INFINITY
          </h1>
          
          <p className="font-serif italic text-white/50 text-sm md:text-base max-w-xl mx-auto mb-14 leading-relaxed font-light animate-fade-in-up animation-delay-200">
            « Des pièces d&apos;exception pensées pour l&apos;éternité. Coton biologique de haute densité, confection artisanale et coupes intemporelles. »
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
            <Link
              href="/boutique"
              className="border border-white bg-white text-black px-14 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-white transition-all duration-500 font-medium"
            >
              Découvrir la collection
            </Link>
            <Link
              href="/a-propos"
              className="border border-white/30 text-white px-14 py-4 text-[10px] tracking-[0.3em] uppercase hover:border-white hover:bg-white/5 transition-all duration-500 font-medium"
            >
              Notre histoire
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-fade-in animation-delay-400">
          <span className="text-[8px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
            <div className="w-full h-3 bg-white/60 absolute top-0 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Collection Grid — 4 produits */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[9px] tracking-[0.5em] uppercase text-accent font-semibold">Collection</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-[0.15em] uppercase text-foreground mt-4">
              Nos pièces signatures
            </h2>
            <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Noir */}
            <Link href="/boutique" className="group flex flex-col">
              <div className="aspect-[3/4] bg-white border border-border overflow-hidden mb-4 relative">
                <Image
                  src="/products/tshirt-noir.png"
                  alt="T-Shirt Infinity Noir"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 p-2"
                />
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1">
                  <span className="text-[8px] tracking-[0.3em] uppercase font-bold">Bestseller</span>
                </div>
              </div>
              <h3 className="text-sm font-serif font-medium tracking-wide text-foreground group-hover:text-accent transition-colors">
                T-Shirt Infinity Noir
              </h3>
              <p className="text-[11px] text-accent tracking-widest mt-1 uppercase">Coton Premium</p>
              <p className="text-xs font-semibold text-foreground tracking-wider mt-2">49.99 €</p>
            </Link>

            {/* Blanc */}
            <Link href="/boutique" className="group flex flex-col">
              <div className="aspect-[3/4] bg-white border border-border overflow-hidden mb-4 relative">
                <Image
                  src="/products/tshirt-blanc.png"
                  alt="T-Shirt Infinity Blanc"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 p-2"
                />
              </div>
              <h3 className="text-sm font-serif font-medium tracking-wide text-foreground group-hover:text-accent transition-colors">
                T-Shirt Infinity Blanc
              </h3>
              <p className="text-[11px] text-accent tracking-widest mt-1 uppercase">Coton Premium</p>
              <p className="text-xs font-semibold text-foreground tracking-wider mt-2">49.99 €</p>
            </Link>

            {/* Bordeaux */}
            <Link href="/boutique" className="group flex flex-col">
              <div className="aspect-[3/4] bg-white border border-border overflow-hidden mb-4 relative">
                <Image
                  src="/products/tshirt-bordeaux.png"
                  alt="T-Shirt Infinity Bordeaux"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 p-2"
                />
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1">
                  <span className="text-[8px] tracking-[0.3em] uppercase font-bold">Nouveau</span>
                </div>
              </div>
              <h3 className="text-sm font-serif font-medium tracking-wide text-foreground group-hover:text-accent transition-colors">
                T-Shirt Infinity Bordeaux
              </h3>
              <p className="text-[11px] text-accent tracking-widest mt-1 uppercase">Coton Premium</p>
              <p className="text-xs font-semibold text-foreground tracking-wider mt-2">49.99 €</p>
            </Link>

            {/* Bleu Marine */}
            <Link href="/boutique" className="group flex flex-col">
              <div className="aspect-[3/4] bg-white border border-border overflow-hidden mb-4 relative">
                <Image
                  src="/products/tshirt-bleu-marine.png"
                  alt="T-Shirt Infinity Bleu Marine"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 p-2"
                />
              </div>
              <h3 className="text-sm font-serif font-medium tracking-wide text-foreground group-hover:text-accent transition-colors">
                T-Shirt Infinity Bleu Marine
              </h3>
              <p className="text-[11px] text-accent tracking-widest mt-1 uppercase">Coton Premium</p>
              <p className="text-xs font-semibold text-foreground tracking-wider mt-2">49.99 €</p>
            </Link>
          </div>

          <div className="text-center mt-14">
            <Link
              href="/boutique"
              className="border border-foreground bg-foreground text-background px-14 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-foreground transition-all duration-500 font-medium inline-block"
            >
              Voir toute la collection
            </Link>
          </div>
        </div>
      </section>

      {/* Focus Produit — Lookbook Section (Dark) */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
            
            <div className="lg:col-span-7 relative overflow-hidden">
              <Image 
                src="/products/tshirt-noir.png" 
                alt="T-Shirt Infinity Noir — Pièce maîtresse"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center px-8 md:px-16 py-20">
              <span className="text-[9px] tracking-[0.5em] uppercase text-white/50 font-semibold mb-6">La pièce maîtresse</span>
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide text-white mb-6">
                Le T-Shirt<br />Infinity Classic
              </h2>
              <div className="w-12 h-[1px] bg-white/30 mb-8" />
              <p className="text-white/50 text-xs leading-relaxed mb-4 max-w-md font-light">
                Le t-shirt signature de la maison. Confectionné en coton biologique peigné de 200g, il offre une tenue parfaite et un confort absolu.
              </p>
              <p className="text-white/50 text-xs leading-relaxed mb-10 max-w-md font-light">
                Disponible dans une palette de 5 coloris : Noir, Blanc, Bordeaux, Bleu Marine et Beige.
              </p>
              <div className="flex items-center gap-8">
                <span className="text-lg font-semibold tracking-wider text-white">49.99 €</span>
                <Link
                  href="/boutique"
                  className="border border-white text-white px-10 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500 font-medium"
                >
                  Commander
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Values Strip */}
      <section className="bg-beige border-t border-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-2xl mb-4">♻️</div>
              <h3 className="text-[11px] tracking-[0.25em] uppercase text-foreground font-bold mb-3">Éco-responsable</h3>
              <p className="text-[11px] text-accent leading-relaxed font-light max-w-xs mx-auto">
                Coton bio certifié, cultivé sans pesticides. Respect de la planète à chaque étape.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-4">✂️</div>
              <h3 className="text-[11px] tracking-[0.25em] uppercase text-foreground font-bold mb-3">Confection artisanale</h3>
              <p className="text-[11px] text-accent leading-relaxed font-light max-w-xs mx-auto">
                Double surpiqûre, col renforcé, finitions haut de gamme. Des pièces qui traversent les années.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-4">🖤</div>
              <h3 className="text-[11px] tracking-[0.25em] uppercase text-foreground font-bold mb-3">Be Different</h3>
              <p className="text-[11px] text-accent leading-relaxed font-light max-w-xs mx-auto">
                Design épuré et coupes oversized conçues pour affirmer votre style unique et intemporel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook Band — Beige T-shirt */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden border border-border bg-white">
              <Image 
                src="/products/tshirt-beige.jpeg" 
                alt="T-Shirt Infinity Beige"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center lg:pl-8">
              <span className="text-[9px] tracking-[0.5em] uppercase text-accent font-semibold mb-4">Nouveau coloris</span>
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide text-foreground mb-6">
                Le T-Shirt Beige
              </h2>
              <div className="w-12 h-[1px] bg-accent mb-8" />
              <p className="text-accent text-xs leading-relaxed mb-4 max-w-md font-light">
                Teinte sable naturelle, douce et sophistiquée. Ce nouveau coloris incarne l&apos;élégance minimaliste de la maison BENF∞INFINITY.
              </p>
              <p className="text-accent text-xs leading-relaxed mb-10 max-w-md font-light">
                Coton biologique peigné 200 GSM. Coupe oversized unisexe.
              </p>
              <Link
                href="/boutique"
                className="border border-foreground bg-foreground text-background px-12 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-foreground transition-all duration-500 font-medium self-start"
              >
                Ajouter au panier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recto-Verso Showcase */}
      <section className="bg-black py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/40 font-semibold mb-4 block">Vue complète</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide text-white mb-12">
            Recto — Verso
          </h2>
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image 
              src="/products/tshirt-marine-recto-verso.jpg" 
              alt="T-Shirt Bleu Marine Recto Verso"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-white/40 text-xs mt-8 font-light tracking-wider">
            T-Shirt Infinity Bleu Marine — Coupe oversized — Coton bio 200 GSM
          </p>
        </div>
      </section>

    </div>
  );
}