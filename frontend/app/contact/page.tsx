'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Instagram } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler l'envoi du message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-32 min-h-screen">
      
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.5em] uppercase text-accent font-semibold mb-4">Contact</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-[0.2em] uppercase text-foreground">
          Nous contacter
        </h1>
        <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Infos de contact gauche */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black text-white p-8 space-y-8">
            <div>
              <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold mb-4 text-white/80">
                Service client
              </h2>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Notre équipe est à votre écoute pour toute question concernant nos pièces, le suivi de votre commande ou notre charte éthique.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-center text-xs text-white/50">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] tracking-wider uppercase font-semibold text-white/70">Email</p>
                  <p className="font-light mt-0.5">contact@benf-infinity.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-center text-xs text-white/50">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <Instagram size={16} />
                </div>
                <div>
                  <p className="text-[10px] tracking-wider uppercase font-semibold text-white/70">Instagram</p>
                  <p className="font-light mt-0.5">@benfinfinity</p>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10 my-6" />

            <div className="text-[10px] text-white/40 leading-relaxed font-light">
              <p className="font-semibold text-white/60 uppercase tracking-wider mb-2">Horaires de réponse</p>
              <p>Du lundi au vendredi : 9h00 — 18h00</p>
              <p>Samedi & dimanche : Fermé</p>
            </div>
          </div>
        </div>

        {/* Formulaire de contact droite */}
        <div className="lg:col-span-7 border border-border bg-white p-6 md:p-8">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-8 pb-4 border-b border-border">
            Envoyer un message
          </h2>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 mb-6 flex items-center gap-3 animate-fade-in">
              <Check size={16} className="text-emerald-600" />
              <div className="text-xs">
                <p className="font-semibold">Message envoyé avec succès</p>
                <p className="mt-0.5 text-[11px] opacity-90">
                  Merci, nous reviendrons vers vous sous 24 heures.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Votre nom</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border bg-background p-3 text-xs focus:border-foreground outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-background p-3 text-xs focus:border-foreground outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] tracking-widest uppercase text-accent font-semibold block mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-border bg-background p-3 text-xs focus:border-foreground outline-none resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 tracking-[0.3em] text-[10px] uppercase font-bold hover:bg-accent transition-colors duration-500 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              <Send size={12} />
              {loading ? 'Envoi en cours...' : 'Transmettre le message'}
            </button>
          </form>
        </div>

      </div>

    </main>
  );
}
