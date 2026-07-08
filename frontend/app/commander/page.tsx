'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePanier } from '@/store/panierStore';
import api from '@/lib/api';
import PaiementForm from '@/components/PaiementForm';
import { ShoppingBag, MapPin, CreditCard, ChevronRight, User } from 'lucide-react';

export default function CommanderPage() {
  const articles = usePanier((s) => s.articles);
  const totalPanier = usePanier((s) => s.total);
  const viderPanier = usePanier((s) => s.viderPanier);

  const [token, setToken] = useState<string | null>(null);
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Address Form State
  const [rue, setRue] = useState('');
  const [ville, setVille] = useState('');
  const [province, setProvince] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [pays, setPays] = useState('Canada');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Order State
  const [commandeId, setCommandeId] = useState<number | null>(null);
  const [montantTotal, setMontantTotal] = useState(0);
  const [etape, setEtape] = useState<'adresse' | 'paiement'>('adresse');

  // Vérifier la session locale
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('client', JSON.stringify(res.data.client));
        setToken(res.data.token);
      } else {
        // Inscription
        const res = await api.post('/auth/register', {
          nom,
          prenom,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('client', JSON.stringify(res.data.client));
        setToken(res.data.token);
      }
      
      // Notifier la navbar de la connexion
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      console.error(err);
      setAuthError(err.response?.data?.message || 'Identifiants ou données incorrects.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setAddressLoading(true);

    try {
      // 1. Enregistrer l'adresse de livraison
      const resAdresse = await api.post('/adresses', {
        rue,
        ville,
        province,
        code_postal: codePostal,
        pays,
      });
      const adresseId = resAdresse.data.id;

      // 2. Préparer les lignes de commande
      const lignes = articles.map((art) => ({
        variante_id: art.varianteId,
        quantite: art.quantite,
      }));

      // 3. Créer la commande
      const resCommande = await api.post('/commandes', {
        adresse_id: adresseId,
        lignes,
      });

      // 4. Passer à l'étape paiement
      setCommandeId(resCommande.data.commande_id);
      setMontantTotal(resCommande.data.montant_total);
      setEtape('paiement');
      
      // Vider le panier après commande créée
      viderPanier();
    } catch (err: any) {
      console.error(err);
      setAddressError(err.response?.data?.message || 'Erreur lors de la création de la commande. Veuillez vérifier les stocks.');
    } finally {
      setAddressLoading(false);
    }
  };

  if (articles.length === 0 && etape === 'adresse' && !commandeId) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold mb-4">Tunnel de Commande</p>
        <h1 className="text-3xl font-serif font-light tracking-widest uppercase mb-6 text-foreground">
          Aucun Article
        </h1>
        <p className="text-xs text-accent max-w-sm leading-relaxed mb-8 font-light">
          Vous devez avoir des articles dans votre panier pour passer une commande.
        </p>
        <Link 
          href="/boutique" 
          className="border border-foreground bg-foreground text-background px-10 py-3 text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-foreground transition-all duration-300 font-medium"
        >
          Découvrir la boutique
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      
      {/* Progression */}
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-16 text-[10px] tracking-[0.2em] uppercase font-semibold text-accent">
        <span className={`${etape === 'adresse' ? 'text-primary font-bold' : ''}`}>1. Adresse</span>
        <ChevronRight size={12} />
        <span className={`${etape === 'paiement' ? 'text-primary font-bold' : ''}`}>2. Règlement</span>
        <ChevronRight size={12} />
        <span>3. Confirmation</span>
      </div>

      {!token ? (
        /* ================= FLUX D'AUTHENTIFICATION ================= */
        <div className="max-w-md mx-auto border border-border bg-card p-8">
          <div className="text-center mb-8">
            <User size={24} className="mx-auto text-accent mb-3" />
            <h2 className="text-xl font-serif font-light tracking-widest uppercase text-foreground">
              {isLogin ? 'Connexion' : 'Création de compte'}
            </h2>
            <p className="text-[10px] text-accent mt-2 font-light">
              {isLogin 
                ? 'Connectez-vous pour finaliser votre commande.' 
                : 'Inscrivez-vous en quelques instants pour commander.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                />
              </div>
            )}

            {authError && <p className="text-red-500 text-[11px] font-sans font-medium">{authError}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary text-background py-3.5 tracking-widest text-[10px] uppercase font-bold hover:bg-accent transition-colors duration-300 disabled:opacity-50 mt-4"
            >
              {authLoading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          <div className="w-full h-[1px] bg-border my-6" />

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setAuthError('');
            }}
            className="w-full text-center text-[10px] tracking-widest uppercase text-accent hover:text-primary transition-colors font-medium"
          >
            {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter'}
          </button>
        </div>
      ) : (
        /* ================= FORMULAIRE D'ADRESSE ET PANIER ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Tunnel principal gauche */}
          <div className="lg:col-span-7">
            {etape === 'adresse' ? (
              <div className="border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                  <MapPin size={18} className="text-accent" />
                  <h2 className="text-sm font-serif font-medium tracking-wide text-foreground">
                    Adresse de livraison
                  </h2>
                </div>

                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Rue et numéro</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Rue de la Montagne, App 4"
                      value={rue}
                      onChange={(e) => setRue(e.target.value)}
                      className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Ville</label>
                      <input
                        type="text"
                        required
                        placeholder="Montréal"
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
                        className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Province / Région</label>
                      <input
                        type="text"
                        required
                        placeholder="Québec"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Code postal</label>
                      <input
                        type="text"
                        required
                        placeholder="H3G 1Z8"
                        value={codePostal}
                        onChange={(e) => setCodePostal(e.target.value)}
                        className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Pays</label>
                      <select
                        value={pays}
                        onChange={(e) => setPays(e.target.value)}
                        className="w-full border border-border bg-background p-3 text-xs focus:border-accent outline-none"
                      >
                        <option value="Canada">Canada</option>
                        <option value="États-Unis">États-Unis</option>
                        <option value="France">France</option>
                      </select>
                    </div>
                  </div>

                  {addressError && <p className="text-red-500 text-[11px] font-sans font-medium">{addressError}</p>}

                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="w-full bg-primary text-background py-4 tracking-[0.3em] text-[10px] uppercase font-bold hover:bg-accent transition-colors duration-300 disabled:opacity-50 mt-6"
                  >
                    {addressLoading ? 'Validation en cours...' : 'Passer au règlement'}
                  </button>
                </form>
              </div>
            ) : (
              commandeId && (
                <PaiementForm commandeId={commandeId} montant={montantTotal} />
              )
            )}
          </div>

          {/* Récapitulatif panier droite */}
          <div className="lg:col-span-5 border border-border bg-card p-6 md:p-8">
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-8 pb-4 border-b border-border">
              Récapitulatif des articles
            </h2>

            {commandeId ? (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between text-accent">
                  <span>Numéro de commande</span>
                  <span className="font-semibold text-foreground font-sans">#000{commandeId}</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>Montant de la commande</span>
                  <span className="font-sans font-bold text-foreground">{montantTotal.toFixed(2)} $ CAD</span>
                </div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border max-h-[40vh] overflow-y-auto mb-6 pr-2">
                  {articles.map((article) => (
                    <div key={article.varianteId} className="py-4 first:pt-0 flex gap-4 items-center">
                      <div className="w-12 aspect-[3/4] bg-background border border-border relative flex-shrink-0">
                        {article.imageUrl && (
                          <Image
                            src={article.imageUrl}
                            alt={article.produitNom}
                            fill
                            className="object-cover p-0.5"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif font-medium text-foreground truncate">{article.produitNom}</h4>
                        <p className="text-[9px] text-accent tracking-widest mt-0.5 uppercase">
                          {article.taille} | {article.couleur} × {article.quantite}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-foreground font-sans">
                        {(article.prix * article.quantite).toFixed(2)} $
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-xs pt-4 border-t border-border">
                  <div className="flex justify-between text-accent">
                    <span>Sous-total</span>
                    <span className="font-sans">{totalPanier().toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>Livraison</span>
                    <span className="font-sans">{totalPanier() > 150 ? 'Offerte' : '15.00 $'}</span>
                  </div>
                  <div className="w-full h-[1px] bg-border my-3" />
                  <div className="flex justify-between text-xs font-bold text-foreground uppercase tracking-widest">
                    <span>Total global</span>
                    <span className="font-sans">
                      {(totalPanier() + (totalPanier() > 150 ? 0 : 15)).toFixed(2)} $ CAD
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      )}

    </main>
  );
}
