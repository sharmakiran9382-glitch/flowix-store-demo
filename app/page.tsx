'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  ShoppingBag,
  Search,
  Heart,
  X,
  Plus,
  Minus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  Menu,
  Eye,
  Award,
  Cpu,
  Layers,
  MapPin,
  Calendar,
  Mail,
  User,
  LogOut,
  SlidersHorizontal,
  ArrowUpRight,
  Ruler,
  RotateCw,
  Box,
} from 'lucide-react';

function AuraBrandLogo({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AURA Cloth Store"
    >
      <defs>
        <linearGradient id="auraGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7dfc2" />
          <stop offset="55%" stopColor="#d4a373" />
          <stop offset="100%" stopColor="#b07d4f" />
        </linearGradient>
        <linearGradient id="auraTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>

      <g transform="translate(4, 5)">
        <path
          d="M24 6 L9 44 H15.5 L18.2 37 H29.8 L32.5 44 H39 L24 6 Z M20.5 31.5 L24 21.5 L27.5 31.5 H20.5 Z"
          fill="url(#auraGold)"
        />
        <path
          d="M5 36 C16 38, 30 30, 44 15 C37 29, 24 41, 5 42 Z"
          fill="url(#auraTeal)"
        />
        <path
          d="M44 9 L45.8 13.2 L50 15 L45.8 16.8 L44 21 L42.2 16.8 L38 15 L42.2 13.2 Z"
          fill="#fae5ca"
        />
      </g>

      <text
        x="62"
        y="33"
        fill="url(#auraGold)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="5"
      >
        AURA
      </text>
      <text
        x="63"
        y="48"
        fill="#e4e4e7"
        fontFamily="monospace, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="3.4"
      >
        CLOTH STORE
      </text>
    </svg>
  );
}

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  mrp?: number;
  image_url: string;
  description?: string;
  sizes?: string[];
  rating?: number;
  reviews?: number;
  badge?: string;
}

interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  qty: number;
}

interface OrderRecord {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  pin_code: string;
  payment_method: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
  ship_by?: string;
  est_delivery?: string;
  cancel_reason?: string;
}

interface ThemeConfig {
  accentPreset: 'emerald' | 'gold' | 'cyan';
  showIntro: boolean;
  bannerText: string;
  heroBadge: string;
}

interface SizeRow {
  size: string;
  chest: string;
  length: string;
  shoulder: string;
}

const DEFAULT_THEME: ThemeConfig = {
  accentPreset: 'emerald',
  showIntro: true,
  bannerText:
    'FREE EXPRESS SHIPPING ABOVE ₹1,999 • USE CODE FLOWIX10 FOR 10% OFF',
  heroBadge: 'AUTUMN / WINTER TECHNICAL RELEASE',
};

const DEFAULT_SIZE_CHART: SizeRow[] = [
  { size: 'S', chest: '38 in', length: '27.0 in', shoulder: '19.5 in' },
  { size: 'M', chest: '40 in', length: '28.0 in', shoulder: '20.5 in' },
  { size: 'L', chest: '42 in', length: '29.0 in', shoulder: '21.5 in' },
  { size: 'XL', chest: '44 in', length: '30.0 in', shoulder: '22.5 in' },
];

