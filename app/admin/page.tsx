'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Lock,
  Unlock,
  ShieldCheck,
  Package,
  Plus,
  Trash2,
  Check,
  Tag,
  LogOut,
  Users,
} from 'lucide-react';

interface AdminOrderItem {
  id: number;
  title: string;
  price: number;
  qty: number;
  selectedSize?: string;
}

interface AdminOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  pin_code: string;
  payment_method: string;
  items: AdminOrderItem[];
  total: number;
  status: string;
  created_at: string;
}

interface CouponItem {
  code: string;
  type: 'percent' | 'flat';
  value: number;
}

const ADMIN_PASSCODE = 'AURA2026';

export default function AuraAdminConsolePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons'>(
    'orders'
  );
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);

  // New Product Form
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('Men');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMrp, setProdMrp] = useState('');
  const [prodSizes, setProdSizes] = useState('S, M, L, XL');
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'
  );
  const [prodDesc, setProdDesc] = useState(
    'Heavyweight 260 GSM technical apparel engineered for durability and clean fit.'
  );

  // New Coupon Form
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'flat'>('percent');
  const [couponValue, setCouponValue] = useState('15');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function notify(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function loadOrdersData(): AdminOrder[] {
    try {
      const raw = localStorage.getItem('flowix_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  function saveOrdersData(list: AdminOrder[]) {
    try {
      localStorage.setItem('flowix_orders', JSON.stringify(list));
    } catch {}
  }

  function loadCouponsData(): CouponItem[] {
    try {
      const raw = localStorage.getItem('flowix_coupons');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      { code: 'FLOWIX10', type: 'percent', value: 10 },
      { code: 'WELCOME200', type: 'flat', value: 200 },
    ];
  }

  async function fetchProductsData() {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      if (data) setProducts(data);
    } catch {}
  }

  useEffect(() => {
    try {
      const sessionFlag = sessionStorage.getItem('aura_admin_unlocked');
      if (sessionFlag === 'true') {
        setUnlocked(true);
      }
    } catch {}
    setOrders(loadOrdersData());
    setCoupons(loadCouponsData());
    fetchProductsData();
  }, []);

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passInput.trim() === ADMIN_PASSCODE) {
      setUnlocked(true);
      setAuthError('');
      setPassInput('');
      try {
        sessionStorage.setItem('aura_admin_unlocked', 'true');
      } catch {}
      notify('Admin session unlocked.');
    } else {
      setAuthError('Invalid admin passcode. Try again.');
    }
  }

  function handleLockAdmin() {
    setUnlocked(false);
    try {
      sessionStorage.removeItem('aura_admin_unlocked');
    } catch {}
  }

  async function handleOrderStatusChange(orderId: string, nextStatus: string) {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: nextStatus } : o
    );
    setOrders(updated);
    saveOrdersData(updated);

    try {
      await supabase
        .from('orders')
        .update({ status: nextStatus })
        .ilike('address', `%ID: ${orderId}%`);
    } catch {}

    notify(`Order ${orderId} updated to "${nextStatus}".`);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice.trim()) return;

    const cleanPrice = Number(prodPrice) || 1299;
    const cleanMrp = Number(prodMrp) || Math.round(cleanPrice * 1.3);
    const packedTitle = `${prodTitle.trim()}||${cleanMrp}||${prodSizes.trim()}||${prodDesc.trim()}`;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            title: packedTitle,
            category: prodCategory,
            price: cleanPrice,
            image_url: prodImage.trim(),
          },
        ])
        .select();

      if (!error && data && data[0]) {
        setProducts([data[0], ...products]);
      } else {
        setProducts([
          {
            id: Date.now(),
            title: packedTitle,
            category: prodCategory,
            price: cleanPrice,
            image_url: prodImage.trim(),
          },
          ...products,
        ]);
      }
    } catch {
      setProducts([
        {
          id: Date.now(),
          title: packedTitle,
          category: prodCategory,
          price: cleanPrice,
          image_url: prodImage.trim(),
        },
        ...products,
      ]);
    }

    setProdTitle('');
    setProdPrice('');
    setProdMrp('');
    notify('New product published to AURA catalog.');
  }

  async function handleDeleteProduct(id: number) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch {}
    setProducts((prev) => prev.filter((item) => item.id !== id));
    notify('Product removed.');
  }

  function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault();
    const codeClean = couponCode.trim().toUpperCase();
    const valClean = Number(couponValue) || 10;
    if (!codeClean) return;

    const nextList = [
      { code: codeClean, type: couponType, value: valClean },
      ...coupons.filter((c) => c.code !== codeClean),
    ];
    setCoupons(nextList);
    try {
      localStorage.setItem('flowix_coupons', JSON.stringify(nextList));
    } catch {}
    setCouponCode('');
    notify(`Coupon ${codeClean} active for customer checkout.`);
  }

  function handleDeleteCoupon(codeToRemove: string) {
    const nextList = coupons.filter((c) => c.code !== codeToRemove);
    setCoupons(nextList);
    try {
      localStorage.setItem('flowix_coupons', JSON.stringify(nextList));
    } catch {}
    notify(`Coupon ${codeToRemove} removed.`);
  }

  // PASSWORD LOCK SCREEN FOR NON-ADMIN VISITORS
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col justify-between p-4">
        <div className="max-w-5xl w-full mx-auto pt-2 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:border-emerald-500"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Storefront</span>
          </a>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role Separation Active</span>
          </span>
        </div>

        <form
          onSubmit={handleUnlockSubmit}
          className="max-w-md w-full mx-auto bg-zinc-950 border border-zinc-800 p-7 space-y-5 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                AURA // RESTRICTED ACCESS
              </p>
              <h1 className="text-xl font-serif text-white">
                Admin Console Login
              </h1>
            </div>
          </div>

          <p className="text-xs font-mono text-zinc-400 leading-relaxed">
            Customers use the main storefront to browse, order, and track
            shipments. Enter the owner passcode to manage orders, catalog, and
            coupons.
          </p>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400">
              Admin Passcode *
            </label>
            <input
              type="password"
              required
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
            />
            {authError && (
              <p className="text-[11px] text-rose-400 pt-1">{authError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 text-black font-mono text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition flex items-center justify-center gap-2"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>

        <div className="text-center pb-2 font-mono text-[10px] text-zinc-600">
          AURA CLOTH STORE • OWNER WORKSPACE
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => !(o.status || '').toLowerCase().includes('cancel'))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP BAR */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
              title="Back to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AURA // OWNER COMMAND</span>
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Admin Operations Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="/"
              className="px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
            >
              Customer View
            </a>
            <button
              type="button"
              onClick={handleLockAdmin}
              className="px-3.5 py-2 bg-zinc-900 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white uppercase font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* SUMMARY METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">
              Active Net Revenue
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{totalRevenue}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">
              Total Orders Logged
            </p>
            <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">
              Catalog Items
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {products.length}
            </p>
          </div>
        </section>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 uppercase font-bold tracking-wider border ${
              activeTab === 'orders'
                ? 'bg-emerald-500 text-black border-emerald-500'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 uppercase font-bold tracking-wider border ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-black border-emerald-500'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 uppercase font-bold tracking-wider border ${
              activeTab === 'coupons'
                ? 'bg-emerald-500 text-black border-emerald-500'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>

        {/* TAB 1: ORDERS & STATUS SYNC */}
        {activeTab === 'orders' && (
          <section className="space-y-4 font-mono text-xs">
            {orders.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 p-10 text-center text-zinc-400">
                No customer orders placed yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-zinc-900 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm">
                        {ord.id}
                      </span>
                      <span className="text-zinc-400">
                        • {ord.customer_name} ({ord.email})
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      PIN {ord.pin_code} • {ord.payment_method} • Total:{' '}
                      <strong className="text-white">₹{ord.total}</strong>
                    </p>
                    <p className="text-[11px] text-zinc-500">{ord.address}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[10px] uppercase text-zinc-400">
                      Status:
                    </label>
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleOrderStatusChange(ord.id, e.target.value)
                      }
                      className="px-3 py-2 bg-zinc-950 border border-zinc-700 text-emerald-400 font-bold text-xs"
                    >
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Packed & QC">Packed & QC</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* TAB 2: ADD & MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            <form
              onSubmit={handleAddProduct}
              className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-5 space-y-3 h-fit"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                <Plus className="w-4 h-4" />
                <span>Add Store Product</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. AURA Oversized Utility Tee"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Tshirts">Tshirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="1499"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={prodMrp}
                    onChange={(e) => setProdMrp(e.target.value)}
                    placeholder="1999"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Sizes
                  </label>
                  <input
                    type="text"
                    value={prodSizes}
                    onChange={(e) => setProdSizes(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                  Short Spec
                </label>
                <input
                  type="text"
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-400 transition"
              >
                Publish Product
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {products.map((item) => {
                const displayTitle =
                  typeof item.title === 'string' && item.title.includes('||')
                    ? item.title.split('||')[0]
                    : item.title;
                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image_url}
                        alt={displayTitle}
                        className="w-12 h-14 object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">
                          {displayTitle}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {item.category} •{' '}
                          <span className="text-emerald-400 font-bold">
                            ₹{item.price}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(item.id)}
                      className="p-2 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-rose-400"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
            <form
              onSubmit={handleAddCoupon}
              className="md:col-span-5 bg-zinc-900 border border-zinc-800 p-5 space-y-3 h-fit"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                <Tag className="w-4 h-4" />
                <span>Create Promo Code</span>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. AURA25"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Type
                  </label>
                  <select
                    value={couponType}
                    onChange={(e) =>
                      setCouponType(e.target.value as 'percent' | 'flat')
                    }
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 text-black font-black uppercase tracking-wider"
              >
                Save Coupon
              </button>
            </form>

            <div className="md:col-span-7 space-y-3">
              {coupons.map((cp) => (
                <div
                  key={cp.code}
                  className="bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-emerald-400 text-sm">
                      {cp.code}
                    </span>
                    <span className="text-zinc-300 ml-3">
                      {cp.type === 'percent'
                        ? `${cp.value}% OFF`
                        : `₹${cp.value} OFF`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(cp.code)}
                    className="text-zinc-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
