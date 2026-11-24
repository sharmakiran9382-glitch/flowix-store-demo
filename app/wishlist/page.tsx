'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Heart,
  Trash2,
  ShoppingBag,
  Star,
  Check,
  Sparkles,
} from 'lucide-react';

export default function AuraWishlistPage() {
  const defaultCatalog = [
    {
      id: 1,
      title: 'AURA 260GSM Core Boxy Tee',
      category: 'Tshirts',
      price: 1299,
      mrp: 1799,
      rating: 4.8,
      reviews: 124,
      sizes: ['S', 'M', 'L', 'XL'],
      description:
        'Heavyweight 260 GSM technical combed cotton with structured drop-shoulder fit.',
      image_url:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'AURA Storm-Flap Overcoat',
      category: 'Women',
      price: 3899,
      mrp: 4999,
      rating: 4.9,
      reviews: 89,
      sizes: ['XS', 'S', 'M', 'L'],
      description:
        'Structured architectural coat with matte hardware and wind-resistant weave.',
      image_url:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'AURA Chrono & Optics Kit',
      category: 'Accessories',
      price: 2499,
      mrp: 3299,
      rating: 4.7,
      reviews: 64,
      sizes: ['One Size'],
      description:
        'Monochrome steel timepiece paired with UV400 tinted technical eyewear.',
      image_url:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'AURA 420GSM Tech Fleece Hoodie',
      category: 'Hoodies',
      price: 2199,
      mrp: 2899,
      rating: 4.9,
      reviews: 210,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description:
        'Dense brushed interior with double-layered hood and articulated seams.',
      image_url:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: 'AURA Selvedge Utility Jacket',
      category: 'Men',
      price: 2799,
      mrp: 3599,
      rating: 4.8,
      reviews: 95,
      sizes: ['M', 'L', 'XL'],
      description:
        '13oz washed technical jacket with tactical chest pockets and dark alloy hardware.',
      image_url:
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 7,
      title: 'AURA Runner Low-Top Sneakers',
      category: 'Footwear',
      price: 2699,
      mrp: 3499,
      rating: 4.9,
      reviews: 178,
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
      description:
        'High-rebound midsole sneakers with breathable mesh and grip outsole.',
      image_url:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [allProducts, setAllProducts] = useState<any[]>(defaultCatalog);
  const [wishlistIds, setWishlistIds] = useState<number[]>([7, 4]);
  const [bagCount, setBagCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string>('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  function normalizeProduct(raw: any) {
    let desc =
      raw.description ||
      'AURA technical grade release engineered for precision fit and durability.';
    let mrp = raw.mrp || Math.round(Number(raw.price || 999) * 1.3);
    let sizes = raw.sizes || ['S', 'M', 'L', 'XL'];

    if (typeof raw.title === 'string' && raw.title.includes('||')) {
      const parts = raw.title.split('||');
      return {
        ...raw,
        title: parts[0].trim(),
        mrp: Number(parts[1]) || mrp,
        sizes: parts[2]
          ? parts[2].split(',').map((s: string) => s.trim())
          : sizes,
        description: parts[3] ? parts[3].trim() : desc,
        rating: 4.8,
        reviews: 76,
      };
    }

    return {
      ...raw,
      mrp,
      sizes,
      description: desc,
      rating: raw.rating || 4.8,
      reviews: raw.reviews || 76,
    };
  }

  useEffect(() => {
    try {
      const savedWish = localStorage.getItem('aura_wishlist');
      if (savedWish) {
        const parsed = JSON.parse(savedWish);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }

      const savedCart = JSON.parse(localStorage.getItem('aura_cart') || '[]');
      if (Array.isArray(savedCart)) {
        setBagCount(
          savedCart.reduce((acc: number, i: any) => acc + (i.qty || 1), 0)
        );
      }
    } catch {}

    async function loadProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (data && data.length > 0) {
          setAllProducts(data.map(normalizeProduct));
        }
      } catch {}
    }

    loadProducts();
  }, []);

  const savedProducts = allProducts.filter((item) =>
    wishlistIds.includes(item.id)
  );

  function removeFromWishlist(id: number) {
    const updated = wishlistIds.filter((x) => x !== id);
    setWishlistIds(updated);
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(updated));
    } catch {}
    showToast('Removed from Saved Archive.');
  }

  function moveToBag(item: any) {
    try {
      const existing = JSON.parse(localStorage.getItem('aura_cart') || '[]');
      const nextCart = [
        ...(Array.isArray(existing) ? existing : []),
        {
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          selectedSize: item.sizes?.[0] || 'M',
          selectedColor: 'Carbon Black',
          qty: 1,
          image_url: item.image_url,
        },
      ];
      localStorage.setItem('aura_cart', JSON.stringify(nextCart));
      setBagCount(
        nextCart.reduce((acc: number, i: any) => acc + (i.qty || 1), 0)
      );
    } catch {}
    showToast(`${item.title} moved to AURA bag!`);
  }

  function moveAllToBag() {
    if (savedProducts.length === 0) return;
    try {
      const existing = JSON.parse(localStorage.getItem('aura_cart') || '[]');
      const additions = savedProducts.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        price: Number(item.price),
        selectedSize: item.sizes?.[0] || 'M',
        selectedColor: 'Carbon Black',
        qty: 1,
        image_url: item.image_url,
      }));
      const nextCart = [
        ...(Array.isArray(existing) ? existing : []),
        ...additions,
      ];
      localStorage.setItem('aura_cart', JSON.stringify(nextCart));
      setBagCount(
        nextCart.reduce((acc: number, i: any) => acc + (i.qty || 1), 0)
      );
    } catch {}
    showToast(`All ${savedProducts.length} saved items added to bag!`);
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
                AURA // SAVED ARCHIVE
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                My Wishlist ({savedProducts.length})
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="/shop"
              className="px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
            >
              Shop
            </a>
            <a
              href="/cart"
              className="px-3.5 py-2 bg-emerald-500 text-black font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({bagCount})</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {savedProducts.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center space-y-4">
            <Heart className="w-10 h-10 text-zinc-600 mx-auto" />
            <h2 className="text-xl font-serif text-white">
              Your Saved Archive is Empty
            </h2>
            <p className="font-mono text-xs text-zinc-400 max-w-md mx-auto">
              Tap the heart icon on any AURA apparel, footwear, or accessory item to save it here for quick checkout later.
            </p>
            <div className="flex justify-center gap-3 pt-2 font-mono text-xs">
              <a
                href="/shop"
                className="px-6 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest"
              >
                Explore Shop
              </a>
              <button
                type="button"
                onClick={() => {
                  setWishlistIds([7, 4]);
                  localStorage.setItem('aura_wishlist', JSON.stringify([7, 4]));
                }}
                className="px-5 py-3 border border-zinc-700 bg-zinc-950 text-zinc-300 uppercase"
              >
                Restore Sample Picks
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>
                  {savedProducts.length} saved piece(s) ready for express PIN dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={moveAllToBag}
                className="px-4 py-2 bg-zinc-900 border border-emerald-500/60 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition"
              >
                Move All to Bag
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((item) => {
                const discountPct =
                  item.mrp && item.mrp > item.price
                    ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-600 flex flex-col justify-between overflow-hidden transition"
                  >
                    <div>
                      <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500"
                        />

                        {discountPct > 0 && (
                          <span className="absolute top-3 left-3 bg-emerald-500 text-black font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                            -{discountPct}%
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/90 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-rose-400"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                          <span className="uppercase tracking-wider text-emerald-400 font-semibold">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1 text-zinc-300">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {item.rating} ({item.reviews})
                          </span>
                        </div>

                        <h3 className="font-semibold text-base text-white line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-baseline gap-2 pt-1 font-mono">
                          <span className="text-base font-bold text-white">
                            ₹{item.price}
                          </span>
                          {item.mrp && item.mrp > item.price && (
                            <span className="text-xs text-zinc-500 line-through">
                              ₹{item.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        type="button"
                        onClick={() => moveToBag(item)}
                        className="flex-1 py-2.5 bg-emerald-500 text-black text-xs font-mono font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-3 py-2.5 border border-zinc-700 bg-zinc-950 font-mono text-xs text-zinc-300 hover:text-rose-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
