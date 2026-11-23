'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Settings,
  PackagePlus,
  Truck,
  ArrowLeft,
  Trash2,
  Save,
  CheckCircle2,
  Tag,
  ImagePlus,
  Lock,
  LogOut,
} from 'lucide-react';

export default function AdminDashboard() {
  // Owner Password Lock State
  const OWNER_SECRET_PASSWORD = 'FLOWIX2026';
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'coupons' | 'orders'>('products');

  // Store Settings State
  const [storeName, setStoreName] = useState('Flowix Atelier');
  const [logoText, setLogoText] = useState('Flowix Demo');
  const [primaryColor, setPrimaryColor] = useState('#1c1917');
  const [heroTitle, setHeroTitle] = useState('Shop smarter. Live better.');
  const [savingSettings, setSavingSettings] = useState(false);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tshirts');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([
    { code: 'FLOWIX10', type: 'percent', value: 10 },
    { code: 'WELCOME200', type: 'flat', value: 200 },
  ]);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'flat'>('percent');
  const [newValue, setNewValue] = useState('');

  // Orders & Delivery State
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('flowix_owner_unlocked');
    if (auth === 'true') {
      setIsUnlocked(true);
    }
    fetchAllData();
    const saved = localStorage.getItem('flowix_coupons');
    if (saved) {
      try {
        setCoupons(JSON.parse(saved));
      } catch {}
    }
  }, []);

  function handleOwnerUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput.trim() === OWNER_SECRET_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem('flowix_owner_unlocked', 'true');
    } else {
      alert('Wrong Owner Password! Please enter the correct password.');
    }
  }

  function handleOwnerLock() {
    setIsUnlocked(false);
    setPasswordInput('');
    sessionStorage.removeItem('flowix_owner_unlocked');
  }

  async function fetchAllData() {
    const { data: sData } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (sData) {
      setStoreName(sData.store_name || 'Flowix Atelier');
      setLogoText(sData.logo_text || 'Flowix Demo');
      setPrimaryColor(sData.primary_color || '#1c1917');
      setHeroTitle(sData.hero_title || 'Shop smarter. Live better.');
    }

    const { data: pData } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    if (pData) setProducts(pData);

    const { data: oData } = await supabase
      .from('customer_orders')
      .select('*')
      .neq('order_status', 'ACCOUNT_PROFILE')
      .order('id', { ascending: false });
    if (oData) setOrders(oData);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 550;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        setImageUrl(compressedDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function saveStoreSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    const { error } = await supabase.from('store_settings').upsert({
      id: 1,
      store_name: storeName,
      logo_text: logoText,
      primary_color: primaryColor,
      hero_title: heroTitle,
    });
    setSavingSettings(false);
    if (error) {
      alert('Error saving settings: ' + error.message);
    } else {
      alert('Theme & Store Settings Published!');
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price) return;
    setAddingProduct(true);

    const packedTitle = `${title.trim()} || ${mrp || Math.round(Number(price) * 1.25)} || ${sizesInput.trim() || 'S, M, L, XL'} || ${description.trim() || 'Premium crafted item with comfortable fit.'}`;

    const { error } = await supabase.from('products').insert([
      {
        title: packedTitle,
        category,
        price: Number(price),
        image_url:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
      },
    ]);
    setAddingProduct(false);
    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      setTitle('');
      setPrice('');
      setMrp('');
      setDescription('');
      setImageUrl('');
      fetchAllData();
      alert('Product added with photo, sizes & description!');
    }
  }

  async function deleteProduct(id: number) {
    await supabase.from('products').delete().eq('id', id);
    fetchAllData();
  }

  function addCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim() || !newValue) return;
    const updated = [
      ...coupons,
      { code: newCode.trim().toUpperCase(), type: newType, value: Number(newValue) },
    ];
    setCoupons(updated);
    localStorage.setItem('flowix_coupons', JSON.stringify(updated));
    setNewCode('');
    setNewValue('');
  }

  function removeCoupon(code: string) {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    localStorage.setItem('flowix_coupons', JSON.stringify(updated));
  }

  async function updateDeliveryStatus(orderId: number, newStatus: string) {
    const { error } = await supabase
      .from('customer_orders')
      .update({ order_status: newStatus })
      .eq('id', orderId);
    if (!error) {
      fetchAllData();
    }
  }

  // OWNER PASSWORD GATE SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#f6f5f2] text-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 p-8 space-y-5 shadow-xs">
          <div className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Restricted Access
            </span>
            <h1 className="text-2xl font-serif mt-1">Store Owner Login</h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter the Owner Password to manage products, coupons, orders, and theme settings.
            </p>
          </div>

          <form onSubmit={handleOwnerUnlock} className="space-y-4">
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Owner Password..."
              className="w-full border border-stone-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-stone-900"
            />
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90"
            >
              Unlock Owner Studio
            </button>
          </form>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
            <a href="/" className="text-stone-600 hover:text-stone-900 underline">
              ← Back to Customer Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-stone-900">
      <header className="bg-stone-900 text-white px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400">
              ● Owner Mode Active
            </span>
            <h1 className="text-lg font-bold">Store Owner Control Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOwnerLock}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider border border-stone-600 text-stone-200 px-3 py-2 hover:bg-stone-800"
            >
              <LogOut className="w-3.5 h-3.5" /> Lock Admin
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white text-stone-900 px-3.5 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Storefront
            </a>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-200 px-4">
        <div className="max-w-5xl mx-auto flex gap-6 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'products'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500'
            }`}
          >
            <PackagePlus className="w-4 h-4" /> Add Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-4 flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'coupons'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500'
            }`}
          >
            <Tag className="w-4 h-4" /> Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500'
            }`}
          >
            <Truck className="w-4 h-4" /> Orders & Delivery ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'settings'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500'
            }`}
          >
            <Settings className="w-4 h-4" /> Theme Settings
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <form onSubmit={addProduct} className="md:col-span-6 bg-white border border-stone-200 p-6 space-y-4 h-fit">
              <h2 className="text-xl font-serif">Add New Product to Store</h2>

              <div className="border-2 border-dashed border-stone-300 p-4 text-center space-y-2 bg-stone-50">
                <ImagePlus className="w-6 h-6 mx-auto text-stone-600" />
                <p className="text-xs font-semibold text-stone-700">
                  Upload Product Photo from Phone Gallery
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs w-full"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-28 mx-auto object-cover border border-stone-300 mt-2"
                  />
                )}
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste Image URL here..."
                className="w-full border border-stone-300 px-3 py-2 text-xs"
              />

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Name * (e.g. Vintage Cargo Overshirt)"
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-stone-300 px-3 py-2 text-sm bg-white"
                >
                  <option>Tshirts</option>
                  <option>Hoodies</option>
                  <option>Accessories</option>
                  <option>Men</option>
                  <option>Women</option>
                </select>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="Sizes: S, M, L, XL"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Selling Price ₹ *"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="Original MRP ₹ (Cut Price)"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Product Definition / Full Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write fabric quality, fit details, wash care, and product highlights..."
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={addingProduct}
                className="w-full bg-stone-900 text-white py-3 text-xs font-bold uppercase tracking-widest"
              >
                {addingProduct ? 'UPLOADING PRODUCT...' : '+ PUBLISH PRODUCT TO STORE'}
              </button>
            </form>

            <div className="md:col-span-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-600">
                Live Database Products ({products.length})
              </h3>
              {products.length === 0 ? (
                <p className="text-sm text-stone-500 bg-white p-6 border border-stone-200">
                  No custom products added yet. Upload a photo and add your first product on the left!
                </p>
              ) : (
                products.map((p) => {
                  const cleanTitle = (p.title || '').split('||')[0].trim();
                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-stone-200 p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={cleanTitle}
                          className="w-16 h-16 object-cover bg-stone-100"
                        />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-500">
                            {p.category}
                          </span>
                          <h3 className="font-semibold text-sm">{cleanTitle}</h3>
                          <p className="text-xs font-bold">₹{p.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-600 p-2 hover:bg-red-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={addCoupon} className="bg-white border border-stone-200 p-6 space-y-4 h-fit">
              <h2 className="text-xl font-serif">Create Discount Coupon</h2>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Coupon Code (e.g. MEGA25)"
                className="w-full border border-stone-300 px-3 py-2 text-sm uppercase"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'percent' | 'flat')}
                  className="border border-stone-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
                <input
                  type="number"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Discount Value (e.g. 25)"
                  className="border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-2.5 text-xs font-bold uppercase tracking-widest"
              >
                + Activate Coupon Code
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-600">
                Active Promo Codes
              </h3>
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white border border-stone-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-sm bg-stone-900 text-white px-2.5 py-1">
                      {c.code}
                    </span>
                    <p className="text-xs text-stone-600 mt-1.5">
                      {c.type === 'percent' ? `${c.value}% Off Total Cart` : `Flat ₹${c.value} Off`}
                    </p>
                  </div>
                  <button onClick={() => removeCoupon(c.code)} className="text-red-600 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Customer Orders & Live Delivery Dispatch</h2>
            {orders.length === 0 ? (
              <div className="bg-white border border-stone-200 p-8 text-center text-sm text-stone-500">
                No orders received yet. Place a test order from the storefront!
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-stone-900 text-white px-2 py-0.5">
                        ORDER #{order.id}
                      </span>
                      <span className="text-xs text-stone-500">{order.customer_email}</span>
                    </div>
                    <p className="text-sm font-medium text-stone-900">{order.items}</p>
                    <p className="text-xs font-bold text-stone-700">Total Paid: ₹{order.total_amount}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <select
                      value={order.order_status || 'Order Confirmed'}
                      onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
                      className="border border-stone-300 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-stone-50"
                    >
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Packed & Ready">Packed & Ready</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={saveStoreSettings} className="bg-white border border-stone-200 p-6 space-y-5 max-w-2xl">
            <h2 className="text-xl font-serif">General & Theme Customizer</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Brand / Logo Text
              </label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Store Legal Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Hero Banner Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Primary Button & Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-16 border border-stone-300 cursor-pointer"
                />
                <span className="text-xs font-mono text-stone-600">{primaryColor}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-stone-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {savingSettings ? 'Saving...' : 'Publish Changes'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
