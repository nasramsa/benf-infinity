// components/PaiementForm.tsx
'use client';

import { useState } from 'react';
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 tracking-widest text-sm uppercase hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Traitement...' : 'Payer par carte'}
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

  // Initialiser Stripe : récupère le client_secret
  const initStripe = async () => {
    const res = await api.post('/paiements/stripe/intent', { commande_id: commandeId });
    setClientSecret(res.data.client_secret);
    setMethode('stripe');
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de méthode */}
      <div className="flex gap-3">
        <button
          onClick={initStripe}
          className={`flex-1 border py-2 text-sm ${methode === 'stripe' ? 'border-black' : 'border-gray-200'}`}
        >
          Carte / Apple Pay / Google Pay
        </button>
        <button
          onClick={() => setMethode('paypal')}
          className={`flex-1 border py-2 text-sm ${methode === 'paypal' ? 'border-black' : 'border-gray-200'}`}
        >
          PayPal
        </button>
      </div>

      {/* Stripe Elements */}
      {methode === 'stripe' && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeForm commandeId={commandeId} />
        </Elements>
      )}

      {/* PayPal Buttons */}
      {methode === 'paypal' && (
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
      )}
    </div>
  );
}