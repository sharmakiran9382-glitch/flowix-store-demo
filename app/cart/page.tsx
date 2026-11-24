'use client';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  MapPin,
  Truck,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CartItem {
  id: number;
  title: string;
  category: string;
  price: number;
  selectedSize: string;
  selectedColor: string;
  qty: number;
  image_url: string;
}

export default function AuraCartPage() {
  const starterCart: CartItem[] = [
    {
      id: 7,
      title: 'AURA Runner Low-Top Sneakers',
      category: 'Footwear',
      price: 2699,
      selectedSize: 'UK 9',
      selectedColor: 'Carbon Black',
      qty: 1,
      image_url:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 1,
      title: 'AURA 260GSM Core Boxy Tee',
      category: 'Tshirts',
      price: 1299,
      selectedSize: 'L',
      selectedColor: 'Carbon Black',
      qty: 1,
      image_url:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [pinCode, setPinCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([
    { code: 'FLOWIX10', type: 'percent', value: 10 },
    { code: 'WELCOME200', type: 'flat', value: 200 },
  ]);
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  useEffect(() => {
    const savedCart = localStorage.getItem('aura_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        } else {
          setCart(starterCart);
        }
      } catch {
        setCart(starterCart);
      }
    } else {
      setCart(starterCart);
    }

    const savedCoupons = localStorage.getItem('flowix_coupons');
    if (savedCoupons) {
      try {
        setAvailableCoupons(JSON.parse(savedCoupons));
      } catch {}
    }
  }, []);

  function syncCart(updated: CartItem[]) {
    setCart(updated);
    localStorage.setItem('aura_cart', JSON.stringify(updated));
  }

  function updateQty(index: number, delta: number) {
    const updated = cart.map((item, idx) =>
      idx === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    syncCart(updated);
  }

  function removeItem(index: number) {
    const updated = cart.filter((_, idx) => idx !== index);
    syncCart(updated);
    showToast('Item removed from bag.');
  }

  function formatDateShort(dateObj: Date) {
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function getDeliverySchedule(currentPin: string) {
    const now = new Date();
    const cleanPin = currentPin.trim();
    const startsWithMetro = /^[145678]/.test(cleanPin);
    const shipDate = new Date(now);
    shipDate.setDate(now.getDate() + 1);

    const deliveryDays = startsWithMetro ? 4 : 5;
    const estDelivery = new Date(now);
    estDelivery.setDate(now.getDate() + deliveryDays);

    return {
      shipBy: `${formatDateShort(shipDate)} (Within 24–48 hrs)`,
      estimatedDelivery: `${formatDateShort(estDelivery)} (${deliveryDays} days)`,
    };
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.qty || 1),
    0
  );
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);
  const liveSchedule = getDeliverySchedule(pinCode);

  function applyCouponCode() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = availableCoupons.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      showToast('Invalid Coupon! Try FLOWIX10 or WELCOME200');
      return;
    }
    const disc =
      found.type === 'percent'
        ? Math.round((subtotal * Number(found.value)) / 100)
        : Number(found.value);
    setAppliedCoupon({ code: found.code, discount: disc });
    showToast(`Coupon ${found.code} applied (-₹${disc})`);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl">
          {toastMsg}
        </div>
      )}

      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                AURA // BAG MODULE
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Shopping Bag ({cart.length})
              </h1>
            </div>
          </div>

          <a
            href="/#shop"
            className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 font-mono text-xs text-zinc-200 hover:border-emerald-500"
          >
            + Add More Gear
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center space-y-4">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
            <h2 className="text-xl font-serif text-white">
              Your AURA bag is empty
            </h2>
            <p className="font-mono text-xs text-zinc-400">
              Browse active technical apparel, footwear, and accessories to add items.
            </p>
            <div className="flex justify-center gap-3 pt-2 font-mono text-xs">
              <a
                href="/#shop"
                className="px-6 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest"
              >
                Explore Catalog
              </a>
              <button
                type="button"
                onClick={() => syncCart(starterCart)}
                className="px-5 py-3 border border-zinc-700 bg-zinc-950 text-zinc-300 uppercase"
              >
                Load Sample Items
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: CART ITEMS LIST */}
            <div className="lg:col-span-7 space-y-3">
              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-20 h-20 object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <span className="font-mono text-[10px] uppercase text-emerald-400">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">
                        {item.title}
                      </h3>
                      <p className="font-mono text-[11px] text-zinc-400">
                        Size: {item.selectedSize} • Shade: {item.selectedColor}
                      </p>
                      <p className="font-mono text-sm font-bold text-white pt-0.5">
                        ₹{Number(item.price) * item.qty}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-zinc-500 hover:text-rose-400 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="inline-flex items-center border border-zinc-700 bg-zinc-950">
                      <button
                        type="button"
                        onClick={() => updateQty(idx, -1)}
                        className="p-1.5 text-zinc-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono text-xs font-bold text-white">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, 1)}
                        className="p-1.5 text-zinc-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: PIN DELIVERY CHECK & ORDER SUMMARY */}
            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 space-y-5 h-fit">
              <h2 className="font-serif text-lg text-white border-b border-zinc-800 pb-3">
                Summary & PIN Estimate
              </h2>

              {/* PIN CODE CHECKER */}
              <div className="bg-zinc-950 border border-zinc-800 p-3.5 space-y-2.5 font-mono text-[11px]">
                <label className="flex items-center gap-1.5 text-[10px] uppercase text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Check PIN Dispatch & Delivery Date</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN (e.g. 713339)"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-emerald-400 font-bold focus:outline-none"
                />
                <div className="space-y-1 text-[10px] pt-1">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dispatch: {liveSchedule.shipBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Est. Delivery: {liveSchedule.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* PROMO CODE */}
              <div className="bg-zinc-950 border border-zinc-800 p-3.5 space-y-2 font-mono text-xs">
                <label className="flex items-center gap-1.5 text-[10px] uppercase text-zinc-400">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Promo Code (FLOWIX10 / WELCOME200)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="ENTER CODE"
                    className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-white uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyCouponCode}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-emerald-500 hover:text-black text-white font-bold uppercase transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* TOTALS */}
              <div className="border-t border-zinc-800 pt-3 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <a
                href="/checkout"
                className="w-full py-3.5 bg-emerald-500 text-black font-mono text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free express shipping unlocked above ₹1,999.</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
