'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Tag,
  Copy,
  Check,
  Zap,
  Percent,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export default function AuraDealsPage() {
  const defaultDeals = [
    {
      id: 4,
      title: 'AURA 420GSM Tech Fleece Hoodie',
      category: 'Hoodies',
      price: 2199,
      mrp: 2899,
      badge: 'DROP DEAL • 24% OFF',
      description:
        'Heavyweight brushed interior with double-layered hood and articulated seams.',
      image_url:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 7,
      title: 'AURA Runner Low-Top Sneakers',
      category: 'Footwear',
      price: 2699,
      mrp: 3499,
      badge: 'FOOTWEAR OFFER • 23% OFF',
      description:
        'High-rebound midsole sneakers with breathable mesh and grip outsole.',
      image_url:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 1,
      title: 'AURA 260GSM Core Boxy Tee',
      category: 'Tshirts',
      price: 1299,
      mrp: 1799,
      badge: 'ESSENTIAL STEAL • 28% OFF',
      description:
        'Heavyweight 260 GSM technical combed cotton with structured drop-shoulder fit.',
      image_url:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'AURA Chrono & Optics Kit',
      category: 'Accessories',
      price: 2499,
      mrp: 3299,
      badge: 'BUNDLE SAVE • ₹800 OFF',
      description:
        'Monochrome steel timepiece paired with UV400 tinted technical eyewear.',
      image_url:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [coupons, setCoupons] = useState<any[]>([
    {
      code: 'FLOWIX10',
      label: '10% Instant Off on Entire Bag',
      desc: 'Valid on all AURA technical apparel, footwear & accessories.',
    },
    {
      code: 'WELCOME200',
      label: 'Flat ₹200 Off First Order',
      desc: 'Applicable on orders above ₹1,299 at checkout.',
    },
  ]);

  const [dealProducts, setDealProducts] = useState<any[]>(defaultDeals);
  const [copiedCode, setCopiedCode] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  useEffect(() => {
    const savedCoupons = localStorage.getItem('flowix_coupons');
    if (savedCoupons) {
      try {
        const parsed = JSON.parse(savedCoupons);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoupons(
            parsed.map((c: any) => ({
              code: c.code,
              label:
                c.type === 'percent'
                  ? `${c.value}% Instant Discount`
                  : `Flat ₹${c.value} Instant Discount`,
              desc: 'Apply this code in your AURA bag or checkout summary.',
            }))
          );
        }
      } catch {}
    }

    async function loadDealItems() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (data && data.length > 0) {
          const mapped = data.map((raw: any) => {
            if (typeof raw.title === 'string' && raw.title.includes('||')) {
              const parts = raw.title.split('||');
              const price = Number(raw.price) || 1499;
              const mrp = Number(parts[1]) || Math.round(price * 1.3);
              const pct =
                mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 20;
              return {
                ...raw,
                title: parts[0].trim(),
                mrp,
                badge: `LIMITED OFFER • ${pct}% OFF`,
                description: parts[3]
                  ? parts[3].trim()
                  : 'AURA technical release with instant deal pricing.',
              };
            }
            const price = Number(raw.price) || 1499;
            const mrp = raw.mrp || Math.round(price * 1.3);
            const pct =
              mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 20;
            return {
              ...raw,
              mrp,
              badge: `LIMITED OFFER • ${pct}% OFF`,
              description:
                raw.description ||
                'AURA technical release with instant deal pricing.',
            };
          });
          setDealProducts(mapped);
        }
      } catch {}
    }

    loadDealItems();
  }, []);

  function copyCoupon(code: string) {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Copied promo code: ${code}`);
    setTimeout(() => setCopiedCode(''), 2500);
  }

  function addDealToBag(item: any) {
    try {
      const existing = JSON.parse(localStorage.getItem('aura_cart') || '[]');
      const nextCart = [
        ...(Array.isArray(existing) ? existing : []),
        {
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          selectedSize:
            (item.category || '').toLowerCase() === 'footwear'
              ? 'UK 9'
              : (item.category || '').toLowerCase() === 'accessories'
              ? 'One Size'
              : 'L',
          selectedColor: 'Carbon Black',
          qty: 1,
          image_url: item.image_url,
        },
      ];
      localStorage.setItem('aura_cart', JSON.stringify(nextCart));
    } catch {}
    showToast(`${item.title} added to AURA bag!`);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                AURA // PRIVILEGE & DROPS
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Active Deals & Promo Codes
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="/cart"
              className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-emerald-500"
            >
              Bag
            </a>
            <a
              href="/checkout"
              className="px-3.5 py-2 bg-emerald-500 text-black font-bold uppercase tracking-wider"
            >
              Checkout
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* PROMO VOUCHERS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
            <Tag className="w-3.5 h-3.5" />
            <span>VERIFIED VOUCHERS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-white">
            Active Promo Codes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((cp) => (
              <div
                key={cp.code}
                className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-emerald-400">
                    <Percent className="w-3.5 h-3.5" />
                    <span>INSTANT CHECKOUT CODE</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{cp.label}</h3>
                  <p className="text-xs text-zinc-400">{cp.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => copyCoupon(cp.code)}
                  className="px-4 py-2.5 bg-zinc-950 border border-dashed border-emerald-500 text-emerald-400 font-mono text-xs font-black tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition shrink-0"
                >
                  {copiedCode === cp.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{cp.code}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MARKDOWN DEALS GRID */}
        <section className="space-y-6">
          <div className="border-b border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>LIMITED ALLOCATION</span>
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-white mt-1">
                Markdown Gear & Bundles
              </h2>
            </div>
            <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Free Express Dispatch above ₹1,999
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((item) => {
              const savedAmt =
                item.mrp && item.mrp > item.price ? item.mrp - item.price : 0;

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 flex flex-col justify-between overflow-hidden transition"
                >
                  <div>
                    <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-500 text-black font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                        {item.badge}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-sm text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-1 font-mono flex items-baseline gap-2">
                        <span className="text-base font-bold text-white">
                          ₹{item.price}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-xs text-zinc-500 line-through">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>
                      {savedAmt > 0 && (
                        <p className="font-mono text-[10px] text-emerald-400">
                          You save ₹{savedAmt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => addDealToBag(item)}
                      className="w-full py-2.5 bg-emerald-500 text-black text-xs font-mono font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Claim Deal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
