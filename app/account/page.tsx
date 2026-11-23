'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, UserCheck, LogOut, MapPin, Phone, Mail, Package, Shield } from 'lucide-react';

export default function CustomerAccountPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('flowix_customer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        loadUserOrders(parsed.email);
      } catch {}
    }
  }, []);

  async function loadUserOrders(userEmail: string) {
    const { data } = await supabase
      .from('customer_orders')
      .select('*')
      .eq('customer_email', userEmail)
      .order('id', { ascending: false });
    if (data) setMyOrders(data);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Check if account already exists in Supabase
    const { data: existing } = await supabase
      .from('customer_orders')
      .select('*')
      .eq('customer_email', cleanEmail)
      .eq('order_status', 'ACCOUNT_PROFILE')
      .single();

    if (existing) {
      setLoading(false);
      alert('Account already exists with this email! Please Sign In.');
      setMode('login');
      return;
    }

    const profilePayload = JSON.stringify({
      name: name.trim(),
      password: password.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    const { error } = await supabase.from('customer_orders').insert([
      {
        customer_email: cleanEmail,
        items: `PROFILE::${profilePayload}`,
        total_amount: 0,
        order_status: 'ACCOUNT_PROFILE',
      },
    ]);

    setLoading(false);
    if (error) {
      alert('Sign up error: ' + error.message);
      return;
    }

    const userObj = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      address: address.trim(),
    };
    localStorage.setItem('flowix_customer', JSON.stringify(userObj));
    setCurrentUser(userObj);
    loadUserOrders(cleanEmail);
    alert('Account created & saved to database!');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const { data } = await supabase
      .from('customer_orders')
      .select('*')
      .eq('customer_email', cleanEmail)
      .eq('order_status', 'ACCOUNT_PROFILE')
      .single();

    setLoading(false);
    if (!data || !data.items?.startsWith('PROFILE::')) {
      alert('No account found with this email. Please Create an Account first!');
      setMode('signup');
      return;
    }

    try {
      const parsed = JSON.parse(data.items.replace('PROFILE::', ''));
      if (parsed.password !== password.trim()) {
        alert('Incorrect password! Please try again.');
        return;
      }

      const userObj = {
        name: parsed.name,
        email: cleanEmail,
        phone: parsed.phone || '',
        address: parsed.address || '',
      };
      localStorage.setItem('flowix_customer', JSON.stringify(userObj));
      setCurrentUser(userObj);
      loadUserOrders(cleanEmail);
    } catch {
      alert('Login verification failed.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('flowix_customer');
    setCurrentUser(null);
    setMyOrders([]);
  }

  // Filter out internal profile record from real shopping orders
  const realOrders = myOrders.filter((o) => o.order_status !== 'ACCOUNT_PROFILE');

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-stone-900">
      <header className="bg-stone-900 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              Customer Portal
            </span>
            <h1 className="text-lg font-bold">My Account & Saved Profile</h1>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white text-stone-900 px-3.5 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Storefront
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white border border-stone-200 p-7 space-y-5">
            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 ${
                  mode === 'login'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 ${
                  mode === 'signup'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400'
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-2xl font-serif">Welcome Back</h2>
                <p className="text-xs text-stone-500">
                  Sign in to access your saved delivery address and live order history.
                </p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full border border-stone-300 px-3 py-2.5 text-sm"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  className="w-full border border-stone-300 px-3 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-3 text-xs font-bold uppercase tracking-widest"
                >
                  {loading ? 'Signing In...' : 'Sign In to Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <h2 className="text-2xl font-serif">Create Customer Account</h2>
                <p className="text-xs text-stone-500">
                  Your profile, phone, and address stay saved permanently in our database.
                </p>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name *"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password *"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile Number *"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Default Delivery Address (House No, City, Pincode) *"
                  className="w-full border border-stone-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-3 text-xs font-bold uppercase tracking-widest"
                >
                  {loading ? 'Creating Account...' : 'Create Account & Save'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Logged In User Profile Card */}
            <div className="bg-white border border-stone-200 p-6 flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  <UserCheck className="w-3.5 h-3.5" /> Verified Customer Account
                </span>
                <h2 className="text-2xl font-serif">{currentUser.name}</h2>
                <div className="space-y-1 text-xs text-stone-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> {currentUser.email}
                  </p>
                  {currentUser.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> {currentUser.phone}
                    </p>
                  )}
                  {currentUser.address && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {currentUser.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href="/#shop"
                  className="bg-stone-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  Shop Now
                </a>
                <button
                  onClick={handleLogout}
                  className="border border-stone-300 px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-stone-100"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>

            {/* Customer's Personal Orders */}
            <div className="bg-white border border-stone-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif flex items-center gap-2">
                  <Package className="w-5 h-5" /> Your Order History ({realOrders.length})
                </h3>
                <a href="/orders" className="text-xs font-bold uppercase underline">
                  Open Live Tracker →
                </a>
              </div>

              {realOrders.length === 0 ? (
                <p className="text-xs text-stone-500">
                  You haven&apos;t placed any orders yet. When you order, your saved address will auto-fill!
                </p>
              ) : (
                <div className="divide-y divide-stone-200">
                  {realOrders.map((ord) => (
                    <div key={ord.id} className="py-3 flex flex-wrap justify-between gap-2 text-sm">
                      <div>
                        <span className="text-xs font-bold text-stone-500">Order #{ord.id}</span>
                        <p className="font-medium text-stone-900">{ord.items}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold bg-stone-900 text-white px-2.5 py-0.5">
                          {ord.order_status}
                        </span>
                        <p className="font-bold text-xs mt-1">₹{ord.total_amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
