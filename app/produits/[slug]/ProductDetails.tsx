'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { usePanier } from '@/store/panierStore';
import { ShoppingBag, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

interface Stock {
  quantite: number;
  disponible: boolean;
}

interface Variante {
  id: number | string;
  sku: string;
  taille: string;
  couleur: string;
  prix: string;
  stock?: Stock | null;
}

interface Media {
  url: string;
  principale: boolean;
  ordre: number;
}

interface Produit {
  id: number | string;
  nom: string;
  slug: string;
  description: string;
  prix_base: string;
  variantes: Variante[];
  medias: Media[];
  note_moyenne?: number;
}

export default function ProductDetails({ produit }: { produit: Produit }) {
  const ajouterArticle = usePanier((s) => s.ajouterArticle);
  
  // Extraire les couleurs uniques et les tailles uniques
  const couleurs = useMemo(
    () => Array.from(new Set(produit.variantes.map((v) => v.couleur))),
    [produit.variantes]
  );
  const tailles = useMemo(
    () => Array.from(new Set(produit.variantes.map((v) => v.taille))),
    [produit.variantes]
  );

  const [selectedColor, setSelectedColor] = useState(couleurs[0] || '');
  const [selectedSize, setSelectedSize] = useState(tailles[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedNotify, setAddedNotify] = useState(false);
  
  // FIX #1 & #2 : Utiliser un index d'image au lieu de chercher par nom de fichier
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Trouver la variante correspondante
  const varianteActive = produit.variantes.find(
    (v) => v.couleur === selectedColor && v.taille === selectedSize
  );

  // FIX #1 : L'image active est simplement celle à l'index sélectionné
  const imageActive = produit.medias[selectedImageIndex]?.url || produit.medias[0]?.url;

  // FIX #3 : Logique de stock tolérante
  // Si le stock n'existe pas (null/undefined), on considère le produit comme disponible
  // pour ne pas bloquer l'utilisateur. Le backend validera le stock au moment de la commande.
  const stockInfo = varianteActive?.stock;
  const stockDisponible = stockInfo?.quantite ?? null;
  const estEnStock = stockInfo 
    ? (stockInfo.disponible && stockInfo.quantite > 0)
    : true; // Si pas de données stock, on laisse le client ajouter au panier

  const handleAddToCart = () => {
    if (!varianteActive || !estEnStock) return;

    ajouterArticle({
      varianteId: varianteActive.id,
      produitNom: produit.nom,
      taille: selectedSize,
      couleur: selectedColor,
      prix: parseFloat(varianteActive.prix),
      quantite: quantity,
      imageUrl: imageActive,
    });

    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      {/* Galerie photos gauche */}
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-[3/4] bg-card border border-border overflow-hidden p-2 relative">
          {imageActive ? (
            <Image
              src={imageActive}
              alt={produit.nom}
              width={800}
              height={1066}
              className="w-full h-full object-cover transition-all duration-500"
              priority
            />
          ) : (
            <div className="w-full h-full bg-background flex items-center justify-center">
              <span className="text-accent text-xs uppercase tracking-widest">Pas d'image</span>
            </div>
          )}
        </div>

        {/* FIX #2 : Miniatures — cliquables pour TOUTES les images, pas juste noir/blanc */}
        {produit.medias.length > 1 && (
          <div className="flex gap-4">
            {produit.medias.map((media, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 aspect-[3/4] p-1 border bg-card transition-all duration-300 ${
                  selectedImageIndex === idx 
                    ? 'border-primary ring-1 ring-primary' 
                    : 'border-border hover:border-accent'
                }`}
              >
                <Image
                  src={media.url}
                  alt={`${produit.nom} - vue ${idx + 1}`}
                  width={100}
                  height={133}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Détails produit droite */}
      <div className="lg:col-span-5 flex flex-col pt-2">
        <nav className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-accent mb-6 font-medium">
          <Link href="/boutique" className="hover:text-primary">Boutique</Link>
          <ChevronRight size={10} />
          <span className="text-primary">{produit.nom}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide text-foreground mb-3">
          {produit.nom}
        </h1>
        
        <p className="text-lg font-medium text-foreground tracking-wider font-sans mb-6">
          {varianteActive ? parseFloat(varianteActive.prix).toFixed(2) : parseFloat(produit.prix_base).toFixed(2)} €
        </p>

        <div className="w-full h-[1px] bg-border mb-8" />

        <p className="text-accent text-xs leading-relaxed mb-8 font-light">
          {produit.description}
        </p>

        {/* Sélecteur de couleur */}
        {couleurs.length > 0 && (
          <div className="mb-6">
            <span className="text-[10px] tracking-widest uppercase text-accent font-semibold block mb-3">
              Couleur : <span className="text-foreground font-normal">{selectedColor}</span>
            </span>
            <div className="flex gap-3 flex-wrap">
              {couleurs.map((couleur) => (
                <button
                  key={couleur}
                  onClick={() => {
                    setSelectedColor(couleur);
                    // Trouver la première taille disponible pour cette couleur
                    const firstValidVariant = produit.variantes.find((v) => v.couleur === couleur);
                    if (firstValidVariant) {
                      setSelectedSize(firstValidVariant.taille);
                    }
                  }}
                  className={`px-6 py-2 border text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    selectedColor === couleur
                      ? 'border-primary bg-primary text-background font-medium'
                      : 'border-border bg-card text-foreground hover:border-accent'
                  }`}
                >
                  {couleur}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sélecteur de taille */}
        {tailles.length > 0 && (
          <div className="mb-8">
            <span className="text-[10px] tracking-widest uppercase text-accent font-semibold block mb-3">
              Taille : <span className="text-foreground font-normal">{selectedSize}</span>
            </span>
            <div className="flex gap-2 flex-wrap">
              {tailles.map((taille) => {
                const variantCheck = produit.variantes.find(
                  (v) => v.couleur === selectedColor && v.taille === taille
                );
                // FIX #3 : Si pas de stock data, considérer comme disponible
                const stockData = variantCheck?.stock;
                const dispo = stockData
                  ? (stockData.disponible && stockData.quantite > 0)
                  : !!variantCheck; // Disponible si la variante existe, même sans stock data

                return (
                  <button
                    key={taille}
                    onClick={() => dispo && setSelectedSize(taille)}
                    disabled={!dispo}
                    className={`w-12 h-12 border text-xs flex items-center justify-center transition-all duration-300 ${
                      !dispo
                        ? 'border-border text-border line-through bg-background cursor-not-allowed'
                        : selectedSize === taille
                        ? 'border-primary bg-primary text-background font-medium cursor-pointer'
                        : 'border-border bg-card text-foreground hover:border-accent cursor-pointer'
                    }`}
                  >
                    {taille}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sélecteur de quantité & Stock */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-widest uppercase text-accent font-semibold">Quantité</span>
            <span className={`text-[10px] uppercase tracking-wider font-medium ${
              estEnStock ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {stockDisponible !== null
                ? (estEnStock ? `En Stock (${stockDisponible} disponibles)` : 'En rupture de stock')
                : (estEnStock ? 'Disponible' : 'Indisponible')
              }
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex border border-border bg-card">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={!estEnStock}
                className="w-12 h-12 flex items-center justify-center text-lg text-accent hover:text-primary transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-12 h-12 flex items-center justify-center text-xs font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => stockDisponible !== null ? Math.min(stockDisponible, q + 1) : q + 1)}
                disabled={!estEnStock}
                className="w-12 h-12 flex items-center justify-center text-lg text-accent hover:text-primary transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!estEnStock || !varianteActive}
              className="flex-1 bg-primary text-background tracking-widest text-[10px] uppercase font-bold hover:bg-accent hover:text-background transition-colors duration-300 disabled:bg-border disabled:text-accent disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={14} />
              Ajouter au panier
            </button>
          </div>
        </div>

        {/* Notifications d'ajout */}
        {addedNotify && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 mb-8 flex items-center gap-3 animate-fade-in">
            <Check size={16} className="text-emerald-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold">Article ajouté au panier</p>
              <p className="mt-0.5 text-[11px] opacity-95">
                {produit.nom} ({selectedColor} - {selectedSize}) × {quantity}
              </p>
            </div>
            <Link 
              href="/panier" 
              className="ml-auto text-[10px] tracking-widest uppercase font-bold text-emerald-800 border-b border-emerald-800 hover:text-emerald-600 transition-colors pb-0.5 whitespace-nowrap"
            >
              Voir le panier
            </Link>
          </div>
        )}

        <div className="w-full h-[1px] bg-border mb-8" />
        
        {/* Détails complémentaires */}
        <div className="space-y-4 text-[11px] text-accent font-light leading-relaxed">
          <p>• Confection artisanale éthique</p>
          <p>• 100% Coton biologique peigné (200 GSM)</p>
          <p>• Livraison express offerte pour toute commande supérieure à 150 €</p>
        </div>
      </div>
      
    </div>
  );
}
