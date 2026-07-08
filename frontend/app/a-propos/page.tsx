import Link from 'next/link';
import Image from 'next/image';

export default function AProposPage() {
  return (
    <main className="min-h-screen">
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <Image 
          src="/products/tshirt-blanc-gris.jpg" 
          alt="BENF∞INFINITY" 
          fill 
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/50 font-semibold mb-4">Notre Histoire</p>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-[0.2em] uppercase text-white">
            À propos de la Maison
          </h1>
          <div className="w-16 h-[1px] bg-white/30 mx-auto mt-6" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
        
        {/* Manifesto */}
        <section className="bg-white border border-border p-10 md:p-16 text-center">
          <p className="font-serif italic text-accent text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            « Nous croyons en un vestiaire de pièces durables, affranchi du rythme effréné de la fast-fashion. Chaque t-shirt BENF∞INFINITY incarne le raffinement minimaliste, l&apos;excellence des coupes et un respect inconditionnel pour les matières nobles et l&apos;environnement. »
          </p>
        </section>

        {/* Section Confection */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="border border-border bg-white aspect-[4/5] relative overflow-hidden">
            <Image 
              src="/products/tshirt-blanc.png" 
              alt="Confection BENF∞INFINITY"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[9px] tracking-[0.4em] uppercase text-accent font-semibold">Le savoir-faire</span>
            <h2 className="text-2xl md:text-3xl font-serif font-light tracking-wide text-foreground">
              Une confection d&apos;excellence
            </h2>
            <div className="w-10 h-[1px] bg-accent" />
            <p className="text-accent text-xs leading-relaxed font-light">
              Toutes nos pièces sont dessinées et confectionnées à partir d&apos;un coton biologique peigné de 200 GSM (grams per square meter). Ce tricotage ultra-dense confère au t-shirt un tombé lourd d&apos;une tenue exceptionnelle, lavage après lavage.
            </p>
            <p className="text-accent text-xs leading-relaxed font-light">
              Nos finitions — double surpiqûre sur l&apos;ourlet et col en côte indéformable renforcé — répondent aux exigences de la haute façon pour vous offrir un vêtement qui traverse les années.
            </p>
          </div>
        </section>

        {/* Valeurs */}
        <section className="border-t border-border pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black text-white p-8 text-center">
              <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4">Éco-responsable</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">
                Utilisation exclusive de coton bio certifié, cultivé sans pesticides chimiques, préservant la biodiversité et l&apos;eau.
              </p>
            </div>
            <div className="bg-black text-white p-8 text-center">
              <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4">Éthique</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">
                Ateliers de confection partenaires garantissant des conditions de travail justes et sûres ainsi qu&apos;une rémunération équitable.
              </p>
            </div>
            <div className="bg-black text-white p-8 text-center">
              <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4">Intemporalité</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">
                Design épuré et coupes oversized conçues pour rester actuelles au fil des saisons sans jamais passer de mode.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-8">
          <Link
            href="/boutique"
            className="inline-block border border-foreground bg-foreground text-background px-14 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-foreground transition-all duration-500 font-medium"
          >
            Découvrir nos créations
          </Link>
        </section>

      </div>

    </main>
  );
}
