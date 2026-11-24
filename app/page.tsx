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
  Heart,
  Star,
  Tag,
  Eye,
  Plus,
  Minus,
  MapPin,
  Truck,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  const [orderPlacedScreen, setOrderPlacedScreen] = useState<{
    orderId: string;
    pin: string;
    orderedAt: string;
    shipBy: string;
    estimatedDelivery: string;
    total: number;
    payment: string;
  } | null>(null);

  const [settings, setSettings] = useState({
    store_name: 'AURA // TECHNICAL ATELIER',
    logo_text: 'AURA',
    primary_color: '#10b981',
    hero_title: 'Engineered form. Zero noise.',
    announcement:
      'AURA TECH DROP • FREE EXPRESS DISPATCH ABOVE ₹1,999 • CODE: FLOWIX10',
  });

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Carbon Black');
  const [modalQty, setModalQty] = useState(1);

  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([
    { code: 'FLOWIX10', type: 'percent', value: 10 },
    { code: 'WELCOME200', type: 'flat', value: 200 },
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash on Delivery (COD)');
  const [ordering, setOrdering] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  }

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIntroFading(true);
    }, 1550);
    const hideTimer = setTimeout(() => {
      setShowIntro(false);
    }, 2150);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  function replayAuraIntro() {
    setIntroFading(false);
    setShowIntro(true);
    setTimeout(() => setIntroFading(true), 1550);
    setTimeout(() => setShowIntro(false), 2150);
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

  const defaultProducts = [
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
        'Heavyweight 260 GSM technical combed cotton with structured drop-shoulder architecture.',
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
        'Monochrome steel timepiece paired with UV400 tinted eyewear.',
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
        '13oz washed denim jacket with tactical chest pockets and dark alloy buttons.',
      image_url:
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      title: 'AURA Ribbed Knit Co-ord Set',
      category: 'Women',
      price: 2999,
      mrp: 3999,
      rating: 4.9,
      reviews: 142,
      sizes: ['XS', 'S', 'M', 'L'],
      description:
        'Sculpted knit top and wide-cut trousers engineered for fluid movement.',
      image_url:
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 7,
      title: 'AURA Runner Low-Top Sneakers',
      category: 'Footwear',
      price: 2699,
      mrp: 3499,
      rating: 4.8,
      reviews: 118,
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
      description:
        'High-rebound midsole sneakers with breathable mesh and grip outsole.',
      image_url:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const categories = [
    {
      name: 'Tshirts',
      count: 'CORE KNITS',
      img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Accessories',
      count: 'OPTICS & GEAR',
      img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hoodies',
      count: 'HEAVYWEIGHT',
      img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    },
  ];

  function normalizeProduct(raw: any) {
    let desc =
      raw.description ||
      'Technical grade piece crafted for precision fit and durability.';
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
    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 512;
    logoCanvas.height = 512;
    const ctx = logoCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(256, 256, 224, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([14, 10]);
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(256, 256, 198, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 104px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AURA', 256, 246);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('SYS // 2026', 256, 316);
    }

    const auraTexture = new THREE.CanvasTexture(logoCanvas);
    auraTexture.needsUpdate = true;

    const group = new THREE.Group();

    const medallionGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.16, 64);
    medallionGeo.rotateX(Math.PI / 2);

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.8,
      roughness: 0.25,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      map: auraTexture,
      metalness: 0.25,
      roughness: 0.35,
    });

    const medallion = new THREE.Mesh(medallionGeo, [edgeMat, faceMat, faceMat]);
    group.add(medallion);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.58, 0.025, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.7,
        roughness: 0.2,
      })
    );
    orbitRing.rotation.x = Math.PI / 3;
    group.add(orbitRing);

    scene.add(group);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.1);
    dirLight1.position.set(4, 5, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.2);
    dirLight2.position.set(-4, -3, 4);
    scene.add(dirLight2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.016;
      group.rotation.x = Math.sin(Date.now() * 0.0012) * 0.18;
      orbitRing.rotation.z -= 0.015;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      auraTexture.dispose();
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
          store_name: sData.store_name || 'AURA // TECHNICAL ATELIER',
          logo_text: sData.logo_text || 'AURA',
          primary_color: sData.primary_color || '#10b981',
          hero_title: sData.hero_title || 'Engineered form. Zero noise.',
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

  function addToCartWithDetails(
    item: any,
    size = 'M',
    color = 'Carbon Black',
    qty = 1
  ) {
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
    showToast(item.title + ' added to bag');
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  }

  const dynamicCategories = [
    'All',
    ...Array.from(
      new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))
    ),
  ];

  // Strict non-overlapping synonyms so footwear queries never pull unrelated Henley/top/men items
  const searchSynonyms: Record<string, string[]> = {
    shirt: ['shirt', 'tshirt', 'tshirts', 'tee'],
    shirts: ['shirt', 'tshirt', 'tshirts', 'tee'],
    tshirt: ['tshirt', 'tshirts', 'shirt', 'tee'],
    henley: ['henley'],
    sandle: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes', 'boots'],
    sandles: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes', 'boots'],
    sandal: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes', 'boots'],
    sandals: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes', 'boots'],
    shoes: ['shoes', 'sneakers', 'footwear', 'sandle', 'sandal', 'boots'],
    boots: ['boots', 'boot', 'footwear', 'shoes', 'sneakers', 'sandle'],
    boot: ['boots', 'boot', 'footwear', 'shoes', 'sneakers'],
    sneaker: ['sneaker', 'sneakers', 'shoes', 'footwear', 'boots'],
    sneakers: ['sneakers', 'sneaker', 'shoes', 'footwear', 'boots'],
    hoodie: ['hoodie', 'hoodies', 'sweatshirt', 'fleece'],
    jacket: ['jacket', 'coat', 'trench', 'denim'],
    watch: ['watch', 'chrono', 'accessories', 'sunglasses', 'eyewear'],
    jeans: ['jeans', 'denim', 'trousers', 'pants'],
  };

  function expandSearchTerms(rawQuery: string): string[] {
    const words = rawQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const expanded = new Set<string>(words);
    words.forEach((w) => {
      if (searchSynonyms[w]) {
        searchSynonyms[w].forEach((syn) => expanded.add(syn));
      }
    });
    return Array.from(expanded);
  }

  const filteredProducts = products
    .filter((item) => {
      if (showWishlistOnly && !wishlist.includes(item.id)) return false;

      const matchesCat =
        selectedCategory === 'All' ||
        (item.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      if (q === '') return matchesCat;

      const terms = expandSearchTerms(q);
      const titleLower = (item.title || '').toLowerCase();
      const catLower = (item.category || '').toLowerCase();
      const descLower = (item.description || '').toLowerCase();
      const searchableText = `${titleLower} ${catLower} ${descLower}`;

      const matchesSearch = terms.some((term) => {
        if (term === 'men') {
          return /\bmen\b/.test(catLower) || /\bmen\b/.test(titleLower);
        }
        return searchableText.includes(term);
      });

      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'low') return Number(a.price) - Number(b.price);
      if (sortBy === 'high') return Number(b.price) - Number(a.price);
      return 0;
    });

  const matchedCategories =
    searchQuery.trim() === ''
      ? []
      : dynamicCategories.filter((cat) => {
          if (cat === 'All') return false;
          const terms = expandSearchTerms(searchQuery);
          return terms.some((term) => cat.toLowerCase().includes(term));
        });

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSelectedCategory('All');
    setShowWishlistOnly(false);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
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
      showToast('Invalid Coupon Code! Try FLOWIX10 or WELCOME200');
      return;
    }
    const disc =
      found.type === 'percent'
        ? Math.round((subtotal * Number(found.value)) / 100)
        : Number(found.value);
    setAppliedCoupon({ code: found.code, discount: disc });
    showToast('Coupon ' + found.code + ' applied (-' + disc + ')');
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    const cleanPin = pinCode.trim();
    if (
      !customerEmail.trim() ||
      !customerName.trim() ||
      !shippingAddress.trim() ||
      !/^\d{6}$/.test(cleanPin) ||
      cart.length === 0
    ) {
      showToast('Please enter Name, Email, valid 6-digit PIN, and Address.');
      return;
    }

    setOrdering(true);
    const schedule = getDeliverySchedule(cleanPin);
    const generatedOrderId = 'FLX-' + Math.floor(100000 + Math.random() * 900000);

    const itemsList = cart
      .map(
        (c) =>
          c.title +
          ' [Size: ' +
          c.selectedSize +
          ', Color: ' +
          c.selectedColor +
          ', Qty: ' +
          c.qty +
          ']'
      )
      .join(' + ');

    const couponNote = appliedCoupon
      ? ' | Coupon: ' + appliedCoupon.code + ' (-' + appliedCoupon.discount + ')'
      : '';

    const itemsSummary =
      itemsList +
      couponNote +
      ' | OrderID: ' +
      generatedOrderId +
      ' | Ordered: ' +
      schedule.orderedAt +
      ' | ShipBy: ' +
      schedule.shipBy +
      ' | EstDelivery: ' +
      schedule.estimatedDelivery +
      ' | Deliver To: ' +
      customerName +
      ' (' +
      customerPhone +
      ') - ' +
      shippingAddress +
      ' [PIN: ' +
      cleanPin +
      '] [' +
      paymentMode +
      ']';

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

    setCart([]);
    setAppliedCoupon(null);
    setShowCart(false);

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
        @keyframes auraReveal {
          0% { opacity: 0; transform: scale(0.82) translateY(16px); letter-spacing: 0.45em; }
          65% { opacity: 1; transform: scale(1.04) translateY(0); letter-spacing: 0.22em; }
          100% { opacity: 1; transform: scale(1) translateY(0); letter-spacing: 0.26em; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.92); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(0.92); opacity: 0.75; }
        }
        @keyframes checkPop {
          0% { transform: scale(0.3) rotate(-18deg); opacity: 0; }
          70% { transform: scale(1.12) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .aura-title-anim {
          animation: auraReveal 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .aura-ring-anim {
          animation: pulseRing 2s ease-in-out infinite;
        }
        .check-pop-anim {
          animation: checkPop 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {showIntro && (
        <div
          className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-6 transition-opacity duration-500 ${
            introFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute w-52 h-52 rounded-full border border-emerald-500/30 aura-ring-anim" />
            <div className="w-40 h-40 rounded-full border border-zinc-800 bg-zinc-950/90 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.22)]">
              <span className="font-serif font-black text-5xl tracking-[0.22em] text-white aura-title-anim">
                AURA
              </span>
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.35em] text-emerald-400">
              INITIALIZING TECHNICAL STOREFRONT
            </p>
          </div>
        </div>
      )}

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
                <span className="text-emerald-200">TOTAL PAID / COD:</span>
                <span className="font-bold">
                  ₹{orderPlacedScreen.total} ({orderPlacedScreen.payment})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderPlacedScreen(null)}
                className="px-6 py-3 bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition"
              >
                Continue Exploring AURA
              </button>
              <a
                href="/orders"
                className="px-6 py-3 bg-white text-emerald-700 text-xs font-bold uppercase tracking-widest hover:bg-emerald-50 transition"
              >
                Track in My Orders →
              </a>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/40 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-zinc-950 border-b border-zinc-800 text-zinc-300 font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 flex items-center justify-between gap-2">
        <span className="truncate text-emerald-400">
          {settings.announcement}
        </span>
        <div className="flex items-center gap-4 shrink-0 font-semibold">
          <button
            type="button"
            onClick={replayAuraIntro}
            className="hover:text-emerald-400 transition uppercase"
          >
            REPLAY AURA
          </button>
          <a href="/orders" className="hover:text-white transition">
            TRACK ORDER
          </a>
          <a href="/admin" className="hover:text-emerald-400 transition">
            ADMIN
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/90">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={replayAuraIntro}
            className="flex items-center gap-2.5 text-left group"
          >
            <span className="w-2.5 h-2.5 bg-emerald-500 rotate-45 group-hover:rotate-90 transition-transform" />
            <span className="text-xl md:text-2xl font-serif font-black tracking-[0.18em] text-white">
              {settings.logo_text}
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7 font-mono text-xs uppercase tracking-widest text-zinc-400">
            <a
              href="/"
              className="text-emerald-400 border-b border-emerald-500 pb-0.5"
            >
              HOME
            </a>
            <a href="#shop" className="hover:text-white transition">
              CATALOG
            </a>
            <a href="/orders" className="hover:text-white transition">
              MY ORDERS
            </a>
            <a href="/admin" className="hover:text-white transition">
              ADMIN
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
              className="p-2 border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-emerald-500/60 hover:text-white transition"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setShowWishlistOnly(!showWishlistOnly);
                const shopEl = document.getElementById('shop');
                if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative p-2 border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-emerald-500/60 hover:text-white transition"
              title="Wishlist"
            >
              <Heart
                className={
                  showWishlistOnly
                    ? 'w-4 h-4 fill-rose-500 text-rose-500'
                    : 'w-4 h-4'
                }
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <a
              href="/admin"
              title="Admin"
              className="p-2 border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-emerald-500/60 hover:text-white transition"
            >
              <User className="w-4 h-4" />
            </a>

            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 border border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:border-emerald-500/60 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cart.length}
              </span>
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-zinc-800/80 px-4 py-2 flex justify-around font-mono text-[10px] uppercase tracking-widest text-zinc-300 bg-zinc-950">
          <a href="#shop">Catalog</a>
          <a href="/orders">My Orders</a>
          <a href="/admin">Admin</a>
        </div>

        {showSearch && (
          <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 shadow-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-xl mx-auto flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCategory('All');
                  setShowWishlistOnly(false);
                }}
                placeholder="Search shirt, sandle, shoes, boots, hoodie..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-zinc-400 hover:text-white px-1"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-500 text-black text-[11px] font-black uppercase tracking-wider shrink-0"
              >
                Search
              </button>
            </form>

            {searchQuery.trim() !== '' && (
              <div className="max-w-xl mx-auto mt-3 border-t border-zinc-800 pt-2 max-h-80 overflow-y-auto space-y-2">
                {matchedCategories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-zinc-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Categories:
                    </span>
                    {matchedCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSearchQuery('');
                          setShowSearch(false);
                          const shopEl = document.getElementById('shop');
                          if (shopEl)
                            shopEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-500 hover:text-black text-white text-[10px] font-mono uppercase tracking-wider transition"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                <div className="divide-y divide-zinc-800/80">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSearch(false);
                          openProductModal(item);
                        }}
                        className="flex items-center justify-between gap-3 py-2.5 px-1 hover:bg-zinc-900 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-11 h-11 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] font-mono text-zinc-400">
                              {item.category} • ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 shrink-0">
                          Inspect →
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-3 text-center space-y-2">
                      <p className="text-xs font-mono text-zinc-400">
                        No item matches &ldquo;{searchQuery}&rdquo; in active
                        inventory.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                          setShowSearch(false);
                          const shopEl = document.getElementById('shop');
                          if (shopEl)
                            shopEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[11px] font-mono uppercase tracking-wider underline text-emerald-400"
                      >
                        Reset & View All Gear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <section className="relative overflow-hidden border-b border-zinc-800/80 bg-[radial-gradient(circle_at_top_right,#18181b,transparent_55%)]">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AURA SYSTEM v2.6 • PROMO: FLOWIX10</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-tight text-white leading-[1.08]">
              {settings.hero_title}
            </h1>

            <p className="text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed">
              Dark technical apparel, footwear, and precision essentials with
              PIN-based dispatch estimates and live order tracking.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#shop"
                className="px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black transition"
                style={{ backgroundColor: settings.primary_color }}
              >
                ENTER CATALOG
              </a>
              <a
                href="#categories"
                className="px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest border border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-emerald-500/70 transition"
              >
                MODULES
              </a>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-60 h-60 md:w-72 md:h-72 rounded-full border border-zinc-800 bg-zinc-950/90 shadow-[0_0_70px_rgba(16,185,129,0.14)] flex flex-col items-center justify-center relative overflow-hidden">
              <div ref={mountRef} className="w-full h-full" />
              <div className="absolute bottom-3 text-center pointer-events-none">
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                  3D AURA EMBLEM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>24–48H DISPATCH</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VERIFIED CHECKOUT</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>TECHNICAL GRADE</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>7-DAY RETURNS</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>LIVE ORDER LOG</span>
          </div>
        </div>
      </section>

      <section id="categories" className="max-w-6xl mx-auto px-4 py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
          MODULES
        </p>
        <h2 className="text-2xl md:text-3xl font-serif text-white mt-1 mb-8">
          Browse by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setShowWishlistOnly(false);
                const shopEl = document.getElementById('shop');
                if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 overflow-hidden transition"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base text-white">
                    {cat.name}
                  </h3>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 mt-0.5">
                    {cat.count}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              {showWishlistOnly ? 'SAVED UNITS' : 'ACTIVE INVENTORY'}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-white mt-1">
              {searchQuery
                ? 'Search Results for "' + searchQuery + '"'
                : selectedCategory === 'All'
                ? 'All Products'
                : selectedCategory}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowWishlistOnly(false);
                }}
                className={
                  selectedCategory === cat && !showWishlistOnly
                    ? 'px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition bg-emerald-500 text-black border-emerald-500'
                    : 'px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider border transition bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }
              >
                {cat}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-200 focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-10 text-center space-y-3">
            <p className="text-sm font-mono text-zinc-400">
              No matching products found for your current filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowWishlistOnly(false);
              }}
              className="px-5 py-2.5 bg-emerald-500 text-black text-xs font-mono font-bold uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
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
                        onClick={() => toggleWishlist(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/90 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-rose-500"
                        title="Save to Wishlist"
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
                        onClick={() => openProductModal(item)}
                        className="absolute bottom-3 inset-x-3 py-2 bg-zinc-950/95 border border-zinc-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition"
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
                      onClick={() =>
                        addToCartWithDetails(
                          item,
                          item.sizes?.[0] || 'M',
                          'Carbon Black',
                          1
                        )
                      }
                      className="flex-1 py-2.5 text-xs font-mono font-black uppercase tracking-widest text-black transition"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      Buy Now
                    </button>
                    <button
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
        )}
      </section>

      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl grid grid-cols-1 md:grid-cols-2 relative">
            <button
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
                  addToCartWithDetails(
                    activeProduct,
                    selectedSize,
                    selectedColor,
                    modalQty
                  )
                }
                className="w-full py-3 text-xs font-mono font-black uppercase tracking-widest text-black"
                style={{ backgroundColor: settings.primary_color }}
              >
                Add to Bag • ₹{activeProduct.price * modalQty}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-zinc-950 border-l border-zinc-800 w-full max-w-md h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-serif font-bold text-white">
                  AURA Bag & Checkout ({cart.length})
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-sm font-mono text-zinc-400">
                    Your bag is currently empty.
                  </p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="px-5 py-2.5 bg-emerald-500 text-black text-xs font-mono font-bold uppercase tracking-widest"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/70 p-2.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-12 h-12 object-cover bg-zinc-950 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] font-mono text-zinc-400">
                              {item.selectedSize} • {item.selectedColor} • Qty:{' '}
                              {item.qty}
                            </p>
                            <p className="text-xs font-mono font-semibold text-emerald-400">
                              ₹{Number(item.price) * (item.qty || 1)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-xs font-mono text-rose-400 hover:text-rose-300 px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-900 p-3 border border-zinc-800 space-y-2">
                    <label className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Promo Code (Try FLOWIX10)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-1.5 text-xs font-mono border border-zinc-700 bg-zinc-950 text-white uppercase"
                      />
                      <button
                        type="button"
                        onClick={applyCouponCode}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-emerald-500 hover:text-black text-white text-xs font-mono font-bold uppercase transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Dispatch & PIN Details
                    </p>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name *"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 text-white"
                      />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Phone Number *"
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        value={pinCode}
                        onChange={(e) =>
                          setPinCode(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="6-Digit PIN *"
                        className="w-full px-3 py-2 text-xs font-mono bg-zinc-900 border border-zinc-700 text-emerald-300 font-bold"
                      />
                      <input
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="House / Street / Area *"
                        className="sm:col-span-2 w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 text-white"
                      />
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-3 space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PIN: {pinCode || '6-digit PIN'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ships: {liveSchedule.shipBy}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Estimated Delivery: {liveSchedule.estimatedDelivery}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-zinc-700 bg-zinc-900 text-white"
                      >
                        <option value="Cash on Delivery (COD)">
                          Cash on Delivery (COD)
                        </option>
                        <option value="UPI / Online Payment">
                          UPI / Online Payment (Instant)
                        </option>
                      </select>
                    </div>

                    <div className="border-t border-zinc-800 pt-3 space-y-1 font-mono text-xs">
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
                        <span>
                          {shippingFee === 0 ? 'FREE' : '₹' + shippingFee}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-zinc-800">
                        <span>Total</span>
                        <span>₹{grandTotal}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={ordering}
                      className="w-full py-3 text-xs font-mono font-black uppercase tracking-widest text-black"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      {ordering ? 'PROCESSING...' : 'PLACE ORDER'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-10 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif font-bold tracking-[0.18em] text-white text-base">
              {settings.logo_text}
            </p>
            <p className="font-mono text-[11px] text-zinc-500 mt-1">
              {settings.store_name} • Technical Dark Edition
            </p>
          </div>
          <div className="flex gap-6 font-mono uppercase tracking-wider font-semibold">
            <a href="#shop" className="hover:text-white">
              Catalog
            </a>
            <a href="/orders" className="hover:text-white">
              Track Order
            </a>
            <a href="/admin" className="hover:text-white">
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
