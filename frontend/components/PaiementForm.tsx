// components/PaiementForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import api from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Formulaire Stripe (monté à l'intérieur du Provider Elements)
function StripeForm({ commandeId }: { commandeId: number }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErreur('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/commandes/${commandeId}/confirmation`,
      },
    });

    if (error) {
      setErreur(error.message ?? 'Erreur de paiement.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-background border border-border p-4">
        <PaymentElement />
      </div>
      {erreur && <p className="text-red-500 text-xs font-medium font-sans">{erreur}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-background py-4 tracking-[0.3em] text-[10px] uppercase font-bold hover:bg-accent transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? 'Traitement en cours...' : 'Confirmer et Payer par carte'}
      </button>
    </form>
  );
}

// Composant principal avec choix Stripe / PayPal
export default function PaiementForm({ commandeId, montant }: {
  commandeId: number;
  montant: number;
}) {
  const [clientSecret, setClientSecret] = useState('');
  const [methode, setMethode] = useState<'stripe' | 'paypal'>('stripe');
  const [loadingStripe, setLoadingStripe] = useState(false);

  // Initialiser Stripe : récupère le client_secret
  const initStripe = async () => {
    setLoadingStripe(true);
    try {
      const res = await api.post('/paiements/stripe/intent', { commande_id: commandeId });
      setClientSecret(res.data.client_secret);
    } catch (e) {
      console.error('Error initializing Stripe intent', e);
    } finally {
      setLoadingStripe(false);
    }
  };

  // Charger Stripe automatiquement si sélectionné et non initialisé
  useEffect(() => {
    if (methode === 'stripe' && !clientSecret) {
      initStripe();
    }
  }, [methode, clientSecret]);

  return (
    <div className="space-y-8 bg-card border border-border p-6 md:p-8">
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-accent font-semibold mb-2">Méthode de paiement</h3>
        <p className="text-[10px] text-accent font-light">Veuillez sélectionner votre mode de règlement sécurisé.</p>
      </div>

      {/* Sélecteur de méthode */}
      <div className="flex gap-4">
        <button
          onClick={() => setMethode('stripe')}
          className={`flex-1 border py-3 text-[10px] tracking-widest uppercase transition-all duration-300 ${
            methode === 'stripe'
              ? 'border-primary bg-primary text-background font-bold'
              : 'border-border bg-card text-foreground hover:border-accent'
          }`}
        >
          Carte bancaire
        </button>
        <button
          onClick={() => setMethode('paypal')}
          className={`flex-1 border py-3 text-[10px] tracking-widest uppercase transition-all duration-300 ${
            methode === 'paypal'
              ? 'border-primary bg-primary text-background font-bold'
              : 'border-border bg-card text-foreground hover:border-accent'
          }`}
        >
          PayPal / GPay
        </button>
      </div>

      {/* Stripe Elements */}
      {methode === 'stripe' && (
        <div className="space-y-4">
          {loadingStripe ? (
            <div className="text-center py-8">
              <span className="text-xs text-accent uppercase tracking-widest animate-pulse">Initialisation de la passerelle Stripe...</span>
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeForm commandeId={commandeId} />
            </Elements>
          ) : (
            <div className="text-center py-8 text-red-500 text-xs">
              Impossible d'initialiser le paiement Stripe. Veuillez vérifier votre connexion.
            </div>
          )}
        </div>
      )}

      {/* PayPal Buttons */}
      {methode === 'paypal' && (
        <div className="bg-background border border-border p-4">
          <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: 'CAD',
          }}>
            <PayPalButtons
              createOrder={async () => {
                const res = await api.post('/paiements/paypal/create', { commande_id: commandeId });
                return res.data.paypal_order_id;
              }}
              onApprove={async (data) => {
                await api.post(`/paiements/paypal/capture/${data.orderID}`);
                window.location.href = `/commandes/${commandeId}/confirmation`;
              }}
              onError={(err) => console.error('PayPal error', err)}
              style={{ layout: 'vertical', color: 'black', shape: 'rect' }}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
}