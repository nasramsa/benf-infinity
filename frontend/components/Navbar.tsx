'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { usePanier } from '@/store/panierStore';
import api from '@/lib/api';

export default function Navbar() {
  const articles = usePanier((s) => s.articles);
  const nombreArticles = articles.reduce((sum, a) => sum + a.quantite, 0);
  const [clientName, setClientName] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchClientInfo = () => {
    const token = localStorage.getItem('token');
    const clientData = localStorage.getItem('client');
    if (token && clientData) {
      try {
        const client = JSON.parse(clientData);
        setClientName(`${client.prenom}`);
      } catch (e) {
        setClientName('Compte');
      }
    } else {
      setClientName(null);
    }
  };

  useEffect(() => {
    fetchClientInfo();

    const handleAuthChange = () => {
      fetchClientInfo();
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo-benf.jpg" 
              alt="BENF∞INFINITY" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <span className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase font-light">
              BENF<span className="font-semibold text-accent">∞</span>INFINITY
            </span>
          </Link>

          {/* Navigation centrale - Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/boutique"
              className="text-[10px] tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
            >
              Boutique
            </Link>
            <Link
              href="/a-propos"
              className="text-[10px] tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="text-[10px] tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-5">
            {clientName ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-[10px] tracking-widest uppercase text-accent font-medium">
                  Bonjour, {clientName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-foreground hover:text-accent transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/commander"
                className="hidden md:flex text-foreground hover:text-accent transition-colors items-center gap-1"
                title="Se connecter / Compte"
              >
                <User size={18} />
              </Link>
            )}

            <Link href="/panier" className="relative text-foreground hover:text-accent transition-colors">
              <ShoppingBag size={18} />
              {nombreArticles > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {nombreArticles}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground hover:text-accent transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <Link
              href="/boutique"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
            >
              Boutique
            </Link>
            <Link
              href="/a-propos"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
            >
              Contact
            </Link>
            <div className="w-12 h-[1px] bg-accent my-4" />
            {clientName ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="text-sm tracking-[0.3em] uppercase text-accent hover:text-foreground transition-colors"
              >
                Se déconnecter
              </button>
            ) : (
              <Link
                href="/commander"
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.3em] uppercase hover:text-accent transition-colors font-medium"
              >
                Mon compte
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}