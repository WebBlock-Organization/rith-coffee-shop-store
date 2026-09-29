"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Leaf,
  Star,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Zap,
  ArrowRight,
  Plus,
  Minus,
  Trash2
} from "lucide-react";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  customFields?: {
    imageUrl?: string;
    description?: string;
    badge?: string;
    category?: string;
    features?: string[];
  };
}

const INITIAL_PRODUCTS: ProductItem[] = [];

export default function SingleFileTenantStore() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<{ id: string; title: string; price: number; imageUrl: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Live Database Hydration via Prisma API Route
  useEffect(() => {
    async function loadDbProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const dbProducts = await res.json();
          if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            setProducts(dbProducts.map((p: any) => ({
              id: p.id,
              title: p.title,
              price: Number(p.price || 0),
              customFields: typeof p.customFields === "object" && p.customFields ? p.customFields : {
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                description: "High quality curated product.",
                badge: "Featured",
                features: ["Premium Grade", "Warranty Included"]
              }
            })));
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic products from Prisma database, using initial fallback:", err);
      }
    }
    loadDbProducts();
  }, []);

  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        quantity: 1
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const q = p.quantity + delta;
        return q > 0 ? { ...p, quantity: q } : null;
      }
      return p;
    }).filter(Boolean) as any);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const heroImage = products[0]?.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Announcement Bar */}
      <div className="w-full py-2.5 px-4 text-center text-xs font-semibold text-indigo-200 bg-indigo-950/90 border-b border-indigo-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>⚡ Free worldwide express delivery on orders over $50 • Authenticity Guaranteed</span>
        </div>
      </div>

      {/* Main Tenant Storefront Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/30">
              R
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">Rith coffee shop</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#products" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Collection
            </a>
            <a href="#contact" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Contact
            </a>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-white transition-all cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Split Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>NEW RELEASE 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              The Future of Tech Gear
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              Experience boundary-pushing audio precision, smart ergonomics, and aerospace-grade accessories designed for performance.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden glass-card p-3 shadow-2xl">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
                <img
                  src={heroImage}
                  alt="Hero Banner"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
                48,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
                Happy Customers
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
                100%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
                24/7
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
                Dedicated Support
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
                30-Day
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
                Money Back Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Collection
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Meticulously crafted items from Rith coffee shop
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-indigo-500/40 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={prod.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {prod.customFields?.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                    {prod.customFields.badge}
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  In Stock
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.customFields?.description || "Engineered for unmatched performance and daily reliability."}
                  </p>
                  {Array.isArray(prod.customFields?.features) && prod.customFields.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {prod.customFields.features.slice(0, 3).map((f: string, fi: number) => (
                        <span key={fi} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Price</p>
                    <p className="text-xl font-extrabold text-white">
                      ${Number(prod.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(prod)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us / Features List */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose WebBlock Built Stores
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Every detail engineered for unrivaled satisfaction and speed
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Truck className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Lightning Fast Delivery</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Direct dispatch within 24 hours with end-to-end tracked courier delivery.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">2-Year Full Warranty</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We stand 100% behind our craftsmanship with hassle-free replacements.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Eco-Conscious Packaging</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              100% biodegradable and recyclable packaging materials on all shipments.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Need Assistance? We're Here.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Get in touch with our customer care concierge team anytime.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                  <p className="text-sm font-medium">concierge@auratech.io</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                  <p className="text-sm font-medium">01009988762</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 glass-card p-8 rounded-2xl border border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent directly to Rith coffee shop"); }} className="space-y-4">
              <h3 className="text-xl font-bold text-white">Send Direct Message</h3>
              <input
                type="text"
                required
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <textarea
                rows={3}
                required
                placeholder="How can we help?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">Rith coffee shop</h3>
            <p className="text-xs text-slate-400 mt-1">
              Powered by WebBlock • Multi-Tenant PostgreSQL RLS & Next.js Engine
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <p>© 2026 Rith coffee shop. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">Your Shopping Bag</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-sm font-medium">Your shopping bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-lg object-cover bg-slate-950" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-xs font-semibold text-indigo-400 mt-0.5">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-xl font-extrabold text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutDone(true);
                    setCart([]);
                  }}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-sm shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Checkout Now (${cartTotal.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {checkoutDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-400">
              Thank you for shopping at Rith coffee shop. A confirmation email and tracking link have been dispatched.
            </p>
            <button
              type="button"
              onClick={() => {
                setCheckoutDone(false);
                setIsCartOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
