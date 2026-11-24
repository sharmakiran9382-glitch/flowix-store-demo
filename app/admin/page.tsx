'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Sliders,
  Package,
  Truck,
  Tag,
  BarChart3,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  RefreshCw,
  Shield,
  Search,
  Sparkles,
} from 'lucide-react';

export default function AuraAdminPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'coupons' | 'branding'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Store settings
  const [settings, setSettings] = useState({
    store_name: 'AURA // TECHNICAL ATELIER',
    logo_text: 'AURA',
    primary_color: '#10b981',
    hero_title: 'Engineered form. Zero noise.',
  });

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [prodSearch, setProdSearch] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Footwear');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [sizes, setSizes] = useState('UK 7, UK 8, UK 9, UK 10');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Coupons state
  const [coupons, setCoupons] = useState<any[]>([
    { code: 'FLOWIX10', type: 'percent', value: 10 },
    { code: 'WELCOME200', type: 'flat', value: 200 },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'flat'>(
    'percent'
  );
  const [newCouponValue, setNewCouponValue] = useState('15');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  }

  useEffect(() => {
    loadAllAdminData();
    const savedCoupons = localStorage.getItem('flowix_coupons');
    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch {}
    }
  }, []);

  async function loadAllAdminData() {
    setLoading(true);
    try {
      const { data: sData } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (sData) {
        setSettings({
          store_name: sData.store_name || 'AURA // TECHNICAL ATELIER',
          logo_text: sData.logo_text || 'AURA',
          primary_color: sData.primary_color || '#10b981',
          hero_title: sData.hero_title || 'Engineered form. Zero noise.',
        });
      }

      const { data: pData } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (pData) setProducts(pData);

      const { data: oData } = await supabase
        .from('customer_orders')
        .select('*')
        .order('id', { ascending: false });

      if (oData) setOrders(oData);
    } catch (err: any) {
      showToast('Sync note: ' + (err?.message || 'Loaded local state'));
    }
    setLoading(false);
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('store_settings').upsert([
      {
        id: 1,
        store_name: settings.store_name,
        logo_text: settings.logo_text,
        primary_color: settings.primary_color,
        hero_title: settings.hero_title,
      },
    ]);
    setSaving(false);
    if (error) {
      showToast('Save failed: ' + error.message);
    } else {
      showToast('AURA Store Settings Updated Live!');
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !price.trim()) {
      showToast('Product Title and Selling Price are required.');
      return;
    }
    setSaving(true);

    // Pack extra metadata cleanly so both basic and extended schemas work seamlessly
    const packedTitle = `${title.trim()} || ${Number(mrp) || Math.round(Number(price) * 1.3)} || ${sizes.trim() || 'S, M, L, XL'} || ${description.trim() || 'AURA technical grade release.'}`;

    const { error } = await supabase.from('products').insert([
      {
        title: packedTitle,
        category: category.trim() || 'Footwear',
        price: Number(price),
        image_url:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      },
    ]);

    setSaving(false);
    if (error) {
      showToast('Add product failed: ' + error.message);
    } else {
      setTitle('');
      setPrice('');
      setMrp('');
      setDescription('');
      showToast('Product published to live store!');
      loadAllAdminData();
    }
  }

  async function handleDeleteProduct(id: number) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      showToast('Delete failed: ' + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed from inventory.');
    }
  }

  async function handleUpdateOrderStatus(orderId: number, newStatus: string) {
    const { error } = await supabase
      .from('customer_orders')
      .update({ order_status: newStatus })
      .eq('id', orderId);

    if (error) {
      showToast('Status update failed: ' + error.message);
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: newStatus } : o
        )
      );
      showToast(`Order #${orderId} updated → ${newStatus}`);
    }
  }

  function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase();
    if (!cleanCode) return;
    const updated = [
      ...coupons.filter((c) => c.code !== cleanCode),
      { code: cleanCode, type: newCouponType, value: Number(newCouponValue) || 10 },
    ];
    setCoupons(updated);
    localStorage.setItem('flowix_coupons', JSON.stringify(updated));
    setNewCouponCode('');
    showToast(`Coupon ${cleanCode} activated!`);
  }

  function handleRemoveCoupon(code: string) {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    localStorage.setItem('flowix_coupons', JSON.stringify(updated));
    showToast(`Coupon ${code} deleted.`);
  }

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );
  const pendingCount = orders.filter(
    (o) => !(o.order_status || '').toLowerCase().includes('delivered')
  ).length;

  const filteredProducts = products.filter((p) =>
    (p.title || '').toLowerCase().includes(prodSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(prodSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return (o.order_status || '')
      .toLowerCase()
      .includes(orderFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP TECHNICAL HEADER */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
              title="Back to Store"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rotate-45" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                  AURA COMMAND OS // v2.6
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-serif font-bold tracking-wider text-white">
                Admin Control Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={loadAllAdminData}
              className="px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500/60 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync DB</span>
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-emerald-500 text-black font-bold uppercase tracking-wider"
            >
              View Live Store →
            </a>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-6xl mx-auto px-4 border-t border-zinc-800/80 flex overflow-x-auto gap-1 py-2 font-mono text-[11px]">
          {[
            { id: 'overview', label: 'Analytics & KPIs', icon: BarChart3 },
            { id: 'products', label: 'Inventory (+ Add)', icon: Package },
            { id: 'orders', label: 'Orders & Dispatch', icon: Truck },
            { id: 'coupons', label: 'Promo Coupons', icon: Tag },
            { id: 'branding', label: 'AURA Theme & UI', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 uppercase font-bold tracking-wider flex items-center gap-1.5 shrink-0 transition ${
                  active
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900/70 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* LIVE KPI STRIP (ALWAYS VISIBLE) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-zinc-900/90 border border-zinc-800 p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              TOTAL REVENUE
            </span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              TOTAL ORDERS
            </span>
            <p className="text-2xl font-bold text-white mt-1">
              {orders.length}
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              ACTIVE DISPATCHES
            </span>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              CATALOG UNITS
            </span>
            <p className="text-2xl font-bold text-white mt-1">
              {products.length}
            </p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg text-white">
                  Recent Orders Queue
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="font-mono text-[11px] text-emerald-400 hover:underline"
                >
                  Manage All →
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="font-mono text-xs text-zinc-500">
                  No orders in database yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">
                          #{ord.id} • {ord.customer_email}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {ord.items}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-bold text-emerald-400">
                          ₹{ord.total_amount}
                        </span>
                        <span className="text-[10px] text-amber-300">
                          {ord.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg text-white">
                  Quick Actions & System Health
                </h2>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="p-4 border border-zinc-800 bg-zinc-950 hover:border-emerald-500 text-left space-y-1 transition"
                >
                  <span className="block text-emerald-400 font-bold">
                    + ADD NEW GEAR
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Publish Footwear, Hoodies, or Tees
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="p-4 border border-zinc-800 bg-zinc-950 hover:border-emerald-500 text-left space-y-1 transition"
                >
                  <span className="block text-emerald-400 font-bold">
                    DISPATCH CONSOLE
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Update PIN shipping & delivery status
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('coupons')}
                  className="p-4 border border-zinc-800 bg-zinc-950 hover:border-emerald-500 text-left space-y-1 transition"
                >
                  <span className="block text-emerald-400 font-bold">
                    PROMO ENGINE
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Create instant checkout discount codes
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('branding')}
                  className="p-4 border border-zinc-800 bg-zinc-950 hover:border-emerald-500 text-left space-y-1 transition"
                >
                  <span className="block text-emerald-400 font-bold">
                    BRAND & ACCENT
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Customize AURA title & theme color
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleAddProduct}
              className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-5 space-y-3 text-xs h-fit"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Publish New Product</span>
              </div>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Title (e.g. AURA Combat Boots) *"
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category (Footwear, Tshirts...)"
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                />
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="Sizes (UK 7, UK 8, UK 9)"
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Selling Price (₹) *"
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                />
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="MRP (₹)"
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Product Image URL (https://...)"
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white font-mono"
              />

              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Technical specs / description"
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'PUBLISHING...' : 'PUBLISH TO STORE'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif text-lg text-white">
                  Live Database Products ({filteredProducts.length})
                </h2>
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder="Filter inventory..."
                    className="bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <p className="font-mono text-xs text-zinc-500 py-6 text-center">
                  No products found in Supabase table yet. Add one on the left!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {filteredProducts.map((item) => {
                    const cleanTitle = (item.title || '').split('||')[0].trim();
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image_url}
                            alt={cleanTitle}
                            className="w-12 h-12 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {cleanTitle}
                            </p>
                            <p className="font-mono text-[11px] text-zinc-400">
                              {item.category} • ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-2 border border-zinc-800 text-rose-400 hover:bg-rose-950/50 hover:border-rose-700 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-lg text-white">
                Customer Orders & Shipping Status ({filteredOrders.length})
              </h2>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {['ALL', 'Packing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 uppercase font-bold border ${
                      orderFilter === st
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="font-mono text-xs text-zinc-500 py-8 text-center">
                No orders matching this filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-zinc-950 border border-zinc-800 p-4 space-y-3 font-mono text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                      <div>
                        <span className="text-emerald-400 font-bold">
                          DB-ID #{ord.id}
                        </span>
                        <span className="text-zinc-500 mx-2">|</span>
                        <span className="text-white">{ord.customer_email}</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        ₹{ord.total_amount}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed break-words">
                      {ord.items}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-[11px] text-amber-300">
                        Current: {ord.order_status}
                      </span>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-zinc-400 uppercase">
                          Update Stage:
                        </label>
                        <select
                          value={ord.order_status || 'Order Placed • Packing'}
                          onChange={(e) =>
                            handleUpdateOrderStatus(ord.id, e.target.value)
                          }
                          className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-white text-xs"
                        >
                          <option value="Order Placed • Packing">
                            Order Placed • Packing
                          </option>
                          <option value="Packed & Ready to Ship">
                            Packed & Ready to Ship
                          </option>
                          <option value="Shipped • In Transit">
                            Shipped • In Transit
                          </option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <form
              onSubmit={handleAddCoupon}
              className="bg-zinc-900 border border-zinc-800 p-5 space-y-3"
            >
              <h2 className="font-serif text-lg text-white">
                Create Promo Coupon
              </h2>
              <input
                type="text"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                placeholder="Code (e.g. AURA20)"
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white uppercase"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(e.target.value)}
                  placeholder="Value"
                  className="px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 text-black font-black uppercase tracking-widest"
              >
                Activate Coupon
              </button>
            </form>

            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-3">
              <h2 className="font-serif text-lg text-white">Active Coupons</h2>
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3"
                >
                  <div>
                    <span className="font-bold text-emerald-400">{c.code}</span>
                    <span className="text-zinc-400 ml-2">
                      ({c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoupon(c.code)}
                    className="text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BRANDING */}
        {activeTab === 'branding' && (
          <form
            onSubmit={handleSaveSettings}
            className="max-w-xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 text-xs"
          >
            <h2 className="font-serif text-lg text-white">
              AURA Storefront Branding & Theme
            </h2>
            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Store Full Title
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) =>
                  setSettings({ ...settings, store_name: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Logo Mark
              </label>
              <input
                type="text"
                value={settings.logo_text}
                onChange={(e) =>
                  setSettings({ ...settings, logo_text: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Hero Headline
              </label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) =>
                  setSettings({ ...settings, hero_title: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1.5">
                Technical Accent Color
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Cyan', hex: '#06b6d4' },
                  { name: 'Amber', hex: '#f59e0b' },
                  { name: 'Rose', hex: '#f43f5e' },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, primary_color: preset.hex })
                    }
                    className={`px-3 py-2 border font-mono flex items-center gap-2 ${
                      settings.primary_color === preset.hex
                        ? 'border-emerald-400 bg-zinc-800 text-white'
                        : 'border-zinc-700 bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest"
            >
              {saving ? 'SAVING SETTINGS...' : 'SAVE BRAND SETTINGS'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
