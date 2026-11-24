'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  ArrowLeft,
  Heart,
  Star,
  Eye,
  X,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

export default function AccessoriesCollectionPage() {
  const defaultAccessories = [
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
      id: 8,
      title: 'AURA Tactical Everyday Carry Pack',
      category: 'Accessories',
      price: 1899,
      mrp: 2499,
      rating: 4.8,
      reviews: 77,
      sizes: ['One Size'],
      description:
        'Water-repellent structured everyday accessory pack with quick-access compartments.',
      image_url:
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 10,
      title: 'AURA Matte Alloy Eyewear',
      category: 'Accessories',
      price: 1499,
      mrp: 1999,
      rating: 4.8,
      reviews: 54,
      sizes: ['One Size'],
      description:
        'Ultra-lightweight matte frame with polarized anti-glare lenses.',
      image_url:
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [products, setProducts] = useState<any[]>(defaultAccessories);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState('One Size');
  const [selectedColor, setSelectedColor] = useState('Carbon Black');
  const [modalQty, setModalQty] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  function normalizeProduct(raw: any) {
    let desc =
      raw.description ||
      'AURA precision hardware and everyday carry accessory.';
    let mrp = raw.mrp || Math.round(Number(raw.price || 999) * 1.3);
    let sizes = raw.sizes || ['One Size'];

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
        reviews: 59,
      };
    }

    return {
      ...raw,
      mrp,
      sizes,
      description: desc,
      rating: raw.rating || 4.8,
      reviews: raw.reviews || 59,
    };
  }

  useEffect(() => {
    async function loadAccessories() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (data && data.length > 0) {
          const normalized = data
            .map(normalizeProduct)
            .filter(
              (item: any) =>
                (item.category || '').toLowerCase() === 'accessories'
            );
          if (normalized.length > 0) {
            setProducts(normalized);
            return;
          }
        }
      } catch {}
      setProducts(defaultAccessories);
    }
    loadAccessories();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'low') return Number(a.price) - Number(b.price);
    if (sortBy === 'high') return Number(b.price) - Number(a.price);
    return 0;
  });

  function openProductModal(item: any) {
    setActiveProduct(item);
    setSelectedSize(item.sizes?.[0] || 'One Size');
    setSelectedColor('Carbon Black');
    setModalQty(1);
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }

  function addItemToBag(
    item: any,
    size = 'One Size',
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
    } catch {}
    setActiveProduct(null);
    showToast(`${item.title} added to bag.`);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                COLLECTION // 03
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Accessories & Optics Gear
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="/collections/men"
              className="hidden sm:inline-block px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
            >
              Men
            </a>
            <a
              href="/collections/women"
              className="hidden sm:inline-block px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
            >
              Women
            </a>
            <a
              href="/cart"
              className="px-3.5 py-2 bg-emerald-500 text-black font-bold uppercase tracking-wider"
            >
              Bag
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              CHRONOGRAPHS, EYEWEAR & CARRY
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-white mt-1">
              Accessories ({sortedProducts.length})
            </h2>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-200 focus:outline-none w-fit"
          >
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((item) => {
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
                    <h3
                      onClick={() => openProductModal(item)}
                      className="font-semibold text-base text-white cursor-pointer hover:underline line-clamp-1"
                    >
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
                    onClick={() =>
                      addItemToBag(
                        item,
                        item.sizes?.[0] || 'One Size',
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
                    {(activeProduct.sizes || ['One Size']).map((sz: string) => (
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
                    ))}
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
