'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Search,
  Heart,
  Star,
  Eye,
  X,
  Plus,
  Minus,
  Check,
  ShoppingBag,
} from 'lucide-react';

export default function AuraShopPage() {
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

  const [products, setProducts] = useState<any[]>(defaultCatalog);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [bagCount, setBagCount] = useState<number>(0);

  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Carbon Black');
  const [modalQty, setModalQty] = useState<number>(1);
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
      const savedCart = JSON.parse(localStorage.getItem('aura_cart') || '[]');
      if (Array.isArray(savedCart)) {
        setBagCount(
          savedCart.reduce((acc: number, i: any) => acc + (i.qty || 1), 0)
        );
      }
      const savedWish = JSON.parse(localStorage.getItem('aura_wishlist') || '[]');
      if (Array.isArray(savedWish)) {
        setWishlist(savedWish);
      }
    } catch {}

    async function loadShopProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (data && data.length > 0) {
          setProducts(data.map(normalizeProduct));
        }
      } catch {}
    }

    loadShopProducts();
  }, []);

  const categories = [
    'All',
    ...Array.from(
      new Set(
        products
          .map((p) => (p.category || '').trim())
          .filter(Boolean)
      )
    ),
  ];

  const filteredProducts = products
    .filter((item) => {
      const matchesCat =
        selectedCategory === 'All' ||
        (item.category || '').toLowerCase() ===
          selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === '' ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'low') return Number(a.price) - Number(b.price);
      if (sortBy === 'high') return Number(b.price) - Number(a.price);
      return 0;
    });

  function openProductModal(item: any) {
    setActiveProduct(item);
    setSelectedSize(item.sizes?.[0] || 'M');
    setSelectedColor('Carbon Black');
    setModalQty(1);
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('aura_wishlist', JSON.stringify(next));
      } catch {}
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return next;
    });
  }

  function addItemToBag(
    item: any,
    size = 'M',
    color = 'Carbon Black',
    qty = 1
  ) {
    try {
      const existing = JSON.parse(localStorage.getItem('aura_cart') || '[]');
      const nextCart = [
        ...(Array.isArray(existing) ? existing : []),
        {
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          selectedSize: size,
          selectedColor: color,
          qty,
          image_url: item.image_url,
        },
      ];
      localStorage.setItem('aura_cart', JSON.stringify(nextCart));
      setBagCount(
        nextCart.reduce((acc: number, i: any) => acc + (i.qty || 1), 0)
      );
    } catch {}
    setActiveProduct(null);
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
                AURA // FULL STOREFRONT
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Shop All Gear
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="/wishlist"
              className="px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
            >
              Saved ({wishlist.length})
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
        {/* SEARCH & FILTER BAR */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-9 flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3.5 py-2.5">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tees, hoodies, sneakers, coats, accessories..."
                className="w-full bg-transparent text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-mono border border-zinc-800 bg-zinc-950 text-zinc-200 focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border bg-emerald-500 text-black border-emerald-500'
                    : 'px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider border bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const discountPct =
              item.mrp && item.mrp > item.price
                ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                : 0;
            const isWishlisted = wishlist.includes(item.id);

            return (
              <div
                key={item.id}
                className="group bg-zinc-900/90 border border-zinc-800 hover:border-zinc-600 flex flex-col justify-between overflow-hidden transition"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      onClick={() => openProductModal(item)}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 cursor-pointer group-hover:scale-105 transition duration-500"
                    />

                    {discountPct > 0 && (
                      <span className="absolute top-3 left-3 bg-emerald-500 text-black font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                        -{discountPct}%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/90 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-rose-500"
                    >
                      <Heart
                        className={
                          isWishlisted
                            ? 'w-4 h-4 fill-rose-500 text-rose-500'
                            : 'w-4 h-4'
                        }
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => openProductModal(item)}
                      className="absolute bottom-3 inset-x-3 py-2 bg-zinc-950/95 border border-zinc-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-emerald-500 hover:text-black transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick Inspect</span>
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

                    <h2
                      onClick={() => openProductModal(item)}
                      className="font-semibold text-base text-white cursor-pointer hover:underline line-clamp-1"
                    >
                      {item.title}
                    </h2>

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
                    onClick={() =>
                      addItemToBag(
                        item,
                        item.sizes?.[0] || 'M',
                        'Carbon Black',
                        1
                      )
                    }
                    className="flex-1 py-2.5 bg-emerald-500 text-black text-xs font-mono font-black uppercase tracking-widest hover:bg-emerald-400 transition"
                  >
                    Add to Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => openProductModal(item)}
                    className="px-3 py-2.5 border border-zinc-700 bg-zinc-950 font-mono text-xs text-zinc-200 hover:border-zinc-500"
                  >
                    Specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* QUICK INSPECT MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl grid grid-cols-1 md:grid-cols-2 relative">
            <button
              type="button"
              onClick={() => setActiveProduct(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-zinc-900 aspect-square md:aspect-auto">
              <img
                src={activeProduct.image_url}
                alt={activeProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  {activeProduct.category}
                </span>
                <h3 className="text-xl font-serif text-white">
                  {activeProduct.title}
                </h3>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-xl font-bold text-white">
                    ₹{activeProduct.price}
                  </span>
                  {activeProduct.mrp && (
                    <span className="text-xs text-zinc-500 line-through">
                      ₹{activeProduct.mrp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {activeProduct.description}
                </p>

                <div className="pt-2">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(activeProduct.sizes || ['S', 'M', 'L', 'XL']).map(
                      (sz: string) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={
                            selectedSize === sz
                              ? 'px-3 py-1.5 text-xs font-mono font-bold border bg-emerald-500 text-black border-emerald-500'
                              : 'px-3 py-1.5 text-xs font-mono border bg-zinc-900 text-zinc-300 border-zinc-700'
                          }
                        >
                          {sz}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Finish Shade
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Carbon Black', 'Graphite Grey', 'Stealth Olive'].map(
                      (clr) => (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => setSelectedColor(clr)}
                          className={
                            selectedColor === clr
                              ? 'px-2.5 py-1 text-xs font-mono border bg-emerald-500 text-black border-emerald-500 font-bold'
                              : 'px-2.5 py-1 text-xs font-mono border bg-zinc-900 text-zinc-300 border-zinc-700'
                          }
                        >
                          {clr}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Quantity
                  </label>
                  <div className="inline-flex items-center border border-zinc-700 bg-zinc-900">
                    <button
                      type="button"
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                      className="p-2 text-zinc-300 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 font-mono text-xs font-bold text-white">
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalQty(modalQty + 1)}
                      className="p-2 text-zinc-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  addItemToBag(
                    activeProduct,
                    selectedSize,
                    selectedColor,
                    modalQty
                  )
                }
                className="w-full py-3 bg-emerald-500 text-black text-xs font-mono font-black uppercase tracking-widest hover:bg-emerald-400 transition"
              >
                Add to Bag • ₹{activeProduct.price * modalQty}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
