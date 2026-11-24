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
announcement:
'🚚 FREE SHIPPING ON ORDERS ABOVE ₹1,999 • USE CODE: FLOWIX10 FOR 10% OFF',
});
const [products, setProducts] = useState<any[]>([]);
const [selectedCategory, setSelectedCategory] = useState('All');
const [sortBy, setSortBy] = useState('featured');
const [searchQuery, setSearchQuery] = useState('');
const [showSearch, setShowSearch] = useState(false);
// Wishlist & Quick View Modal State
const [wishlist, setWishlist] = useState<number[]>([]);
const [showWishlistOnly, setShowWishlistOnly] = useState(false);
const [activeProduct, setActiveProduct] = useState<any | null>(null);
const [selectedSize, setSelectedSize] = useState('M');
const [selectedColor, setSelectedColor] = useState('Obsidian Black');
const [modalQty, setModalQty] = useState(1);
// Cart, Coupons & Checkout State
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
const [shippingAddress, setShippingAddress] = useState('');
const [paymentMode, setPaymentMode] = useState('Cash on Delivery (COD)');
const [ordering, setOrdering] = useState(false);
const [orderSuccess, setOrderSuccess] = useState(false);
const [toastMsg, setToastMsg] = useState('');
function showToast(msg: string) {
setToastMsg(msg);
setTimeout(() => setToastMsg(''), 3200);
}
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
{
id: 7,
title: 'Court Classic Low-Top Sneakers',
category: 'Footwear',
price: 2699,
mrp: 3499,
rating: 4.8,
reviews: 118,
sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
description:
'Clean everyday sneakers with cushioned insole, breathable lining, and durable rubber cup sole.',
image_url:
'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
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
setWishlist((prev) => {
const exists = prev.includes(id);
showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
return exists ? prev.filter((x) => x !== id) : [...prev, id];
});
}
function addToCartWithDetails(
item: any,
size = 'M',
color = 'Obsidian Black',
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
showToast(${item.title} added to bag);
}
function removeFromCart(index: number) {
setCart((prev) => prev.filter((_, idx) => idx !== index));
}
// Dynamic category tabs from defaults + uploaded Supabase products
const dynamicCategories = [
'All',
...Array.from(
new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))
),
];
// Smart search synonyms so searching "shirt", "sandle", "shoes", "watch", etc. matches related items & categories
const searchSynonyms: Record<string, string[]> = {
shirt: ['shirt', 'tshirt', 'tshirts', 'henley', 'tee', 'top', 'men', 'jacket'],
shirts: ['shirt', 'tshirt', 'tshirts', 'henley', 'tee', 'top', 'men'],
tshirt: ['tshirt', 'tshirts', 'shirt', 'henley', 'tee'],
sandle: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes', 'slipper'],
sandal: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes'],
sandals: ['sandle', 'sandal', 'sandals', 'footwear', 'sneakers', 'shoes'],
shoes: ['shoes', 'sneakers', 'footwear', 'sandle', 'sandal', 'boots'],
sneaker: ['sneaker', 'sneakers', 'shoes', 'footwear'],
sneakers: ['sneakers', 'sneaker', 'shoes', 'footwear'],
hoodie: ['hoodie', 'hoodies', 'sweatshirt', 'fleece', 'winter'],
jacket: ['jacket', 'coat', 'trench', 'denim', 'men', 'women'],
watch: ['watch', 'chrono', 'accessories', 'sunglasses', 'eyewear'],
jeans: ['jeans', 'denim', 'trousers', 'pants', 'men', 'women'],
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
const searchableText = ${item.title || ''} ${item.category || ''} ${ item.description || '' }.toLowerCase();
const matchesSearch = terms.some((term) => searchableText.includes(term));
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
showToast(Coupon ${found.code} applied (-₹${disc}));
}
async function handleCheckout(e: React.FormEvent) {
e.preventDefault();
if (
!customerEmail.trim() ||
!customerName.trim() ||
!shippingAddress.trim() ||
cart.length === 0
) {
showToast('Please fill Name, Email, and Delivery Address.');
return;
}
setOrdering(true);
const itemsList = cart
.map(
(c) =>
${c.title} [Size: ${c.selectedSize}, Color: ${c.selectedColor}, Qty: ${c.qty}]
)
.join(' + ');
const couponNote = appliedCoupon
?  | Coupon: ${appliedCoupon.code} (-₹${appliedCoupon.discount})
: '';
const itemsSummary = ${itemsList}${couponNote} | Deliver To: ${customerName} (${customerPhone}) - ${shippingAddress} [${paymentMode}];
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
showToast('Order failed: ' + error.message);
} else {
setOrderSuccess(true);
setCart([]);
setAppliedCoupon(null);
setShowCart(false);
showToast('Order Confirmed! Track anytime in My Orders.');
setTimeout(() => setOrderSuccess(false), 6000);
}
}
return (
<div className="min-h-screen bg-[#f6f5f2] text-stone-900 font-sans">
{/* Toast Notification Banner */}
{toastMsg && (
<div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 shadow-lg flex items-center gap-2">
<Check className="w-4 h-4 text-emerald-400" />
<span>{toastMsg}</span>
</div>
)}
{/* Order Confirmation Banner */}
{orderSuccess && (
<div className="bg-emerald-800 text-white text-xs px-4 py-3 flex items-center justify-between">
<span>
Order Confirmed! Your items are being prepared for dispatch.
</span>
<a href="/orders" className="underline font-bold">
Track Order →
</a>
</div>
)}
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
<a
href="/"
className="text-xl md:text-2xl font-bold tracking-tight text-stone-900"
>
{settings.logo_text}
</a>
<nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-widest uppercase text-stone-600">
<a
href="/"
className="text-stone-900 border-b-2 border-stone-900 pb-0.5"
>
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
<a
href="/admin"
title="Admin Settings"
className="p-1.5 text-stone-700 hover:text-stone-950"
>
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
{/* Expandable Search Bar with Live Dropdown & Auto-Scroll */}
{showSearch && (
<div className="border-t border-stone-200 bg-white px-4 py-3 shadow-md">
<form
onSubmit={handleSearchSubmit}
className="max-w-xl mx-auto flex items-center gap-2"
>
<Search className="w-4 h-4 text-stone-400 shrink-0" />
<input
type="text"
value={searchQuery}
onChange={(e) => {
setSearchQuery(e.target.value);
setSelectedCategory('All');
setShowWishlistOnly(false);
}}
placeholder="Search shirt, sandle, sneakers, henley, hoodie..."
className="w-full text-sm focus:outline-none"
autoFocus
/>
{searchQuery && (
<button
type="button"
onClick={() => setSearchQuery('')}
className="text-xs text-stone-500 px-1"
>
Clear
</button>
)}
<button
type="submit"
className="px-3 py-1.5 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-wider shrink-0"
>
Search
</button>
</form>
{/* Instant Live Dropdown Results */}
{searchQuery.trim() !== '' && (
<div className="max-w-xl mx-auto mt-3 border-t border-stone-100 pt-2 max-h-80 overflow-y-auto space-y-2">
{matchedCategories.length > 0 && (
<div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-stone-100">
<span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
Matching Categories:
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
className="px-2.5 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider"
>
Explore {cat} →
</button>
))}
</div>
)}
<div className="divide-y divide-stone-100">
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
<div className="py-3 text-center space-y-2">
<p className="text-xs text-stone-500">
Abhi “{searchQuery}” ka koi item store mein
add nahi hai.
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
className="text-[11px] font-bold uppercase tracking-wider underline text-stone-900"
>
Browse All 