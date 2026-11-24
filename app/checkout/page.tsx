'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Check,
  MapPin,
  Truck,
  Calendar,
  Tag,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AuraCheckoutPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash on Delivery (COD)');

  const [selectedItemTitle, setSelectedItemTitle] = useState(
    'AURA Runner Low-Top Sneakers'
  );
  const [selectedSize, setSelectedSize] = useState('UK 9');
  const [itemPrice, setItemPrice] = useState(2699);
  const [qty, setQty] = useState(1);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([
    { code: 'FLOWIX10', type: 'percent', value: 10 },
    { code: 'WELCOME200', type: 'flat', value: 200 },
  ]);

  const [ordering, setOrdering] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [orderPlacedScreen, setOrderPlacedScreen] = useState<{
    orderId: string;
    pin: string;
    orderedAt: string;
    shipBy: string;
    estimatedDelivery: string;
    total: number;
    payment: string;
  } | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  }

  useEffect(() => {
    const savedCoupons = localStorage.getItem('flowix_coupons');
    if (savedCoupons) {
      try {
        setAvailableCoupons(JSON.parse(savedCoupons));
      } catch {}
    }
  }, []);

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
    const shipDays = 1;
    const deliveryDays = startsWithMetro ? 4 : 5;

    const shipDate = new Date(now);
    shipDate.setDate(now.getDate() + shipDays);

    const estDelivery = new Date(now);
    estDelivery.setDate(now.getDate() + deliveryDays);

    return {
      orderedAt: `${formatDateShort(now)} (${now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })})`,
      shipBy: `${formatDateShort(shipDate)} (Within 24–48 hrs)`,
      estimatedDelivery: `${formatDateShort(estDelivery)} (${deliveryDays} days)`,
    };
  }

  const subtotal = Number(itemPrice || 0) * Math.max(1, qty);
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

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPin = pinCode.trim();
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !shippingAddress.trim() ||
      !/^\d{6}$/.test(cleanPin)
    ) {
      showToast('Please enter Name, Email, valid 6-digit PIN, and Address.');
      return;
    }

    setOrdering(true);
    const schedule = getDeliverySchedule(cleanPin);
    const generatedOrderId = 'FLX-' + Math.floor(100000 + Math.random() * 900000);

    const couponNote = appliedCoupon
      ? ` | Coupon: ${appliedCoupon.code} (-${appliedCoupon.discount})`
      : '';

    const itemsSummary =
      `${selectedItemTitle} [Size: ${selectedSize}, Qty: ${qty}]` +
      couponNote +
      ` | OrderID: ${generatedOrderId}` +
      ` | Ordered: ${schedule.orderedAt}` +
      ` | ShipBy: ${schedule.shipBy}` +
      ` | EstDelivery: ${schedule.estimatedDelivery}` +
      ` | Deliver To: ${customerName} (${customerPhone}) - ${shippingAddress}` +
      ` [PIN: ${cleanPin}] [${paymentMode}]`;

    const { error } = await supabase.from('customer_orders').insert([
      {
        customer_email: customerEmail.trim(),
        items: itemsSummary,
        total_amount: grandTotal,
        order_status: 'Order Placed • Packing',
      },
    ]);

    setOrdering(false);
    if (error) {
      showToast('Order warning: ' + error.message);
    }

    setOrderPlacedScreen({
      orderId: generatedOrderId,
      pin: cleanPin,
      orderedAt: schedule.orderedAt,
      shipBy: schedule.shipBy,
      estimatedDelivery: schedule.estimatedDelivery,
      total: grandTotal,
      payment: paymentMode,
    });
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0.3) rotate(-18deg); opacity: 0; }
          70% { transform: scale(1.12) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .check-pop-anim {
          animation: checkPop 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {orderPlacedScreen && (
        <div className="fixed inset-0 z-[90] bg-emerald-600 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg w-full flex flex-col items-center space-y-5">
            <div className="w-24 h-24 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-2xl check-pop-anim">
              <Check className="w-14 h-14 stroke-[3.5]" />
            </div>

            <div className="space-y-1">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-100">
                ORDER ID: {orderPlacedScreen.orderId}
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[0.14em] uppercase">
                ORDER PLACED
              </h2>
            </div>

            <div className="w-full bg-emerald-950/65 border border-emerald-300/30 p-4 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between gap-2">
                <span className="text-emerald-200">PIN CODE:</span>
                <span className="font-bold">{orderPlacedScreen.pin}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-emerald-200">ORDERED AT:</span>
                <span className="font-bold">{orderPlacedScreen.orderedAt}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-emerald-200">DISPATCH / SHIP:</span>
                <span className="font-bold">{orderPlacedScreen.shipBy}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-emerald-200">EST. DELIVERY:</span>
                <span className="font-bold text-emerald-300">
                  {orderPlacedScreen.estimatedDelivery}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-emerald-700/70 pt-2">
                <span className="text-emerald-200">TOTAL:</span>
                <span className="font-bold">
                  ₹{orderPlacedScreen.total} ({orderPlacedScreen.payment})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="/orders"
                className="px-6 py-3 bg-white text-emerald-700 text-xs font-bold uppercase tracking-widest"
              >
                Track in My Orders →
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest"
              >
                Back to AURA
              </a>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
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
                AURA EXPRESS CHECKOUT
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Complete Your Order
              </h1>
            </div>
          </div>

          <a
            href="/orders"
            className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 font-mono text-xs text-emerald-400 hover:border-emerald-500"
          >
            My Orders
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleCheckoutSubmit}
          className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Customer & PIN Dispatch Details</span>
          </div>

          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Full Name *"
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email Address *"
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
            />
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone Number *"
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
              maxLength={6}
              inputMode="numeric"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6-Digit PIN *"
              className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-emerald-400 font-bold"
            />
            <input
              type="text"
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Full Street / Landmark / City *"
              className="sm:col-span-2 w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3.5 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>PIN: {pinCode || 'Enter 6-digit PIN'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ships: {liveSchedule.shipBy}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Estimated Delivery: {liveSchedule.estimatedDelivery}</span>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-white"
            >
              <option value="Cash on Delivery (COD)">
                Cash on Delivery (COD)
              </option>
              <option value="UPI / Online Payment">
                UPI / Online Payment (Instant)
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={ordering}
            className="w-full py-3.5 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest hover:bg-emerald-400 transition"
          >
            {ordering ? 'PLACING ORDER...' : 'PLACE ORDER'}
          </button>
        </form>

        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 space-y-4 text-xs h-fit">
          <h2 className="font-serif text-lg text-white border-b border-zinc-800 pb-3">
            Order Summary
          </h2>

          <div className="space-y-2.5">
            <label className="block font-mono text-[10px] uppercase text-zinc-400">
              Selected Item
            </label>
            <input
              type="text"
              value={selectedItemTitle}
              onChange={(e) => setSelectedItemTitle(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
            />
            <div className="grid grid-cols-3 gap-2 font-mono">
              <input
                type="text"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                placeholder="Size"
                className="px-2.5 py-2 bg-zinc-950 border border-zinc-700 text-white"
              />
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
                placeholder="Price"
                className="px-2.5 py-2 bg-zinc-950 border border-zinc-700 text-white"
              />
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                placeholder="Qty"
                className="px-2.5 py-2 bg-zinc-950 border border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-2 font-mono">
            <label className="flex items-center gap-1 text-[10px] uppercase text-zinc-400">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Coupon Code (FLOWIX10 / WELCOME200)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="CODE"
                className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-white uppercase"
              />
              <button
                type="button"
                onClick={applyCouponCode}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-emerald-500 hover:text-black text-white font-bold uppercase"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-3 space-y-1.5 font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
              <span>Total Payable</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted order log synced with AURA Dispatch.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