export default function AuraStorefrontPage() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME);
  const [sizeChart, setSizeChart] = useState<SizeRow[]>(DEFAULT_SIZE_CHART);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  // 3D Interactive Showcase State
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [showcaseMode, setShowcaseMode] = useState<'visual' | 'specs'>(
    'visual'
  );
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  const defaultProducts: Product[] = [
    {
      id: 1,
      title: 'AURA 260GSM Core Boxy Tee',
      category: 'Tshirts',
      price: 1299,
      mrp: 1799,
      rating: 4.8,
      reviews: 124,
      badge: 'BESTSELLER',
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
      badge: 'NEW DROP',
      sizes: ['XS', 'S', 'M', 'L'],
      description:
        'Architectural outerwear with wind-resistant finish and precision matte hardware.',
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
      badge: 'LIMITED',
      sizes: ['One Size'],
      description:
        'Precision monochrome timepiece paired with UV400 tinted technical eyewear.',
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
      badge: 'HOT DEAL',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description:
        'Dense brushed interior with double-layered hood and articulated sleeve seams.',
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
      badge: 'NEW DROP',
      sizes: ['M', 'L', 'XL'],
      description:
        '13oz washed technical jacket with tactical chest pockets and dark alloy buttons.',
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
      badge: 'TRENDING',
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
      rating: 4.9,
      reviews: 178,
      badge: 'BESTSELLER',
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
      description:
        'High-rebound midsole sneakers with breathable mesh and grip outsole.',
      image_url:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 8,
      title: 'AURA Tactical Everyday Carry Pack',
      category: 'Accessories',
      price: 1899,
      mrp: 2499,
      rating: 4.8,
      reviews: 77,
      badge: 'UTILITY',
      sizes: ['One Size'],
      description:
        'Water-repellent structured pack with quick-access compartments.',
      image_url:
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [pinCode, setPinCode] = useState<string>('');
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    label: string;
  } | null>(null);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Carbon Black');
  const [modalQty, setModalQty] = useState<number>(1);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(null);

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'profile' | 'orders'>('profile');
  const [accountUser, setAccountUser] = useState<{
    name: string;
    email: string;
    phone: string;
    defaultPin: string;
    defaultAddress: string;
  } | null>(null);
  const [authNameInput, setAuthNameInput] = useState('');
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authPhoneInput, setAuthPhoneInput] = useState('');
  const [authPinInput, setAuthPinInput] = useState('');
  const [authAddressInput, setAuthAddressInput] = useState('');

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [trackEmailFilter, setTrackEmailFilter] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [cancelReasonInput, setCancelReasonInput] = useState(
    'Changed my mind / Ordered by mistake'
  );

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const shopSectionRef = useRef<HTMLElement | null>(null);

  const accent =
    themeConfig.accentPreset === 'gold'
      ? {
          text: 'text-amber-300',
          bg: 'bg-amber-400',
          bgHover: 'hover:bg-amber-300',
          border: 'border-amber-400',
          pill: 'bg-amber-400/15 border-amber-400/40 text-amber-300',
        }
      : themeConfig.accentPreset === 'cyan'
      ? {
          text: 'text-cyan-400',
          bg: 'bg-cyan-400',
          bgHover: 'hover:bg-cyan-300',
          border: 'border-cyan-400',
          pill: 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300',
        }
      : {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500',
          bgHover: 'hover:bg-emerald-400',
          border: 'border-emerald-500',
          pill: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
        };

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  }

  function dismissIntro() {
    setIntroFading(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 450);
  }

  useEffect(() => {
    let shouldShow = true;
    try {
      const rawTheme = localStorage.getItem('flowix_theme_config');
      if (rawTheme) {
        const parsed = { ...DEFAULT_THEME, ...JSON.parse(rawTheme) };
        setThemeConfig(parsed);
        shouldShow = parsed.showIntro !== false;
        setShowIntro(shouldShow);
      }

      const rawSizes = localStorage.getItem('flowix_size_chart');
      if (rawSizes) {
        const parsedSizes = JSON.parse(rawSizes);
        if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
          setSizeChart(parsedSizes);
        }
      }
    } catch {}

    if (!shouldShow) return;

    const timer1 = setTimeout(() => {
      setIntroFading(true);
    }, 1500);
    const timer2 = setTimeout(() => {
      setShowIntro(false);
    }, 1950);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  function normalizeProduct(raw: any): Product {
    let parsedTitle = raw.title || 'AURA Essential';
    let parsedMrp = raw.mrp || Math.round(Number(raw.price || 999) * 1.3);
    let parsedSizes = raw.sizes || ['S', 'M', 'L', 'XL'];
    let parsedDesc =
      raw.description ||
      'Precision-crafted AURA technical apparel engineered for durability and fit.';

    if (typeof raw.title === 'string' && raw.title.includes('||')) {
      const parts = raw.title.split('||');
      parsedTitle = parts[0].trim();
      parsedMrp = Number(parts[1]) || parsedMrp;
      parsedSizes = parts[2]
        ? parts[2].split(',').map((s: string) => s.trim())
        : parsedSizes;
      parsedDesc = parts[3] ? parts[3].trim() : parsedDesc;
    }

    return {
      id: raw.id,
      title: parsedTitle,
      category: raw.category || 'Apparel',
      price: Number(raw.price) || 999,
      mrp: parsedMrp,
      image_url:
        raw.image_url ||
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
      description: parsedDesc,
      sizes: parsedSizes,
      rating: raw.rating || 4.8,
      reviews: raw.reviews || 68,
      badge: raw.badge || 'VERIFIED',
    };
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(data.map(normalizeProduct));
      } else {
        setProducts(defaultProducts);
      }
    } catch {
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  }

  function loadLocalOrders(): OrderRecord[] {
    try {
      const raw = localStorage.getItem('flowix_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  function saveLocalOrders(list: OrderRecord[]) {
    try {
      localStorage.setItem('flowix_orders', JSON.stringify(list));
    } catch {}
  }

  async function handleConfirmCancelOrder(orderId: string) {
    const reasonText = cancelReasonInput.trim() || 'Cancelled by customer';
    const updatedList = loadLocalOrders().map((ord) =>
      ord.id === orderId
        ? { ...ord, status: 'Cancelled', cancel_reason: reasonText }
        : ord
    );

    saveLocalOrders(updatedList);
    setOrders(updatedList);

    if (lastOrder?.id === orderId) {
      setLastOrder({
        ...lastOrder,
        status: 'Cancelled',
        cancel_reason: reasonText,
      });
    }

    try {
      await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .ilike('address', `%ID: ${orderId}%`);
    } catch {}

    setCancellingOrderId(null);
    setCancelReasonInput('Changed my mind / Ordered by mistake');
    showToast(`Order ${orderId} has been cancelled.`);
  }

  useEffect(() => {
    fetchProducts();
    try {
      const savedCart = localStorage.getItem('aura_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWish = localStorage.getItem('aura_wishlist');
      if (savedWish) setWishlist(JSON.parse(savedWish));

      const savedUser = localStorage.getItem('flowix_account_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setAccountUser(u);
        setCustomerName(u.name || '');
        setCustomerEmail(u.email || '');
        setCustomerPhone(u.phone || '');
        setCustomerAddress(u.defaultAddress || '');
        if (u.defaultPin) setPinCode(u.defaultPin);
      }

      setOrders(loadLocalOrders());
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const categories = [
    'All',
    ...Array.from(
      new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))
    ),
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchesCat =
        selectedCategory === 'All' ||
        (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === '' ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'low') return Number(a.price) - Number(b.price);
      if (sortBy === 'high') return Number(b.price) - Number(a.price);
      return 0;
    });

  function scrollToShop(category?: string) {
    if (category) setSelectedCategory(category);
    setMobileMenuOpen(false);
    setTimeout(() => {
      shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }

  function addToCart(
    product: Product,
    size = 'L',
    color = 'Carbon Black',
    qty = 1
  ) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          selectedColor: color,
          qty,
        },
      ];
    });
    showToast(`${product.title} (${size}) added to AURA bag.`);
  }

  function updateCartQty(index: number, delta: number) {
    setCart((prev) => {
      const copy = [...prev];
      const nextQty = copy[index].qty + delta;
      if (nextQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...copy[index], qty: nextQty };
      }
      return copy;
    });
  }

  function removeCartItem(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      showToast(
        exists ? 'Removed from Saved Archive' : 'Saved to AURA Wishlist'
      );
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  }

  function openQuickView(product: Product) {
    setActiveProduct(product);
    setSelectedSize(product.sizes?.[0] || 'L');
    setSelectedColor('Carbon Black');
    setModalQty(1);
  }

  function handle3DMove(clientX: number, clientY: number, rect: DOMRect) {
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 24;
    const rotateX = (0.5 - py) * 24;
    setTilt({
      x: Number(rotateX.toFixed(2)),
      y: Number(rotateY.toFixed(2)),
      glareX: Math.round(px * 100),
      glareY: Math.round(py * 100),
    });
  }

  function reset3DTilt() {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  function getDynamicDiscount(
    codeRaw: string,
    sub: number
  ): {
    valid: boolean;
    discount: number;
    label: string;
  } {
    const code = codeRaw.trim().toUpperCase();
    if (!code) return { valid: false, discount: 0, label: '' };

    try {
      const customCouponsRaw = localStorage.getItem('flowix_coupons');
      if (customCouponsRaw) {
        const customList = JSON.parse(customCouponsRaw);
        if (Array.isArray(customList)) {
          const found = customList.find(
            (c: any) => (c.code || '').toUpperCase() === code
          );
          if (found) {
            const val = Number(found.value) || 0;
            const disc =
              found.type === 'percent'
                ? Math.round((sub * val) / 100)
                : Math.min(sub, val);
            return {
              valid: true,
              discount: disc,
              label:
                found.type === 'percent'
                  ? `${val}% OFF (${code})`
                  : `₹${val} OFF (${code})`,
            };
          }
        }
      }
    } catch {}

    if (code === 'FLOWIX10' || code === 'AURA10') {
      return {
        valid: true,
        discount: Math.round(sub * 0.1),
        label: `10% OFF (${code})`,
      };
    }
    if (code === 'WELCOME200') {
      const disc = sub >= 999 ? 200 : 100;
      return {
        valid: true,
        discount: Math.min(sub, disc),
        label: `₹${disc} OFF (${code})`,
      };
    }

    return { valid: false, discount: 0, label: '' };
  }

  useEffect(() => {
    if (!appliedCoupon) return;
    const recalc = getDynamicDiscount(appliedCoupon.code, subtotal);
    if (recalc.valid) {
      setAppliedCoupon({
        code: appliedCoupon.code,
        discount: recalc.discount,
        label: recalc.label,
      });
    }
  }, [subtotal]);

  function handleApplyCoupon() {
    const res = getDynamicDiscount(couponInput, subtotal);
    if (!res.valid) {
      showToast('Invalid code. Try FLOWIX10 or WELCOME200');
      return;
    }
    setAppliedCoupon({
      code: couponInput.trim().toUpperCase(),
      discount: res.discount,
      label: res.label,
    });
    showToast(`Coupon applied: ${res.label}`);
  }

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal === 0 || subtotal >= 1999 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  function formatDateShort(dateObj: Date) {
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function getPinDeliveryEstimate(rawPin: string) {
    const clean = rawPin.trim();
    const now = new Date();
    const shipDate = new Date(now);
    shipDate.setDate(now.getDate() + 1);

    const isMetro = /^[145678]/.test(clean);
    const daysToAdd = isMetro ? 4 : 5;
    const delivDate = new Date(now);
    delivDate.setDate(now.getDate() + daysToAdd);

    return {
      zoneLabel: isMetro ? 'Express Metro Corridor' : 'Pan-India Priority',
      shipByText: formatDateShort(shipDate),
      estDeliveryText: formatDateShort(delivDate),
      windowText: isMetro ? '3–4 days' : '4–5 days',
    };
  }

  const pinEstimate =
    pinCode.trim().length === 6 ? getPinDeliveryEstimate(pinCode) : null;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    const cleanPin = pinCode.trim() || '713339';
    const est = getPinDeliveryEstimate(cleanPin);
    const orderId = 'FLX-' + Math.floor(100000 + Math.random() * 900000);
    const nowIso = new Date().toISOString();

    const newOrder: OrderRecord = {
      id: orderId,
      customer_name: customerName.trim() || 'AURA Client',
      email: customerEmail.trim() || 'client@aura.store',
      phone: customerPhone.trim() || '9800000000',
      address: customerAddress.trim() || 'Verified Delivery Address',
      pin_code: cleanPin,
      payment_method: paymentMethod,
      items: cart,
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: finalTotal,
      status: 'Order Confirmed',
      created_at: nowIso,
      ship_by: est.shipByText,
      est_delivery: est.estDeliveryText,
    };

    try {
      await supabase.from('orders').insert([
        {
          customer_name: newOrder.customer_name,
          email: newOrder.email,
          phone: newOrder.phone,
          address: `${newOrder.address} | PIN: ${newOrder.pin_code} | Pay: ${newOrder.payment_method} | ID: ${newOrder.id}`,
          total_amount: newOrder.total,
          status: newOrder.status,
        },
      ]);
    } catch {}

    const updatedOrders = [newOrder, ...loadLocalOrders()];
    saveLocalOrders(updatedOrders);
    setOrders(updatedOrders);
    setLastOrder(newOrder);
    setCart([]);
    setAppliedCoupon(null);
    setCouponInput('');
    setCheckoutStep('success');
  }

  function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!authNameInput.trim() || !authEmailInput.trim()) return;
    const profile = {
      name: authNameInput.trim(),
      email: authEmailInput.trim(),
      phone: authPhoneInput.trim(),
      defaultPin: authPinInput.trim(),
      defaultAddress: authAddressInput.trim(),
    };
    setAccountUser(profile);
    setCustomerName(profile.name);
    setCustomerEmail(profile.email);
    setCustomerPhone(profile.phone);
    setCustomerAddress(profile.defaultAddress);
    if (profile.defaultPin) setPinCode(profile.defaultPin);
    try {
      localStorage.setItem('flowix_account_user', JSON.stringify(profile));
    } catch {}
    showToast('AURA member profile saved!');
  }

  function handleLogoutAccount() {
    setAccountUser(null);
    try {
      localStorage.removeItem('flowix_account_user');
    } catch {}
    showToast('Signed out of member profile.');
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setNewsletterEmail('');
    showToast('Subscribed! Use code WELCOME200 at checkout.');
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const showcaseItems = products.slice(0, 4);
  const current3DItem =
    showcaseItems[showcaseIndex % showcaseItems.length] || defaultProducts[0];

  const visibleOrders = orders.filter((o) => {
    const q = trackEmailFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      (o.email || '').toLowerCase().includes(q) ||
      (o.id || '').toLowerCase().includes(q)
    );
  });

  const timelineSteps = [
    'Order Confirmed',
    'Packed & QC',
    'Shipped',
    'Delivered',
  ];

  function getStepIndex(status: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 3;
    if (s.includes('ship')) return 2;
    if (s.includes('pack') || s.includes('qc')) return 1;
    return 0;
  }

  function canCancelOrder(status: string) {
    const s = (status || '').toLowerCase();
    return (
      !s.includes('cancel') && !s.includes('ship') && !s.includes('deliver')
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {showIntro && (
        <div
          onClick={dismissIntro}
          className={`fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center px-6 text-center cursor-pointer transition-opacity duration-500 ${
            introFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="max-w-xl space-y-5">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-[11px] uppercase tracking-[0.25em] ${accent.pill}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AURA TECHNICAL ATELIER</span>
            </div>

            <div className="flex justify-center py-1">
              <AuraBrandLogo className="h-16 md:h-20 w-auto" />
            </div>

            <p className="text-zinc-400 text-sm md:text-base font-mono tracking-wide">
              Engineered Apparel, Precision Footwear & Everyday Gear.
            </p>

            <div className="pt-2">
              <span className="inline-block text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-1">
                Tap anywhere to enter storefront
              </span>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-[90] bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2.5 max-w-sm">
          <Check className={`w-4 h-4 shrink-0 ${accent.text}`} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] font-mono py-2.5 px-4 text-center tracking-wider border-b border-zinc-800/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>{themeConfig.bannerText}</span>
        <span className="hidden sm:inline text-zinc-700">|</span>
        <button
          type="button"
          onClick={() => {
            setTrackEmailFilter(accountUser?.email || '');
            setIsOrdersModalOpen(true);
          }}
          className={`underline font-semibold ${accent.text}`}
        >
          Track Order
        </button>
      </div>

      {/* MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-zinc-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <a
              href="#top"
              onClick={() => setSelectedCategory('All')}
              className="flex items-center shrink-0"
            >
              <AuraBrandLogo className="h-10 md:h-11 w-auto" />
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <button
              type="button"
              onClick={() => scrollToShop('All')}
              className="hover:text-white transition"
            >
              New Drops
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('Men')}
              className="hover:text-white transition"
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('Women')}
              className="hover:text-white transition"
            >
              Women
            </button>
            <a href="#showcase-3d" className="hover:text-white transition">
              3D Studio
            </a>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="hover:text-white transition"
            >
              Size Chart
            </button>
            <a
              href="/admin"
              className={`font-bold transition ${accent.text}`}
            >
              Admin
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setAccountTab('profile');
                setIsAccountOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-zinc-800 bg-zinc-900 hover:border-zinc-600 text-zinc-200 transition"
            >
              <User className={`w-3.5 h-3.5 ${accent.text}`} />
              <span>{accountUser ? accountUser.name.split(' ')[0] : 'Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-zinc-300 hover:text-white transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={`relative inline-flex items-center gap-2 text-black px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition ${accent.bg} ${accent.bgHover}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 space-y-2.5 text-xs font-mono uppercase tracking-wider text-zinc-300">
            <button
              type="button"
              onClick={() => scrollToShop('All')}
              className="block w-full text-left py-1.5"
            >
              New Drops
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('Men')}
              className="block w-full text-left py-1.5"
            >
              Men Collection
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('Women')}
              className="block w-full text-left py-1.5"
            >
              Women Collection
            </button>
            <a
              href="#showcase-3d"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-1.5"
            >
              3D Interactive Studio
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSizeGuideOpen(true);
              }}
              className="block w-full text-left py-1.5"
            >
              Size Chart
            </button>
            <div className="pt-2 border-t border-zinc-800 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAccountOpen(true);
                }}
                className="text-zinc-200 underline"
              >
                {accountUser ? `Account (${accountUser.name})` : 'Member Account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOrdersModalOpen(true);
                }}
                className={`underline ${accent.text}`}
              >
                Track Orders
              </button>
              <a href="/admin" className={`font-bold underline ${accent.text}`}>
                Admin Console
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        id="top"
        className="relative bg-zinc-950 text-white overflow-hidden border-b border-zinc-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{themeConfig.heroBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.08] text-white">
              Precision silhouettes built for daily motion.
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Heavyweight 260 GSM tees, structured outerwear, cushioned
              footwear, and everyday accessories—crafted with clean proportions
              and dependable dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToShop('All')}
                className={`px-7 py-3.5 text-black text-xs font-mono font-black uppercase tracking-widest transition ${accent.bg} ${accent.bgHover}`}
              >
                Shop Collection
              </button>
              <a
                href="#showcase-3d"
                className="px-6 py-3.5 border border-zinc-700 bg-zinc-900/70 text-white text-xs font-mono font-semibold uppercase tracking-widest hover:border-zinc-500 transition inline-flex items-center gap-2"
              >
                <Box className={`w-4 h-4 ${accent.text}`} />
                <span>3D Inspect</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/90 max-w-lg font-mono">
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">24–48h</p>
                <p className="text-[11px] text-zinc-400">Dispatch Window</p>
              </div>
              <div>
                <p className={`text-lg sm:text-xl font-bold ${accent.text}`}>
                  4.9 ★
                </p>
                <p className="text-[11px] text-zinc-400">Verified Rating</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">7-Day</p>
                <p className="text-[11px] text-zinc-400">Easy Size Swap</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div
              onClick={() => scrollToShop('Men')}
              className="cursor-pointer group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-zinc-800"
            >
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80"
                alt="Men Technical Outerwear"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3.5">
                <p
                  className={`text-[10px] font-mono uppercase tracking-widest ${accent.text}`}
                >
                  01 / ARCHIVE
                </p>
                <p className="text-sm font-semibold text-white">Men</p>
              </div>
            </div>

            <div
              onClick={() => scrollToShop('Women')}
              className="cursor-pointer group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-zinc-800 mt-6"
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                alt="Women Architectural Edit"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3.5">
                <p
                  className={`text-[10px] font-mono uppercase tracking-widest ${accent.text}`}
                >
                  02 / EDIT
                </p>
                <p className="text-sm font-semibold text-white">Women</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE 3D ATELIER SHOWCASE */}
      <section
        id="showcase-3d"
        className="border-b border-zinc-800/80 bg-zinc-950/80 py-14"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase tracking-[0.22em] ${accent.text}`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D INTERACTIVE INSPECTOR</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-white">
              Move cursor or drag to tilt in 3D space
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Inspect AURA garments with live 3D perspective tilt, dynamic
              surface lighting, and flip-card technical fabric specs before
              adding to bag.
            </p>

            {/* Garment Selector Pills */}
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              {showcaseItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setShowcaseIndex(idx);
                    setShowcaseMode('visual');
                  }}
                  className={`px-3 py-1.5 border uppercase text-[11px] transition ${
                    showcaseIndex === idx
                      ? `${accent.bg} text-black ${accent.border} font-bold`
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  0{idx + 1} • {item.category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() =>
                  setShowcaseMode(
                    showcaseMode === 'visual' ? 'specs' : 'visual'
                  )
                }
                className="px-4 py-2.5 border border-zinc-700 bg-zinc-900 text-white uppercase font-bold inline-flex items-center gap-2 hover:border-zinc-500"
              >
                <RotateCw className={`w-3.5 h-3.5 ${accent.text}`} />
                <span>
                  {showcaseMode === 'visual'
                    ? 'Flip to Spec Blueprint'
                    : 'Flip to 3D Visual'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="px-4 py-2.5 border border-zinc-800 bg-zinc-950 text-zinc-300 uppercase inline-flex items-center gap-1.5 hover:text-white"
              >
                <Ruler className={`w-3.5 h-3.5 ${accent.text}`} />
                <span>Size Chart</span>
              </button>
            </div>
          </div>

          {/* 3D PERSPECTIVE TILT STAGE */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              style={{ perspective: '1100px' }}
              className="w-full max-w-md"
            >
              <div
                onMouseMove={(e) =>
                  handle3DMove(
                    e.clientX,
                    e.clientY,
                    e.currentTarget.getBoundingClientRect()
                  )
                }
                onMouseLeave={reset3DTilt}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    handle3DMove(
                      e.touches[0].clientX,
                      e.touches[0].clientY,
                      e.currentTarget.getBoundingClientRect()
                    );
                  }
                }}
                onTouchEnd={reset3DTilt}
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                  transition:
                    tilt.x === 0 && tilt.y === 0
                      ? 'transform 0.45s ease-out'
                      : 'transform 0.08s linear',
                }}
                className="relative bg-zinc-900 border border-zinc-700/90 p-5 shadow-2xl select-none cursor-grab active:cursor-grabbing"
              >
                {/* Dynamic Specular Glare */}
                <div
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.14), transparent 60%)`,
                  }}
                  className="pointer-events-none absolute inset-0 z-20"
                />

                {showcaseMode === 'visual' ? (
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] bg-zinc-950 border border-zinc-800 overflow-hidden">
                      <img
                        src={current3DItem.image_url}
                        alt={current3DItem.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 text-black font-mono text-[10px] font-black uppercase ${accent.bg}`}
                      >
                        3D LIVE VIEW • {current3DItem.category}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-zinc-950/90 border border-zinc-700 font-mono text-[10px] text-zinc-300">
                        X:{tilt.x}° Y:{tilt.y}°
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-serif text-white">
                          {current3DItem.title}
                        </h3>
                        <p className="font-mono text-xs text-zinc-400">
                          ₹{current3DItem.price}{' '}
                          {current3DItem.mrp && (
                            <span className="line-through text-zinc-600 ml-1">
                              ₹{current3DItem.mrp}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            current3DItem,
                            current3DItem.sizes?.[0] || 'L',
                            'Carbon Black',
                            1
                          )
                        }
                        className={`px-4 py-2.5 text-black font-mono text-xs font-black uppercase tracking-wider ${accent.bg}`}
                      >
                        + Add Bag
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between font-mono text-xs">
                    <div className="space-y-2">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-bold ${accent.text}`}
                      >
                        TECHNICAL SPECIFICATION SHEET
                      </span>
                      <h3 className="text-lg font-serif text-white">
                        {current3DItem.title}
                      </h3>
                      <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                        {current3DItem.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2 text-[11px]">
                      <div className="bg-zinc-900 border border-zinc-800 p-2.5">
                        <span className="text-zinc-500 block">DIVISION</span>
                        <span className="text-white font-bold">
                          {current3DItem.category}
                        </span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-2.5">
                        <span className="text-zinc-500 block">SIZES</span>
                        <span className="text-white font-bold">
                          {(current3DItem.sizes || ['S', 'M', 'L', 'XL']).join(
                            ' / '
                          )}
                        </span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-2.5">
                        <span className="text-zinc-500 block">DISPATCH</span>
                        <span className={accent.text}>24–48 HRS</span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-2.5">
                        <span className="text-zinc-500 block">RATING</span>
                        <span className="text-white font-bold">
                          {current3DItem.rating || 4.9} ★ Verified
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION STRIP */}
      <section className="border-b border-zinc-800/80 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Truck className={`w-4 h-4 shrink-0 ${accent.text}`} />
            <div>
              <p className="font-bold text-white">Fast PIN Dispatch</p>
              <p className="text-zinc-400 text-[11px]">3–5 day delivery window</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className={`w-4 h-4 shrink-0 ${accent.text}`} />
            <div>
              <p className="font-bold text-white">7-Day Returns</p>
              <p className="text-zinc-400 text-[11px]">Hassle-free size exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-4 h-4 shrink-0 ${accent.text}`} />
            <div>
              <p className="font-bold text-white">Quality Inspected</p>
              <p className="text-zinc-400 text-[11px]">High-GSM fabric & trim</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className={`w-4 h-4 shrink-0 ${accent.text}`} />
            <div>
              <p className="font-bold text-white">Transparent Pricing</p>
              <p className="text-zinc-400 text-[11px]">Live coupon & COD support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SPOTLIGHT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className={`text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
            >
              CURATED DIVISIONS
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => scrollToShop('All')}
            className="text-xs font-mono uppercase tracking-wider underline underline-offset-4 text-zinc-300 hover:text-white"
          >
            View All ({products.length})
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'Tshirts',
              label: 'Boxy Tees',
              img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
            },
            {
              name: 'Hoodies',
              label: 'Tech Fleece',
              img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80',
            },
            {
              name: 'Footwear',
              label: 'Sneakers',
              img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
            },
            {
              name: 'Accessories',
              label: 'Carry & Optics',
              img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
            },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() => scrollToShop(cat.name)}
              className="group cursor-pointer relative aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest ${accent.text}`}
                >
                  {cat.name}
                </span>
                <span className="text-white font-semibold text-base flex items-center justify-between">
                  {cat.label}
                  <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN PRODUCT CATALOG SECTION */}
      <section
        id="shop"
        ref={shopSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <p
              className={`text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
            >
              LIVE CATALOG
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-white mt-0.5">
              {selectedCategory === 'All'
                ? 'All Releases'
                : `${selectedCategory} Collection`}{' '}
              <span className="text-base font-mono text-zinc-400">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs font-mono">
              <SlidersHorizontal className={`w-3.5 h-3.5 ${accent.text}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-zinc-900">
                  Featured
                </option>
                <option value="low" className="bg-zinc-900">
                  Price: Low to High
                </option>
                <option value="high" className="bg-zinc-900">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {categories.map((cat) => {
            const active =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap border transition ${
                  active
                    ? `${accent.bg} text-black ${accent.border} font-bold`
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="border border-zinc-800 bg-zinc-900 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-[4/5] bg-zinc-800 w-full" />
                <div className="h-4 bg-zinc-800 w-3/4" />
                <div className="h-4 bg-zinc-800 w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-zinc-800 bg-zinc-900/60 mt-4 space-y-3">
            <p className="font-serif text-lg text-white">
              No matching products found
            </p>
            <p className="text-xs font-mono text-zinc-400">
              Try clearing your search or switching categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className={`px-5 py-2.5 text-black text-xs font-mono font-bold uppercase tracking-wider ${accent.bg}`}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {filteredProducts.map((product) => {
              const isWished = wishlist.includes(product.id);
              const discountPct =
                product.mrp && product.mrp > product.price
                  ? Math.round(
                      ((product.mrp - product.price) / product.mrp) * 100
                    )
                  : 0;

              return (
                <div
                  key={product.id}
                  className="group bg-zinc-900/90 border border-zinc-800 hover:border-zinc-600 flex flex-col justify-between transition"
                >
                  <div>
                    <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        onClick={() => openQuickView(product)}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 cursor-pointer group-hover:scale-105 transition duration-500"
                      />

                      {discountPct > 0 && (
                        <span
                          className={`absolute top-2.5 left-2.5 text-black text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider ${accent.bg}`}
                        >
                          -{discountPct}%
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Save item"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-zinc-950/90 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-rose-500 transition"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWished ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => openQuickView(product)}
                        className="opacity-0 group-hover:opacity-100 transition absolute bottom-2.5 inset-x-2.5 bg-zinc-950/95 border border-zinc-700 text-white py-2 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Eye className={`w-3.5 h-3.5 ${accent.text}`} />
                        <span>Quick View</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span
                          className={`uppercase tracking-wider font-semibold ${accent.text}`}
                        >
                          {product.category}
                        </span>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {product.rating || '4.8'} ({product.reviews || 64})
                        </span>
                      </div>

                      <h3
                        onClick={() => openQuickView(product)}
                        className="font-medium text-sm text-white line-clamp-1 cursor-pointer hover:underline"
                      >
                        {product.title}
                      </h3>

                      <div className="flex items-baseline gap-2 pt-0.5 font-mono">
                        <span className="text-sm font-bold text-white">
                          ₹{product.price}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-xs text-zinc-500 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          product,
                          product.sizes?.[0] || 'L',
                          'Carbon Black',
                          1
                        )
                      }
                      className={`flex-1 py-2.5 text-black text-[11px] font-mono font-bold uppercase tracking-wider transition ${accent.bg} ${accent.bgHover}`}
                    >
                      Add to Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => openQuickView(product)}
                      className="px-3 py-2.5 border border-zinc-700 bg-zinc-950 text-[11px] font-mono text-zinc-200 hover:border-zinc-500 transition"
                    >
                      Size
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* EDITORIAL STORY & ARCHITECTURE SECTION */}
      <section
        id="story"
        className="bg-zinc-950 text-white py-16 border-t border-b border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p
              className={`text-[11px] font-mono uppercase tracking-[0.25em] ${accent.text}`}
            >
              CRAFTED BY FLOWIX STUDIO
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif leading-tight">
              Built like software. Worn like second skin.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every AURA piece is planned with clear specifications—from fabric
              GSM and stitch density to real-time order tracking and seamless
              returns. Designed to look sharp on screen and hold up in real
              life.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-3 text-xs font-mono">
              <div className="border border-zinc-800 bg-zinc-900/70 p-3.5">
                <Cpu className={`w-4 h-4 mb-1.5 ${accent.text}`} />
                <p className="font-semibold text-white">Modern Commerce Stack</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  Fast page loads & instant bag sync
                </p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/70 p-3.5">
                <Layers className={`w-4 h-4 mb-1.5 ${accent.text}`} />
                <p className="font-semibold text-white">Structured Fit System</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  Consistent sizing across drops
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
              alt="Studio Rack"
              className="aspect-[4/5] object-cover w-full border border-zinc-800"
            />
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
              alt="Minimalist Wardrobe"
              className="aspect-[4/5] object-cover w-full border border-zinc-800 mt-6"
            />
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-lg">
            <p
              className={`text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
            >
              EARLY ACCESS DISPATCH
            </p>
            <h3 className="text-2xl font-serif text-white">
              Get drop alerts & ₹200 welcome code
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              No spam. Only limited restocks, seasonal drops, and member offers.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full md:w-auto gap-2"
          >
            <div className="relative flex-1 sm:w-64">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className={`px-5 py-2.5 text-black text-xs font-mono font-bold uppercase tracking-wider transition whitespace-nowrap ${accent.bg} ${accent.bgHover}`}
            >
              Join List
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <AuraBrandLogo className="h-10 w-auto" />
            <p className="text-zinc-400 leading-relaxed">
              Modern technical apparel, footwear, and everyday essentials
              powered by Flowix Studio.
            </p>
          </div>

          <div className="space-y-2.5 font-mono">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Shop
            </p>
            <button
              type="button"
              onClick={() => scrollToShop('All')}
              className="block hover:text-white"
            >
              All Products
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('Men')}
              className="block hover:text-white"
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => scrollToShop('Women')}
              className="block hover:text-white"
            >
              Women
            </button>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="block hover:text-white"
            >
              Size Chart
            </button>
          </div>

          <div className="space-y-2.5 font-mono">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Customer Care
            </p>
            <button
              type="button"
              onClick={() => {
                setTrackEmailFilter(accountUser?.email || '');
                setIsOrdersModalOpen(true);
              }}
              className="block hover:text-white"
            >
              Track & Cancel Order
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountTab('profile');
                setIsAccountOpen(true);
              }}
              className="block hover:text-white"
            >
              Member Account
            </button>
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="block hover:text-white"
            >
              Saved Wishlist ({wishlist.length})
            </button>
            <a href="/admin" className={`block hover:underline ${accent.text}`}>
              Admin Console
            </a>
          </div>

          <div className="space-y-2.5 font-mono">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Policies & Info
            </p>
            <p>Shipping: 3–5 business days</p>
            <p>Returns: 7-day easy exchange</p>
            <p>Promo: FLOWIX10 / WELCOME200</p>
          </div>
        </div>

        <div className="border-t border-zinc-900 py-5 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} AURA. All rights reserved.</p>
          <p>Built & maintained by Flowix Studio</p>
        </div>
      </footer>

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full p-6 space-y-4 shadow-2xl relative font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <p
                className={`text-[10px] uppercase tracking-[0.2em] ${accent.text}`}
              >
                AURA // FIT SPECIFICATION
              </p>
              <h3 className="text-xl font-serif text-white mt-0.5">
                Garment Size Chart
              </h3>
            </div>

            <div className="overflow-x-auto border border-zinc-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest</th>
                    <th className="py-2.5 px-3">Length</th>
                    <th className="py-2.5 px-3">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {sizeChart.map((row) => (
                    <tr key={row.size}>
                      <td className={`py-2.5 px-3 font-bold ${accent.text}`}>
                        {row.size}
                      </td>
                      <td className="py-2.5 px-3 text-white">{row.chest}</td>
                      <td className="py-2.5 px-3 text-zinc-300">
                        {row.length}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300">
                        {row.shoulder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Relaxed boxy cut. Choose your regular size for a structured
              streetwear drape, or size down for a tailored fit.
            </p>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl grid grid-cols-1 md:grid-cols-2 relative">
            <button
              type="button"
              onClick={() => setActiveProduct(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 flex items-center justify-center hover:text-white"
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
                <span
                  className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${accent.text}`}
                >
                  {activeProduct.category}
                </span>
                <h3 className="text-xl font-serif text-white">
                  {activeProduct.title}
                </h3>

                <div className="flex items-baseline gap-2.5 font-mono">
                  <span className="text-lg font-bold text-white">
                    ₹{activeProduct.price}
                  </span>
                  {activeProduct.mrp && activeProduct.mrp > activeProduct.price && (
                    <span className="text-xs text-zinc-500 line-through">
                      ₹{activeProduct.mrp}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {activeProduct.description}
                </p>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                      Select Size
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className={`text-[11px] font-mono underline flex items-center gap-1 ${accent.text}`}
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Chart</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(activeProduct.sizes || ['S', 'M', 'L', 'XL']).map(
                      (sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 text-xs font-mono border transition ${
                            selectedSize === sz
                              ? `${accent.bg} text-black ${accent.border} font-bold`
                              : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          {sz}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 mb-1.5">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Carbon Black', 'Ivory Mist', 'Slate Olive'].map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setSelectedColor(clr)}
                        className={`px-2.5 py-1 text-xs font-mono border transition ${
                          selectedColor === clr
                            ? `${accent.bg} text-black ${accent.border} font-bold`
                            : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 mb-1.5">
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
                    <span className="px-4 text-xs font-mono font-bold text-white">
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
                onClick={() => {
                  addToCart(
                    activeProduct,
                    selectedSize,
                    selectedColor,
                    modalQty
                  );
                  setActiveProduct(null);
                  setIsCartOpen(true);
                }}
                className={`w-full py-3 text-black text-xs font-mono font-bold uppercase tracking-widest transition ${accent.bg} ${accent.bgHover}`}
              >
                Add to Bag • ₹{activeProduct.price * modalQty}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER SHOPPING BAG DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end">
          <div className="bg-zinc-950 border-l border-zinc-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className={`w-4 h-4 ${accent.text}`} />
                <h3 className="font-serif text-lg text-white">
                  Your Bag ({cartCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-900/70 border-b border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <MapPin className={`w-3.5 h-3.5 ${accent.text}`} />
                  <span>Delivery PIN Estimate</span>
                </span>
                {pinEstimate && (
                  <span className={`font-semibold ${accent.text}`}>
                    {pinEstimate.windowText}
                  </span>
                )}
              </div>
              <input
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={(e) =>
                  setPinCode(e.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter 6-digit PIN code (e.g. 713339)"
                className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              {pinEstimate && (
                <p className="text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                  <Calendar className={`w-3.5 h-3.5 shrink-0 ${accent.text}`} />
                  <span>
                    Ships by <strong>{pinEstimate.shipByText}</strong> • Est.
                    delivery <strong>{pinEstimate.estDeliveryText}</strong>
                  </span>
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <p className="font-serif text-base text-white">
                    Your bag is currently empty
                  </p>
                  <p className="text-xs font-mono text-zinc-400">
                    Explore AURA apparel, footwear, and accessories to get
                    started.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      scrollToShop('All');
                    }}
                    className={`px-5 py-2.5 text-black text-xs font-mono font-bold uppercase tracking-wider ${accent.bg}`}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="flex gap-3.5 border-b border-zinc-800/80 pb-4"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-20 h-24 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeCartItem(idx)}
                          className="text-[11px] font-mono text-zinc-500 hover:text-rose-400"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400">
                        Size: {item.selectedSize} • {item.selectedColor}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="inline-flex items-center border border-zinc-700 bg-zinc-900">
                          <button
                            type="button"
                            onClick={() => updateCartQty(idx, -1)}
                            className="p-1 text-zinc-300 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-semibold text-white">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(idx, 1)}
                            className="p-1 text-zinc-300 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">
                          ₹{Number(item.price) * item.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-zinc-800 bg-zinc-900/90 space-y-3 text-xs font-mono">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (FLOWIX10 / WELCOME200)"
                    className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-zinc-800 border border-zinc-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-700"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div
                    className={`flex items-center justify-between text-[11px] font-semibold ${accent.text}`}
                  >
                    <span>Applied: {appliedCoupon.label}</span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="underline text-zinc-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className={`flex justify-between ${accent.text}`}>
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-zinc-800">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('form');
                    setIsCheckoutOpen(true);
                  }}
                  className={`w-full py-3.5 text-black text-xs font-black uppercase tracking-widest transition ${accent.bg} ${accent.bgHover}`}
                >
                  Proceed to Checkout • ₹{finalTotal}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST MODAL */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-white">
                Saved Wishlist ({wishlistProducts.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {wishlistProducts.length === 0 ? (
              <p className="text-xs font-mono text-zinc-400 py-8 text-center">
                No saved items yet. Tap the heart icon on any product to save
                it here.
              </p>
            ) : (
              <div className="space-y-3">
                {wishlistProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/70 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-14 h-16 object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.title}
                        </p>
                        <p
                          className={`text-xs font-mono font-bold mt-0.5 ${accent.text}`}
                        >
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(
                            item,
                            item.sizes?.[0] || 'L',
                            'Carbon Black',
                            1
                          );
                          setIsWishlistOpen(false);
                          setIsCartOpen(true);
                        }}
                        className={`px-3 py-1.5 text-black text-[11px] font-mono font-bold uppercase ${accent.bg}`}
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT & ORDER CONFIRMATION MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === 'success' && lastOrder ? (
              <div className="text-center py-6 space-y-4">
                <div
                  className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto ${accent.pill}`}
                >
                  <Check className="w-6 h-6" />
                </div>
                <p
                  className={`text-[11px] font-mono uppercase tracking-[0.2em] font-semibold ${accent.text}`}
                >
                  ORDER CONFIRMED • {lastOrder.id}
                </p>
                <h3 className="text-2xl font-serif text-white">
                  Thank you, {lastOrder.customer_name}
                </h3>
                <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Your order will be dispatched to PIN{' '}
                  <strong className="text-white">{lastOrder.pin_code}</strong>.
                  Estimated delivery:{' '}
                  <strong className={accent.text}>
                    {lastOrder.est_delivery}
                  </strong>
                  .
                </p>

                <div className="bg-zinc-900 border border-zinc-800 p-4 text-left text-xs font-mono space-y-1.5 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Order ID:</span>
                    <span className="font-bold text-white">{lastOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment Mode:</span>
                    <span className="font-semibold text-zinc-200">
                      {lastOrder.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Paid / Due:</span>
                    <span className={`font-bold ${accent.text}`}>
                      ₹{lastOrder.total}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap justify-center gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setTrackEmailFilter(lastOrder.email);
                      setIsOrdersModalOpen(true);
                    }}
                    className={`px-5 py-2.5 text-black text-xs font-bold uppercase tracking-wider ${accent.bg}`}
                  >
                    Track This Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-5 py-2.5 border border-zinc-700 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <p
                    className={`text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
                  >
                    AURA EXPRESS CHECKOUT
                  </p>
                  <h3 className="text-2xl font-serif text-white mt-0.5">
                    Shipping & Payment
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Email (for Order Tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) =>
                        setPinCode(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="713339"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="text-xs font-mono">
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="House / Street, Landmark, City, State"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <label className="block text-[11px] font-semibold text-zinc-400">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-2.5 border text-left transition ${
                        paymentMethod === 'COD'
                          ? `${accent.border} bg-zinc-900 text-white font-bold`
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                      }`}
                    >
                      Cash on Delivery (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 border text-left transition ${
                        paymentMethod === 'UPI'
                          ? `${accent.border} bg-zinc-900 text-white font-bold`
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                      }`}
                    >
                      UPI / Instant Pay
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-3.5 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Items ({cartCount})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className={`flex justify-between ${accent.text}`}>
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-zinc-800">
                    <span>Payable Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 text-black text-xs font-black uppercase tracking-widest transition ${accent.bg} ${accent.bgHover}`}
                >
                  Place Order • ₹{finalTotal}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMER ACCOUNT MODAL */}
      {isAccountOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full max-h-[88vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAccountOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <p
                className={`text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
              >
                AURA MEMBER PORTAL
              </p>
              <h3 className="text-xl font-serif text-white mt-0.5">
                {accountUser ? accountUser.name : 'Customer Account'}
              </h3>
            </div>

            <div className="flex gap-2 border-b border-zinc-800 pb-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setAccountTab('profile')}
                className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold ${
                  accountTab === 'profile'
                    ? `${accent.bg} text-black font-bold`
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                Profile & Address
              </button>
              <button
                type="button"
                onClick={() => setAccountTab('orders')}
                className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold ${
                  accountTab === 'orders'
                    ? `${accent.bg} text-black font-bold`
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                Order History ({orders.length})
              </button>
            </div>

            {accountTab === 'profile' ? (
              <form
                onSubmit={handleSaveAccount}
                className="space-y-3 text-xs font-mono"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authNameInput || accountUser?.name || ''}
                    onChange={(e) => setAuthNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmailInput || accountUser?.email || ''}
                      onChange={(e) => setAuthEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Default PIN
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={authPinInput || accountUser?.defaultPin || ''}
                      onChange={(e) =>
                        setAuthPinInput(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="713339"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={authPhoneInput || accountUser?.phone || ''}
                    onChange={(e) => setAuthPhoneInput(e.target.value)}
                    placeholder="Mobile number"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Default Delivery Address
                  </label>
                  <textarea
                    rows={2}
                    value={
                      authAddressInput || accountUser?.defaultAddress || ''
                    }
                    onChange={(e) => setAuthAddressInput(e.target.value)}
                    placeholder="Saved shipping address"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    className={`px-5 py-2.5 text-black font-bold uppercase tracking-wider ${accent.bg}`}
                  >
                    Save Profile
                  </button>
                  {accountUser && (
                    <button
                      type="button"
                      onClick={handleLogoutAccount}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:underline"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs font-mono">
                {orders.length === 0 ? (
                  <p className="text-zinc-400 py-6 text-center">
                    No orders placed yet on this device.
                  </p>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-zinc-800 bg-zinc-900/70 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{ord.id}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            (ord.status || '').toLowerCase().includes('cancel')
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                              : accent.pill
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px]">
                        PIN {ord.pin_code} • Est. Delivery:{' '}
                        <strong className="text-zinc-200">
                          {ord.est_delivery || '3–5 days'}
                        </strong>
                      </p>
                      <p className="font-bold text-white">Total: ₹{ord.total}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIVE ORDER TRACKING & CANCELLATION MODAL */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 max-w-xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setCancellingOrderId(null);
                setIsOrdersModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <p
                className={`text-[11px] font-mono uppercase tracking-[0.2em] ${accent.text}`}
              >
                SHIPMENT TRACKER
              </p>
              <h3 className="text-xl font-serif text-white mt-0.5">
                Track & Manage AURA Orders
              </h3>
            </div>

            <div className="flex gap-2 font-mono text-xs">
              <input
                type="text"
                value={trackEmailFilter}
                onChange={(e) => setTrackEmailFilter(e.target.value)}
                placeholder="Filter by Order ID (FLX-...) or Email"
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              {trackEmailFilter && (
                <button
                  type="button"
                  onClick={() => setTrackEmailFilter('')}
                  className="px-3 py-2 border border-zinc-700 bg-zinc-900 text-xs text-zinc-300"
                >
                  Clear
                </button>
              )}
            </div>

            {visibleOrders.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-400 space-y-2">
                <p>No matching orders found.</p>
                <p className="text-[11px] text-zinc-500">
                  Place an order through checkout to track live delivery
                  progress here.
                </p>
              </div>
            ) : (
              <div className="space-y-4 font-mono">
                {visibleOrders.map((ord) => {
                  const isCancelled = (ord.status || '')
                    .toLowerCase()
                    .includes('cancel');
                  const activeIdx = getStepIndex(ord.status);
                  const allowCancel = canCancelOrder(ord.status);
                  const isConfirmingThis = cancellingOrderId === ord.id;

                  return (
                    <div
                      key={ord.id}
                      className="border border-zinc-800 bg-zinc-900/70 p-4 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-white">{ord.id}</span>
                          <span className="text-zinc-500 ml-2 text-[11px]">
                            {ord.email}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                            isCancelled
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                              : accent.pill
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      {isCancelled ? (
                        <div className="bg-rose-950/35 border border-rose-500/30 p-2.5 text-[11px] text-rose-300">
                          Order cancelled.{' '}
                          {ord.cancel_reason && (
                            <span className="text-zinc-300">
                              Reason: {ord.cancel_reason}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-1 pt-1">
                          {timelineSteps.map((step, sIdx) => (
                            <div key={step} className="space-y-1">
                              <div
                                className={`h-1.5 ${
                                  sIdx <= activeIdx ? accent.bg : 'bg-zinc-800'
                                }`}
                              />
                              <p
                                className={`text-[10px] ${
                                  sIdx <= activeIdx
                                    ? 'font-semibold text-white'
                                    : 'text-zinc-500'
                                }`}
                              >
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                        <span>PIN: {ord.pin_code}</span>
                        <span>
                          Est. Delivery:{' '}
                          <strong className={accent.text}>
                            {isCancelled
                              ? 'Cancelled'
                              : ord.est_delivery || '3–5 days'}
                          </strong>
                        </span>
                        <span className="font-bold text-white">
                          ₹{ord.total}
                        </span>
                      </div>

                      {allowCancel && !isConfirmingThis && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setCancellingOrderId(ord.id);
                              setCancelReasonInput(
                                'Changed my mind / Ordered by mistake'
                              );
                            }}
                            className="px-3 py-1.5 border border-rose-500/40 bg-rose-950/30 text-rose-300 hover:bg-rose-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}

                      {isConfirmingThis && (
                        <div className="bg-zinc-950 border border-rose-500/40 p-3 space-y-2.5 text-[11px]">
                          <p className="text-rose-300 font-bold uppercase">
                            Confirm cancellation for {ord.id}?
                          </p>
                          <select
                            value={cancelReasonInput}
                            onChange={(e) =>
                              setCancelReasonInput(e.target.value)
                            }
                            className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-700 text-white text-xs"
                          >
                            <option value="Changed my mind / Ordered by mistake">
                              Changed my mind / Ordered by mistake
                            </option>
                            <option value="Selected wrong size or color">
                              Selected wrong size or color
                            </option>
                            <option value="Delivery timeline too long">
                              Delivery timeline too long
                            </option>
                            <option value="Want to update shipping address">
                              Want to update shipping address
                            </option>
                          </select>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setCancellingOrderId(null)}
                              className="px-3 py-1.5 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] uppercase"
                            >
                              Keep Order
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmCancelOrder(ord.id)}
                              className="px-3 py-1.5 bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-rose-500"
                            >
                              Confirm Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
