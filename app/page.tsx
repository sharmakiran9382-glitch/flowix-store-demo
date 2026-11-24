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
Sparkles,
CheckCircle2,
} from 'lucide-react';
​export default function HomePage() {
const mountRef = useRef<HTMLDivElement | null>(null);
​// Store Settings State (synced with Supabase store_settings)
const [settings, setSettings] = useState({
store_name: 'Flowix Atelier',
logo_text: 'AURA.',
primary_color: '#1c1917',
hero_title: 'Next-Gen 3D Commerce Experience',
announcement: '🚚 FREE SHIPPING ON ORDERS ABOVE ₹1,999 • USE CODE: FLOWIX10 FOR 10% OFF',
});
​// Products, Category, Sorting & Search State
const [products, setProducts] = useState<any[]>([]);
const [selectedCategory, setSelectedCategory] = useState('All');
const [sortBy, setSortBy] = useState('featured');
const [searchQuery, setSearchQuery] = useState('');
const [showSearch, setShowSearch] = useState(false);
​// Wishlist & Quick View Product Modal State
const [wishlist, setWishlist] = useState<number[]>([]);
const [showWishlistOnly, setShowWishlistOnly] = useState(false);
const [activeProduct, setActiveProduct] = useState<any | null>(null);
const [selectedSize, setSelectedSize] = useState('M');
const [selectedColor, setSelectedColor] = useState('Off-White / Cream');
const [modalQty, setModalQty] = useState(1);
​// Cart, Coupons & Checkout Drawer State
const [cart, setCart] = useState<any[]>([]);
const [showCart, setShowCart] = useState(false);
const [couponInput, setCouponInput] = useState('');
const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
const [availableCoupons, setAvailableCoupons] = useState<any[]>([
{ code: 'FLOWIX10', type: 'percent', value: 10 },
{ code: 'WELCOME200', type: 'flat', value: 200 },
]);
​// Customer Checkout Form State
const [customerName, setCustomerName] = useState('');
const [customerEmail, setCustomerEmail] = useState('');
const [customerPhone, setCustomerPhone] = useState('');
const [shippingAddress, setShippingAddress] = useState('');
const [paymentMode, setPaymentMode] = useState('Cash on Delivery (COD)');
const [ordering, setOrdering] = useState(false);
const [orderSuccessBanner, setOrderSuccessBanner] = useState(false);
​// Clean Toast Notification State (replaces browser alert())
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
​function triggerToast(message: string, type: 'success' | 'error' = 'success') {
setToast({ message, type });
setTimeout(() => {
setToast((prev) => (prev?.message === message ? null : prev));
}, 3500);
}
​// Fallback Demo Products if Supabase table is empty
const defaultProducts = [
{
id: 1,
title: 'Off-White Full-Sleeve Henley',
category: 'Tshirts',
price: 1499,
mrp: 1999,
rating: 4.9,
reviews: 138,
sizes: ['S', 'M', 'L', 'XL'],
description:
'A clean, versatile off-white full-sleeve Henley with a classic button placket. Pairs effortlessly with blue denim and smart footwear for casual outings.',
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
title: 'Minimalist Court Leather Sneakers',
category: 'Sneakers',
price: 3299,
mrp: 4299,
rating: 4.9,
reviews: 176,
sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
description:
'Handcrafted low-top court sneakers with cushioned memory-foam footbed, breathable lining, and durable rubber cupsole.',
image_url:
'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
},
];
​const categories = [
{
name: 'Tshirts',
count: 'ESSENTIALS & HENLEYS',
img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
},
{
name: 'Sneakers',
count: 'FOOTWEAR',
img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
},
{
name: 'Hoodies',
count: 'HEAVYWEIGHT',
img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
},
];
​// Parse packed description/metadata safely from Supabase rows
function normalizeProduct(raw: any) {
const desc =
raw.description ||
'Premium quality piece crafted with attention to fit, durability, and everyday comfort.';
const mrp = raw.mrp || Math.round(Number(raw.price || 999) * 1.3);
const sizes = raw.sizes || ['S', 'M', 'L', 'XL'];
​if (typeof raw.title === 'string' && raw.title.includes('||')) {
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
​return {
...raw,
mrp,
sizes,
description: desc,
rating: raw.rating || 4.8,
reviews: raw.reviews || 58,
};
}
​useEffect(() => {
loadStoreData();
const savedCoupons = localStorage.getItem('flowix_coupons');
if (savedCoupons) {
try {
setAvailableCoupons(JSON.parse(savedCoupons));
} catch {}
}
const savedWishlist = localStorage.getItem('flowix_wishlist');
if (savedWishlist) {
try {
setWishlist(JSON.parse(savedWishlist));
} catch {}
}
}, []);
​// 3D Hero Emblem
useEffect(() => {
if (!mountRef.current) return;
const container = mountRef.current;
const width = container.clientWidth || 220;
const height = container.clientHeight || 220;
​const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
camera.position.z = 3.6;
​const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
container.innerHTML = '';
container.appendChild(renderer.domElement);
​const light1 = new THREE.DirectionalLight(0xffffff, 1.8);
light1.position.set(3, 4, 5);
scene.add(light1);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
​const knot = new THREE.Mesh(
new THREE.TorusKnotGeometry(0.85, 0.24, 120, 16),
new THREE.MeshStandardMaterial({
color: 0x292524,
metalness: 0.45,
roughness: 0.25,
})
);
scene.add(knot);
​let frameId: number;
const animate = () => {
frameId = requestAnimationFrame(animate);
knot.rotation.x += 0.008;
knot.rotation.y += 0.012;
renderer.render(scene, camera);
};
animate();
​return () => {
cancelAnimationFrame(frameId);
renderer.dispose();
};
}, []);
​async function loadStoreData() {
try {
const { data: sData } = await supabase
.from('store_settings')
.select('*')
.eq('id', 1)
.single();
​if (sData) {
setSettings((prev) => ({
...prev,
store_name: sData.store_name || 'Flowix Atelier',
logo_text: sData.logo_text || sData.store_name || 'AURA.',
primary_color: sData.primary_color || '#1c1917',
hero_title: sData.hero_title || 'Next-Gen 3D Commerce Experience',
}));
}
​const { data: pData } = await supabase
.from('products')
.select('*')
.order('id', { ascending: false });
​if (pData && pData.length > 0) {
setProducts(pData.map(normalizeProduct));
} else {
setProducts(defaultProducts);
}
} catch {
setProducts(defaultProducts);
}
}
​function openProductModal(item: any) {
setActiveProduct(item);
setSelectedSize(item.sizes?.[0] || 'M');
setSelectedColor('Off-White / Cream');
setModalQty(1);
}
​function toggleWishlist(id: number) {
setWishlist((prev) => {
const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
localStorage.setItem('flowix_wishlist', JSON.stringify(updated));
triggerToast(
prev.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist',
'success'
);
return updated;
});
}
​function addToCartWithDetails(item: any, size = 'M', color = 'Off-White / Cream', qty = 1) {
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
triggerToast(${item.title} added to bag!, 'success');
}
​function removeFromCart(index: number) {
setCart((prev) => prev.filter((_, idx) => idx !== index));
}
​// Dynamic category pills built from both defaults and uploaded Supabase products
const dynamicCategories = [
'All',
...Array.from(
new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))
),
];
​// Live filtered + sorted products list
const filteredProducts = products
.filter((item) => {
if (showWishlistOnly && !wishlist.includes(item.id)) return false;
​const matchesCat =
selectedCategory === 'All' ||
(item.category || '').toLowerCase() === selectedCategory.toLowerCase();
​const q = searchQuery.trim().toLowerCase();
const matchesSearch =
q === '' ||
(item.title || '').toLowerCase().includes(q) ||
(item.category || '').toLowerCase().includes(q) ||
(item.description || '').toLowerCase().includes(q);
​return matchesCat && matchesSearch;
})
.sort((a, b) => {
if (sortBy === 'low') return Number(a.price) - Number(b.price);
if (sortBy === 'high') return Number(b.price) - Number(a.price);
return 0;
});
​const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);
​function applyCouponCode() {
const code = couponInput.trim().toUpperCase();
if (!code) return;
const found = availableCoupons.find((c) => c.code.toUpperCase() === code);
if (!found) {
triggerToast('Invalid Coupon Code! Try FLOWIX10 or WELCOME200', 'error');
return;
}
const disc =
found.type === 'percent'
? Math.round((subtotal * Number(found.value)) / 100)
: Number(found.value);
setAppliedCoupon({ code: found.code, discount: disc });
triggerToast(Coupon ${found.code} applied! Saved ₹${disc}, 'success');
}
​async function handleCheckout(e: React.FormEvent) {
e.preventDefault();
if (
!customerEmail.trim() ||
!customerName.trim() ||
!customerPhone.trim() ||
!shippingAddress.trim() ||
cart.length === 0
) {
triggerToast('Please fill Name, Phone, Email, and Delivery Address.', 'error');
return;
}
setOrdering(true);
const itemsList = cart
.map((c) => ${c.title} [Size: ${c.selectedSize}, Color: ${c.selectedColor}, Qty: ${c.qty}])
.join(' + ');
const couponNote = appliedCoupon
?  | Coupon: ${appliedCoupon.code} (-₹${appliedCoupon.discount})
: '';
const itemsSummary = ${itemsList}${couponNote} | Deliver To: ${customerName} (${customerPhone}) - ${shippingAddress} [${paymentMode}];
​const { error } = await supabase.from('customer_orders').insert([
{
customer_email: customerEmail.trim(),
items: itemsSummary,
total_amount: grandTotal,
order_status: 'Order Confirmed',
},
]);
​setOrdering(false);
if (error) {
triggerToast('Order failed: ' + error.message, 'error');
} else {
setCart([]);
setAppliedCoupon(null);
setShowCart(false);
setOrderSuccessBanner(true);
triggerToast('Order Confirmed! Track anytime in My Orders.', 'success');
}
}
​return (
<div className="min-h-screen bg-[#f6f5f2] text-stone-900 font-sans">
{/* Floating Toast Notification */}
{toast && (
<div
className={fixed bottom-5 right-5 z-50 px-4 py-3 text-xs font-semibold tracking-wide text-white shadow-lg flex items-center gap-2 transition-all ${ toast.type === 'error' ? 'bg-red-700' : 'bg-stone-900' }}
>
<CheckCircle2 className="w-4 h-4 shrink-0" />
<span>{toast.message}</span>
</div>
)}
​{/* Order Confirmation Banner */}
{orderSuccessBanner && (
<div className="bg-emerald-900 text-white px-4 py-3 text-xs flex items-center justify-between gap-3">
<div className="flex items-center gap-2">
<CheckCircle2 className="w-4 h-4 shrink-0" />
<span>
Your order has been placed successfully! View live status in{' '}
<a href="/orders" className="underline font-bold">
My Orders
</a>
.
</span>
</div>
<button onClick={() => setOrderSuccessBanner(false)} aria-label="Dismiss">
<X className="w-4 h-4" />
</button>
</div>
)}
​{/* Top Announcement Bar */}
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
​{/* Main Editorial Navbar */}
<header className="sticky top-0 z-30 bg-[#f6f5f2]/95 backdrop-blur-md border-b border-stone-200">
<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
<a href="/" className="text-xl md:text-2xl font-bold tracking-tight text-stone-900">
{settings.logo_text}
</a>
​<nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-widest uppercase text-stone-600">
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
​<div className="flex items-center gap-3.5">
<button
onClick={() => setShowSearch(!showSearch)}
aria-label="Search"
className="p-1.5 text-stone-700 hover:text-stone-950"
>
<Search className="w-4 h-4" />
</button>
<button
onClick={() => {
setShowWishlistOnly(!showWishlistOnly);
const shopEl = document.getElementById('shop');
if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
}}
className="relative p-1.5 text-stone-700 hover:text-stone-950"
title="Wishlist"
>
<Heart
className={w-4 h-4 ${ showWishlistOnly ? 'fill-red-600 text-red-600' : '' }}
/>
{wishlist.length > 0 && (
<span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
{wishlist.length}
</span>
)}
</button>
<a href="/admin" title="Admin Settings" className="p-1.5 text-stone-700 hover:text-stone-950">
<User className="w-4 h-4" />
</a>
<button
onClick={() => setShowCart(true)}
className="relative p-1.5 text-stone-700 hover:text-stone-950"
aria-label="Shopping Bag"
>
<ShoppingBag className="w-4 h-4" />
<span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
{cart.length}
</span>
</button>
</div>
</div>
​{/* Mobile Quick Links */}
<div className="md:hidden border-t border-stone-200 px-4 py-2 flex justify-around text-[11px] font-semibold uppercase tracking-wider text-stone-700 bg-white">
<a href="#shop">Shop</a>
<a href="/orders">My Orders</a>
<a href="/admin">Admin Studio</a>
</div>
​{/* Expandable Search Bar with Instant Live Results */}
{showSearch && (
<div className="border-t border-stone-200 bg-white px-4 py-3 shadow-sm">
<form
onSubmit={(e) => {
e.preventDefault();
setSelectedCategory('All');
setShowWishlistOnly(false);
const shopEl = document.getElementById('shop');
if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
}}
className="max-w-xl mx-auto flex items-center gap-2"
>
<Search className="w-4 h-4 text-stone-400 shrink-0" />
<input
type="text"
value={searchQuery}
onChange={(e) => {
setSearchQuery(e.target.value);
if (selectedCategory !== 'All') setSelectedCategory('All');
if (showWishlistOnly) setShowWishlistOnly(false);
}}
placeholder="Search Henley, sneakers, hoodies, categories..."
className="w-full text-sm focus:outline-none"
autoFocus
/>
{searchQuery && (
<button
type="button"
onClick={() => setSearchQuery('')}
className="text-xs text-stone-500 hover:text-stone-900 shrink-0"
>
Clear
</button>
)}
<button
type="submit"
className="text-xs font-bold uppercase tracking-wider bg-stone-900 text-white px-3 py-1.5 shrink-0"
>
Search
</button>
</form>
​{/* Instant Live Dropdown Results */}
{searchQuery.trim() !== '' && (
<div className="max-w-xl mx-auto mt-3 border-t border-stone-100 pt-2 max-h-72 overflow-y-auto divide-y divide-stone-100">
{filteredProducts.length > 0 ? (
filteredProducts.map((item) => (
<div
key={item.id}
onClick={() => {
setShowSearch(false);
openProductModal(item);
}}
className="flex items-center justify-between gap-3 py-2.5 px-1 hover:bg-stone-50 cursor-pointer"
>
<div className="flex items-center gap-3 min-w-0">
<img
src={item.image_url}
alt={item.title}
className="w-11 h-11 object-cover bg-stone-100 shrink-0"
/>
<div className="min-w-0">
<p className="text-xs font-semibold text-stone-900 truncate">
{item.title}
</p>
<p className="text-[11px] text-stone-500">
{item.category} • ₹{item.price}
</p>
</div>
</div>
<span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 shrink-0">
Buy / View →
</span>
</div>
))
) : (
<p className="text-xs text-stone-500 py-3 text-center">
No products found for “{searchQuery}”
</p>
)}
</div>
)}
</div>
)}
</header>
​{/* Editorial Hero Section */}
<section className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
<div className="md:col-span-7 space-y-5">
<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-1.5">
<Sparkles className="w-3.5 h-3.5" /> NEW THIS SEASON • COUPON: FLOWIX10
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
​{/* Right Side 3D Studio Badge */}
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
​{/* Trust Features Strip */}
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
​{/* Browse by Category */}
<section id="categories" className="max-w-6xl mx-auto px-4 py-14">
<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
CURATED COLLECTIONS
</p>
<h2 className="text-2xl md:text-3xl font-serif text-stone-900 mt-1 mb-7">
Browse by Category
</h2>
​<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
{categories.map((cat) => (
<div
key={cat.name}
onClick={() => {
setSelectedCategory(cat.name);
setShowWishlistOnly(false);
const shopEl = document.getElementById('shop');
if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
}}
className="group cursor-pointer relative h-64 overflow-hidden bg-stone-200 border border-stone-200"
>
<img
src={cat.img}
alt={cat.name}
className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
<span className="text-[10px] tracking-widest uppercase text-stone-300">
{cat.count}
</span>
<div className="flex items-center justify-between mt-1">
<h3 className="text-lg font-semibold">{cat.name}</h3>
<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
</div>
</div>
</div>
))}
</div>
</section>
​{/* Main Shop Catalog Grid */}
<section id="shop" className="max-w-6xl mx-auto px-4 pb-20">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5 mb-8">
<div>
<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
{showWishlistOnly ? 'SAVED FAVORITES' : 'SEASONAL CATALOG'}
</p>
<h2 className="text-2xl md:text-3xl font-serif text-stone-900 mt-1">
{showWishlistOnly ? 'Your Wishlist' : 'Featured Pieces'}
</h2>
</div>
​<div className="flex flex-wrap items-center gap-2">
{dynamicCategories.map((cat) => (
<button
key={cat}
onClick={() => {
setSelectedCategory(cat);
setShowWishlistOnly(false);
}}
className={px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider border transition ${ selectedCategory === cat && !showWishlistOnly ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900' }}
>
{cat}
</button>
))}
​<select
value={sortBy}
onChange={(e) => setSortBy(e.target.value)}
aria-label="Sort products"
className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 text-stone-800 focus:outline-none"
>
<option value="featured">Sort: Featured</option>
<option value="low">Price: Low to High</option>
<option value="high">Price: High to Low</option>
</select>
</div>
</div>
​{/* Active Search Filter Indicator */}
{searchQuery.trim() !== '' && (
<div className="mb-6 flex items-center justify-between bg-white border border-stone-200 px-4 py-2.5 text-xs">
<span>
Showing results for <strong>“{searchQuery}”</strong> ({filteredProducts.length}{' '}
{filteredProducts.length === 1 ? 'item' : 'items'})
</span>
<button
onClick={() => setSearchQuery('')}
className="font-bold uppercase tracking-wider text-stone-900 underline"
>
Reset Search
</button>
</div>
)}
​{filteredProducts.length === 0 ? (
<div className="bg-white border border-stone-200 p-12 text-center space-y-3">
<p className="text-sm font-medium text-stone-700">
No matching products found.
</p>
<button
onClick={() => {
setSearchQuery('');
setSelectedCategory('All');
setShowWishlistOnly(false);
}}
className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest"
>
View All Products
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
​return (
<div
key={item.id}
className="group bg-white border border-stone-200 flex flex-col justify-between overflow-hidden hover:border-stone-400 transition"
>
<div>
<div className="relative h-72 bg-stone-100 overflow-hidden">
<img
src={item.image_url}
alt={item.title}
onClick={() => openProductModal(item)}
className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition duration-500"
/>
{discountPct > 0 && (
<span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
{discountPct}% OFF
</span>
)}
<button
onClick={() => toggleWishlist(item.id)}
aria-label="Toggle Wishlist"
className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-stone-800 hover:bg-white shadow-xs"
>
<Heart
className={w-4 h-4 ${ isWishlisted ? 'fill-red-600 text-red-600' : '' }}
/>
</button>
<button
onClick={() => openProductModal(item)}
className="absolute bottom-3 left-3 right-3 py-2 bg-white/95 text-stone-900 text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5"
>
<Eye className="w-3.5 h-3.5" /> QUICK VIEW
</button>
</div>
​<div className="p-4 space-y-1.5">
<div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-wider">
<span>{item.category}</span>
<span className="flex items-center gap-1 text-stone-700 font-semibold">
<Star className="w-3 h-3 fill-amber-500 text-amber-500" />
{item.rating} ({item.reviews})
</span>
</div>
​<h3
onClick={() => openProductModal(item)}
className="font-semibold text-base text-stone-900 cursor-pointer hover:underline line-clamp-1"
>
{item.title}
</h3>
​<p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
{item.description}
</p>
</div>
</div>
​<div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
<div className="flex items-baseline gap-2">
<span className="text-base font-bold text-stone-900">₹{item.price}</span>
{item.mrp > item.price && (
<span className="text-xs text-stone-400 line-through">₹{item.mrp}</span>
)}
</div>
​<div className="flex items-center gap-1.5">
<button
onClick={() => openProductModal(item)}
className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider border border-stone-300 text-stone-800 hover:border-stone-900"
>
Sizes
</button>
<button
onClick={() =>
addToCartWithDetails(
item,
item.sizes?.[0] || 'M',
'Off-White / Cream',
1
)
}
className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white"
style={{ backgroundColor: settings.primary_color }}
>
Buy Now
</button>
</div>
</div>
</div>
);
})}
</div>
)}
</section>
​{/* Editorial Footer */}
<footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
<div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
<div className="space-y-3">
<h3 className="text-lg font-bold text-white tracking-tight">{settings.logo_text}</h3>
<p className="text-stone-400 leading-relaxed">
Modern curated apparel & lifestyle storefront powered by real-time inventory and door-to-door order tracking.
</p>
</div>
​<div className="space-y-2">
<p className="font-bold uppercase tracking-widest text-white">Shop</p>
<ul className="space-y-1.5 text-stone-400">
<li>
<a href="#shop" className="hover:text-white">
New Arrivals
</a>
</li>
<li>
<a href="#categories" className="hover:text-white">
Collections
</a>
</li>
<li>
<a href="/orders" className="hover:text-white">
Track Your Order
</a>
</li>
</ul>
</div>
​<div className="space-y-2">
<p className="font-bold uppercase tracking-widest text-white">Store Policies</p>
<ul className="space-y-1.5 text-stone-400">
<li>Free Shipping above ₹1,999</li>
<li>7-Day Hassle-Free Returns</li>
<li>Cash on Delivery & UPI Available</li>
</ul>
</div>
​<div className="space-y-2">
<p className="font-bold uppercase tracking-widest text-white">Studio Access</p>
<p className="text-stone-400">Manage products, hero banner & orders:</p>
<a
href="/admin"
className="inline-block mt-1 px-4 py-2 bg-white text-stone-900 font-bold uppercase tracking-wider"
>
Open Admin Studio
</a>
</div>
</div>
</footer>
​{/* Product Quick View & Customization Modal */}
{activeProduct && (
<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
<div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 grid grid-cols-1 md:grid-cols-2 relative">
<button
onClick={() => setActiveProduct(null)}
aria-label="Close modal"
className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-stone-900 shadow-xs"
>
<X className="w-4 h-4" />
</button>
​<div className="bg-stone-100 h-72 md:h-full">
<img
src={activeProduct.image_url}
alt={activeProduct.title}
className="w-full h-full object-cover"
/>
</div>
​<div className="p-6 flex flex-col justify-between space-y-5">
<div className="space-y-3">
<span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
{activeProduct.category}
</span>
<h3 className="text-xl font-serif text-stone-900">{activeProduct.title}</h3>
​<div className="flex items-baseline gap-2.5">
<span className="text-xl font-bold text-stone-900">₹{activeProduct.price}</span>
{activeProduct.mrp > activeProduct.price && (
<span className="text-xs text-stone-400 line-through">
₹{activeProduct.mrp}
</span>
)}
</div>
​<p className="text-xs text-stone-600 leading-relaxed">
{activeProduct.description}
</p>
​{/* Size Selector */}
<div className="pt-2">
<p className="text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
Select Size: <span className="text-stone-900">{selectedSize}</span>
</p>
<div className="flex flex-wrap gap-2">
{(activeProduct.sizes || ['S', 'M', 'L', 'XL']).map((sz: string) => (
<button
key={sz}
type="button"
onClick={() => setSelectedSize(sz)}
className={px-3 py-1.5 text-xs font-semibold border ${ selectedSize === sz ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-300' }}
>
{sz}
</button>
))}
</div>
</div>
​{/* Shade / Color Selector */}
<div>
<p className="text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
Finish / Shade: <span className="text-stone-900">{selectedColor}</span>
</p>
<div className="flex flex-wrap gap-2">
{['Off-White / Cream', 'Obsidian Black', 'Stone Grey'].map((clr) => (
<button
key={clr}
type="button"
onClick={() => setSelectedColor(clr)}
className={px-2.5 py-1 text-[11px] font-medium border ${ selectedColor === clr ? 'border-stone-900 bg-stone-100 text-stone-900 font-bold' : 'border-stone-300 text-stone-600' }}
>
{clr}
</button>
))}
</div>
</div>
​{/* Quantity Selector */}
<div className="flex items-center gap-3 pt-1">
<span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
Qty:
</span>
<div className="flex items-center border border-stone-300">
<button
type="button"
onClick={() => setModalQty(Math.max(1, modalQty - 1))}
className="p-1.5 text-stone-700 hover:bg-stone-100"
>
<Minus className="w-3.5 h-3.5" />
</button>
<span className="px-3 text-xs font-bold">{modalQty}</span>
<button
type="button"
onClick={() => setModalQty(modalQty + 1)}
className="p-1.5 text-stone-700 hover:bg-stone-100"
>
<Plus className="w-3.5 h-3.5" />
</button>
</div>
</div>
</div>
​<button
type="button"
onClick={() =>
addToCartWithDetails(activeProduct, selectedSize, selectedColor, modalQty)
}
className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white"
style={{ backgroundColor: settings.primary_color }}
>
ADD TO BAG & CHECKOUT — ₹{activeProduct.price * modalQty}
</button>
</div>
</div>
</div>
)}
​{/* Slide-Over Cart & Full Checkout Drawer */}
{showCart && (
<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
<div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
<h3 className="text-base font-bold uppercase tracking-widest">
Shopping Bag ({cart.length})
</h3>
<button onClick={() => setShowCart(false)} aria-label="Close bag">
<X className="w-5 h-5" />
</button>
</div>
​{cart.length === 0 ? (
<div className="py-16 text-center space-y-3">
<ShoppingBag className="w-10 h-10 mx-auto text-stone-300" />
<p className="text-sm text-stone-600">Your shopping bag is currently empty.</p>
<button
onClick={() => setShowCart(false)}
className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest"
>
Continue Shopping
</button>
</div>
) : (
<>
{/* Cart Items List */}
<div className="space-y-4 max-h-60 overflow-y-auto pr-1 mb-5">
{cart.map((item, idx) => (
<div
key={idx}
className="flex gap-3 border-b border-stone-100 pb-3 items-center"
>
<img
src={item.image_url}
alt={item.title}
className="w-14 h-16 object-cover bg-stone-100 shrink-0"
/>
<div className="flex-1 min-w-0">
<p className="text-xs font-bold text-stone-900 truncate">{item.title}</p>
<p className="text-[11px] text-stone-500">
Size: {item.selectedSize} • {item.selectedColor} • Qty: {item.qty}
</p>
<p className="text-xs font-bold text-stone-900 mt-1">
₹{Number(item.price) * (item.qty || 1)}
</p>
</div>
<button
onClick={() => removeFromCart(idx)}
className="text-xs text-stone-400 hover:text-red-600"
>
Remove
</button>
</div>
))}
</div>
​{/* Coupon Code Box */}
<div className="bg-stone-50 border border-stone-200 p-3 mb-5 space-y-2">
<label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
<Tag className="w-3.5 h-3.5" /> Apply Promo Code
</label>
<div className="flex gap-2">
<input
type="text"
value={couponInput}
onChange={(e) => setCouponInput(e.target.value)}
placeholder="FLOWIX10 or WELCOME200"
className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 uppercase focus:outline-none"
/>
<button
type="button"
onClick={applyCouponCode}
className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider"
>
Apply
</button>
</div>
{appliedCoupon && (
<p className="text-[11px] text-emerald-700 font-semibold">
✓ {appliedCoupon.code} applied (-₹{appliedCoupon.discount})
</p>
)}
</div>
​{/* Delivery & Payment Form */}
<form onSubmit={handleCheckout} className="space-y-3">
<p className="text-[11px] font-bold uppercase tracking-widest text-stone-800 flex items-center gap-1.5">
<Truck className="w-3.5 h-3.5" /> Delivery & Payment Details
</p>
​<input
type="text"
required
value={customerName}
onChange={(e) => setCustomerName(e.target.value)}
placeholder="Full Name *"
className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none"
/>
​<div className="grid grid-cols-2 gap-2">
<input
type="tel"
required
value={customerPhone}
onChange={(e) => setCustomerPhone(e.target.value)}
placeholder="Mobile Number *"
className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none"
/>
<input
type="email"
required
value={customerEmail}
onChange={(e) => setCustomerEmail(e.target.value)}
placeholder="Email Address *"
className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none"
/>
</div>
​<div className="relative">
<MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
<textarea
rows={2}
required
value={shippingAddress}
onChange={(e) => setShippingAddress(e.target.value)}
placeholder="Complete House/Street Address, City, Pincode *"
className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 focus:outline-none"
/>
</div>
​<div>
<label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
Payment Method
</label>
<select
value={paymentMode}
onChange={(e) => setPaymentMode(e.target.value)}
className="w-full px-3 py-2 text-xs border border-stone-300 bg-white focus:outline-none"
>
<option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
<option value="Online Payment (UPI / Card / NetBanking)">
Online Payment (UPI / Card / NetBanking)
</option>
</select>
</div>
​{/* Bill Summary */}
<div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs">
<div className="flex justify-between text-stone-600">
<span>Subtotal</span>
<span>₹{subtotal}</span>
</div>
{couponDiscount > 0 && (
<div className="flex justify-between text-emerald-700 font-semibold">
<span>Coupon Discount</span>
<span>-₹{couponDiscount}</span>
</div>
)}
<div className="flex justify-between text-stone-600">
<span>Shipping</span>
<span>{shippingFee === 0 ? 'FREE' : ₹${shippingFee}}</span>
</div>
<div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
<span>Grand Total</span>
<span>₹{grandTotal}</span>
</div>
</div>
​<button
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