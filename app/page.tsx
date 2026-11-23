'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { supabase } from '../lib/supabase';
import {
  Search,
  ShoppingBag,
  User,
  Check,
  ShieldCheck,
  Award,
  RotateCcw,
  Headphones,
  X,
  ArrowRight,
  MapPin,
  Phone,
  Truck,
  Heart,
  Star,
  Tag,
  Eye,
  Plus,
  Minus,
} from 'lucide-react';

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [settings, setSettings] = useState({
    store_name: 'Flowix Atelier',
    logo_text: 'Flowix Demo',
    primary_color: '#1c1917',
    hero_title: 'Shop smarter. Live better.',
    announcement: '🚚 FREE SHIPPING ON ORDERS ABOVE ₹1,999 • USE CODE: FLOWIX10 FOR 10% OFF',
  });

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Wishlist & Quick View Modal State
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');
  const [modalQty, setModalQty] = useState(1);

  // Cart, Coupons & Checkout State
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([
    { code: 'FLOWIX10', type: 'percent', value: 10 },
    { code: 'WELCOME200', type: 'flat', value: 200 },
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash on Delivery (COD)');
  const [ordering, setOrdering] = useState(false);

  const defaultProducts = [
    {
      id: 1,
      title: 'Essential Heavyweight Boxy Tee',
      category: 'Tshirts',
      price: 1299,
      mrp: 1799,
      rating: 4.8,
      reviews: 124,
      sizes: ['S', 'M', 'L', 'XL'],
      description:
        'Crafted from 260 GSM 100% combed organic cotton. Features a relaxed drop-shoulder silhouette, ribbed collar, and breathable all-season weave.',
      image_url:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Tailored Wool-Blend Trench Coat',
      category: 'Women',
      price: 3899,
      mrp: 4999,
      rating: 4.9,
      reviews: 89,
      sizes: ['XS', 'S', 'M', 'L'],
      description:
        'Double-breasted structured overcoat with storm-flap detailing, adjustable waist belt, and satin inner lining for effortless layering.',
      image_url:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'Heritage Chrono & Eyewear Set',
      category: 'Accessories',
      price: 2499,
      mrp: 3299,
      rating: 4.7,
      reviews: 64,
      sizes: ['One Size'],
      description:
        'Minimalist brushed steel chronograph paired with UV400 polarized acetate sunglasses. Water-resistant up to 5 ATM.',
      image_url:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'Studio 400GSM Fleece Hoodie',
      category: 'Hoodies',
      price: 2199,
      mrp: 2899,
      rating: 4.9,
      reviews: 210,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description:
        'Ultra-plush brushed fleece interior with double-lined hood, kangaroo pocket, and pre-shrunk anti-pill finish.',
      image_url:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: 'Urban Relaxed Selvedge Denim Jacket',
      category: 'Men',
      price: 2799,
      mrp: 3599,
      rating: 4.8,
      reviews: 95,
      sizes: ['M', 'L', 'XL'],
      description:
        'Vintage-washed 13oz cotton denim jacket with custom antique brass hardware and reinforced utility chest pockets.',
      image_url:
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      title: 'Minimalist Knit Co-ord Ensemble',
      category: 'Women',
      price: 2999,
      mrp: 3999,
      rating: 4.9,
      reviews: 142,
      sizes: ['XS', 'S', 'M', 'L'],
      description:
        'Soft-touch ribbed knit top paired with high-waisted wide-leg trousers. Designed for elevated comfort from day to evening.',
      image_url:
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const categories = [
    {
      name: 'Tshirts',
      count: 'ESSENTIALS',
      img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Accessories',
      count: 'CURATED',
      img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hoodies',
      count: 'HEAVYWEIGHT',
      img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Parse packed description metadata safely
  function normalizeProduct(raw: any) {
    let desc =
      raw.description ||
      'Premium quality piece crafted with attention to fit, durability, and everyday comfort.';
    let mrp = raw.mrp || Math.round(Number(raw.price || 999) * 1.3);
    let sizes = raw.sizes || ['S', 'M', 'L', 'XL'];

    if (typeof raw.title === 'string' && raw.title.includes('||')) {
      const parts = raw.title.split('||');
      return {
        ...raw,
        title: parts[0].trim(),
        mrp: Number(parts[1]) || mrp,
        sizes: parts[2] ? parts[2].split(',').map((s: string) => s.trim()) : sizes,
        description: parts[3] ? parts[3].trim() : desc,
        rating: 4.8,
        reviews: 47,
      };
    }

    return {
      ...raw,
      mrp,
      sizes,
      description: desc,
      rating: raw.rating || 4.8,
      reviews: raw.reviews || 58,
    };
  }

  useEffect(() => {
    loadStoreData();
    const savedCoupons = localStorage.getItem('flowix_coupons');
    if (savedCoupons) {
      try {
        setAvailableCoupons(JSON.parse(savedCoupons));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 220;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const light1 = new THREE.DirectionalLight(0xffffff, 1.8);
    light1.position.set(3, 4, 5);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.85, 0.24, 120, 16),
      new THREE.MeshStandardMaterial({
        color: 0x292524,
        metalness: 0.45,
        roughness: 0.25,
      })
    );
    scene.add(knot);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      knot.rotation.x += 0.008;
      knot.rotation.y += 0.012;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  async function loadStoreData() {
    try {
      const { data: sData } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (sData) {
        setSettings((prev) => ({
          ...prev,
          store_name: sData.store_name || 'Flowix Atelier',
          logo_text: sData.logo_text || sData.store_name || 'Flowix Demo',
          primary_color: sData.primary_color || '#1c1917',
          hero_title: sData.hero_title || 'Shop smarter. Live better.',
        }));
      }

      const { data: pData } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (pData && pData.length > 0) {
        setProducts(pData.map(normalizeProduct));
      } else {
        setProducts(defaultProducts);
      }
    } catch {
      setProducts(defaultProducts);
    }
  }

  function openProductModal(item: any) {
    setActiveProduct(item);
    setSelectedSize(item.sizes?.[0] || 'M');
    setSelectedColor('Obsidian Black');
    setModalQty(1);
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function addToCartWithDetails(item: any, size = 'M', color = 'Obsidian Black', qty = 1) {
    setCart((prev) => [
      ...prev,
      {
        ...item,
        selectedSize: size,
        selectedColor: color,
        qty,
      },
    ]);
    setActiveProduct(null);
    setShowCart(true);
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  }

  const filteredProducts = products
    .filter((item) => {
      const matchesCat =
        selectedCategory === 'All' ||
        (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'low') return Number(a.price) - Number(b.price);
      if (sortBy === 'high') return Number(b.price) - Number(a.price);
      return 0;
    });

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  function applyCouponCode() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = availableCoupons.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      alert('Invalid Coupon Code! Try FLOWIX10 or WELCOME200');
      return;
    }
    const disc =
      found.type === 'percent'
        ? Math.round((subtotal * Number(found.value)) / 100)
        : Number(found.value);
    setAppliedCoupon({ code: found.code, discount: disc });
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!customerEmail.trim() || !customerName.trim() || !shippingAddress.trim() || cart.length === 0) {
      alert('Please fill Name, Email, and Delivery Address.');
      return;
    }
    setOrdering(true);
    const itemsList = cart
      .map((c) => `${c.title} [Size: ${c.selectedSize}, Color: ${c.selectedColor}, Qty: ${c.qty}]`)
      .join(' + ');
    const couponNote = appliedCoupon ? ` | Coupon: ${appliedCoupon.code} (-₹${appliedCoupon.discount})` : '';
    const itemsSummary = `${itemsList}${couponNote} | Deliver To: ${customerName} (${customerPhone}) - ${shippingAddress} [${paymentMode}]`;

    const { error } = await supabase.from('customer_orders').insert([
      {
        customer_email: customerEmail.trim(),
        items: itemsSummary,
        total_amount: grandTotal,
        order_status: 'Order Confirmed',
      },
    ]);

    setOrdering(false);
    if (error) {
      alert('Order failed: ' + error.message);
    } else {
      alert('Order Confirmed! Track your delivery anytime in My Orders.');
      setCart([]);
      setAppliedCoupon(null);
      setShowCart(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-stone-900 font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-[11px] tracking-widest uppercase px-4 py-2 flex items-center justify-between gap-2">
        <span className="truncate">{settings.announcement}</span>
        <div className="flex items-center gap-4 shrink-0 font-semibold">
          <a href="/orders" className="hover:text-white transition">
            TRACK ORDER
          </a>
          <a href="/admin" className="hover:text-white transition">
            ADMIN PANEL
          </a>
        </div>
      </div>

      {/* Main Editorial Navbar */}
      <header className="sticky top-0 z-30 bg-[#f6f5f2]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl md:text-2xl font-bold tracking-tight text-stone-900">
            {settings.logo_text}
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-widest uppercase text-stone-600">
            <a href="/" className="text-stone-900 border-b-2 border-stone-900 pb-0.5">
              HOME
            </a>
            <a href="#shop" className="hover:text-stone-900">
              SHOP
            </a>
            <a href="/orders" className="hover:text-stone-900">
              MY ORDERS
            </a>
            <a href="/admin" className="hover:text-stone-900">
              ADMIN & SETTINGS
            </a>
          </nav>

          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
              className="p-1.5 text-stone-700 hover:text-stone-950"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="relative p-1.5 text-stone-700" title="Wishlist">
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </div>
            <a href="/admin" title="Admin Settings" className="p-1.5 text-stone-700 hover:text-stone-950">
              <User className="w-4 h-4" />
            </a>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-1.5 text-stone-700 hover:text-stone-950"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="md:hidden border-t border-stone-200 px-4 py-2 flex justify-around text-[11px] font-semibold uppercase tracking-wider text-stone-700 bg-white">
          <a href="#shop">Shop</a>
          <a href="/orders">My Orders</a>
          <a href="/admin">Admin Studio</a>
        </div>

        {/* Expandable Search Bar */}
        {showSearch && (
          <div className="border-t border-stone-200 bg-white px-4 py-3">
            <div className="max-w-xl mx-auto flex items-center gap-2">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, fabrics, categories..."
                className="w-full text-sm focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-stone-500">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Editorial Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            NEW THIS SEASON • COUPON: FLOWIX10
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-tight text-stone-900 leading-[1.1]">
            {settings.hero_title}
          </h1>
          <p className="text-stone-600 text-sm md:text-base max-w-md leading-relaxed">
            Discover quality apparel & essentials with size customization, instant promo discounts, and real-time door-to-door delivery tracking.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#shop"
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition"
              style={{ backgroundColor: settings.primary_color }}
            >
              SHOP NOW
            </a>
            <a
              href="#categories"
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest border border-stone-300 bg-white text-stone-900 hover:border-stone-900 transition"
            >
              BROWSE CATEGORIES
            </a>
          </div>
        </div>

        {/* Right Side 3D Studio Badge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border border-stone-300 bg-white/70 shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
            <div ref={mountRef} className="w-full h-full" />
            <div className="absolute bottom-4 text-center pointer-events-none">
              <span className="block text-sm font-bold tracking-widest text-stone-900">2026</span>
              <span className="block text-[10px] italic text-stone-500">Established</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features Strip */}
      <section className="border-y border-stone-200 bg-[#efede8]">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-[11px] font-semibold uppercase tracking-wider text-stone-700">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-stone-900" />
            <span>FAST SHIPPING</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-900" />
            <span>SECURE PAYMENTS</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-stone-900" />
            <span>TRUSTED SUPPLIERS</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-stone-900" />
            <span>7-DAY EASY RETURNS</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
            <Headphones className="w-4 h-4 text-stone-900" />
            <span>24/7 SUPPORT</span>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section id="categories" className="max-w-6xl mx-auto px-4 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          EXPLORE
        </p>
        <h2 className="text-3xl font-serif text-stone-900 mt-1">Browse by Category</h2>
        <p className="text-xs italic text-stone-500 mt-1 mb-7">— find what you love —</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative h-64 overflow-hidden bg-stone-200 text-left"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-xl font-semibold">{cat.name}</h3>
                <p className="text-[10px] tracking-widest uppercase text-stone-300 mt-0.5">
                  {cat.count}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Catalog / Shop Grid */}
      <section id="shop" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              CURATED CATALOG
            </p>
            <h2 className="text-2xl font-serif text-stone-900">Featured Collection</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Tshirts', 'Hoodies', 'Accessories', 'Men', 'Women'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition ${
                  selectedCategory === tab
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'
                }`}
              >
                {tab}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {filteredProducts.map((item) => {
            const discountPct =
              item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
            const isWished = wishlist.includes(item.id);
            return (
              <div key={item.id} className="bg-white border border-stone-200 group flex flex-col">
                <div
                  onClick={() => openProductModal(item)}
                  className="relative h-80 overflow-hidden bg-stone-100 cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-800">
                      {item.category}
                    </span>
                    {discountPct > 0 && (
                      <span className="bg-emerald-700 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWished ? 'fill-red-600 text-red-600' : 'text-stone-700'}`}
                    />
                  </button>

                  <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white/95 text-stone-900 py-2 text-center text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Select Size & View Details
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-amber-600 mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-stone-800">{item.rating}</span>
                      <span className="text-stone-400">({item.reviews})</span>
                    </div>
                    <h3
                      onClick={() => openProductModal(item)}
                      className="font-medium text-base text-stone-900 cursor-pointer hover:underline"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-bold text-stone-900">₹{item.price}</span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-stone-400 line-through">₹{item.mrp}</span>
                      )}
                    </div>
                    <div className="flex gap-1.5 mt-2.5">
                      {(item.sizes || ['S', 'M', 'L']).map((sz: string) => (
                        <span
                          key={sz}
                          className="text-[10px] font-semibold border border-stone-200 px-2 py-0.5 text-stone-600"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openProductModal(item)}
                    className="mt-4 w-full py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    <span>CHOOSE SIZE & BUY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUCT QUICK-VIEW & SIZE SELECTOR MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 border border-stone-200 relative">
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-3 right-3 z-10 bg-white p-2 border border-stone-200 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-80 md:h-full bg-stone-100">
              <img
                src={activeProduct.image_url}
                alt={activeProduct.title}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  {activeProduct.category}
                </span>
                <h2 className="text-2xl font-serif text-stone-900 mt-1">{activeProduct.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold text-stone-900">₹{activeProduct.price}</span>
                  {activeProduct.mrp > activeProduct.price && (
                    <span className="text-sm text-stone-400 line-through">₹{activeProduct.mrp}</span>
                  )}
                </div>
              </div>

              {/* Product Definition / Description */}
              <div className="border-y border-stone-200 py-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Product Description & Fit
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">{activeProduct.description}</p>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Size: <span className="text-stone-900">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(activeProduct.sizes || ['S', 'M', 'L', 'XL']).map((sz: string) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-xs font-bold border ${
                        selectedSize === sz
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-800 border-stone-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Color Variant: <span className="text-stone-900">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Obsidian Black', 'Ivory Cream', 'Olive Moss'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 text-xs border ${
                        selectedColor === col
                          ? 'border-stone-900 bg-stone-100 font-bold'
                          : 'border-stone-300 text-stone-600'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="p-2 hover:bg-stone-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold">{modalQty}</span>
                  <button onClick={() => setModalQty(modalQty + 1)} className="p-2 hover:bg-stone-100">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  addToCartWithDetails(activeProduct, selectedSize, selectedColor, modalQty)
                }
                className="w-full py-3.5 text-xs font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: settings.primary_color }}
              >
                ADD TO BAG — ₹{activeProduct.price * modalQty}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-white font-bold text-lg">{settings.logo_text}</h3>
            <p className="text-stone-400 text-xs mt-2 leading-relaxed">
              Full-featured commerce storefront with sizes, promo coupons, gallery uploads, and live delivery tracking.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#shop" className="hover:text-white">Shop Catalog</a></li>
              <li><a href="/orders" className="hover:text-white">Track My Order</a></li>
              <li><a href="/admin" className="hover:text-white">Store Admin & Settings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Active Coupons</h4>
            <p className="text-xs text-stone-400">FLOWIX10 (10% Off) • WELCOME200 (₹200 Off)</p>
          </div>
        </div>
      </footer>

      {/* Complete Checkout, Coupon & Delivery Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h2 className="font-serif text-xl">Shopping Bag ({cart.length})</h2>
                <button onClick={() => setShowCart(false)} className="p-1 text-stone-500 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-stone-500 py-8 text-center">Your cart is currently empty.</p>
              ) : (
                <div className="divide-y divide-stone-200 my-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-stone-900">{item.title}</p>
                        <p className="text-[11px] text-stone-500">
                          Size: {item.selectedSize} • {item.selectedColor} • Qty: {item.qty}
                        </p>
                        <p className="text-xs font-bold text-stone-800 mt-0.5">
                          ₹{item.price * item.qty}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  {/* Coupon Code Box */}
                  <div className="bg-stone-50 border border-stone-200 p-3 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Apply Promo / Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. FLOWIX10"
                        className="flex-1 border border-stone-300 bg-white px-3 py-1.5 text-xs uppercase"
                      />
                      <button
                        type="button"
                        onClick={applyCouponCode}
                        className="bg-stone-900 text-white px-4 py-1.5 text-xs font-bold uppercase"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-emerald-700 font-semibold">
                        ✓ Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-3 border-t border-stone-200 pt-4 mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-700 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Delivery Details
                    </h3>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name *"
                      className="w-full border border-stone-300 px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full border border-stone-300 px-3 py-2 text-sm"
                      />
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Phone *"
                          className="w-full border border-stone-300 pl-8 pr-2 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                      <textarea
                        required
                        rows={2}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Complete House No, Street, City, Pincode *"
                        className="w-full border border-stone-300 pl-8 pr-3 py-2 text-sm"
                      />
                    </div>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full border border-stone-300 px-3 py-2 text-sm bg-white"
                    >
                      <option>Cash on Delivery (COD)</option>
                      <option>UPI / QR Instant Pay</option>
                      <option>Credit / Debit Card</option>
                    </select>

                    <div className="bg-stone-100 p-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Coupon Discount</span>
                          <span>-₹{couponDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm border-t border-stone-300 pt-1.5 mt-1.5">
                        <span>Total Payable</span>
                        <span>₹{grandTotal}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={ordering}
                      className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      {ordering ? 'PLACING ORDER...' : 'CONFIRM ORDER & DELIVERY'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
