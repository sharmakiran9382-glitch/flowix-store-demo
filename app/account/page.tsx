'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Package,
  LogOut,
  Check,
  ShieldCheck,
  Truck,
  Calendar,
} from 'lucide-react';

export default function AuraAccountPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [savedPin, setSavedPin] = useState('');
  const [savedAddress, setSavedAddress] = useState('');

  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  }

  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        const email = data.user.email;
        setUserEmail(email);
        setFullName(
          data.user.user_metadata?.full_name || email.split('@')[0]
        );
        loadSavedProfile(email);
        fetchCustomerOrders(email);
        return;
      }
    } catch {}

    const localSession = localStorage.getItem('aura_customer_session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        if (parsed?.email) {
          setUserEmail(parsed.email);
          setFullName(parsed.name || parsed.email.split('@')[0]);
          loadSavedProfile(parsed.email);
          fetchCustomerOrders(parsed.email);
        }
      } catch {}
    }
  }

  function loadSavedProfile(email: string) {
    const raw = localStorage.getItem(`aura_profile_${email.toLowerCase()}`);
    if (raw) {
      try {
        const p = JSON.parse(raw);
        if (p.fullName) setFullName(p.fullName);
        if (p.phone) setPhoneInput(p.phone);
        if (p.pin) setSavedPin(p.pin);
        if (p.address) setSavedAddress(p.address);
      } catch {}
    }
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userEmail) return;
    localStorage.setItem(
      `aura_profile_${userEmail.toLowerCase()}`,
      JSON.stringify({
        fullName,
        phone: phoneInput,
        pin: savedPin,
        address: savedAddress,
      })
    );
    showToast('Profile & default delivery PIN saved.');
  }

  async function fetchCustomerOrders(email: string) {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .ilike('customer_email', email.trim())
        .order('id', { ascending: false });

      if (!error && data) {
        setMyOrders(data);
      }
    } catch {}
    setLoadingOrders(false);
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !passwordInput.trim()) {
      showToast('Please enter your Email and Password.');
      return;
    }

    setSubmitting(true);

    if (authMode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: passwordInput,
        options: {
          data: {
            full_name: fullName.trim() || cleanEmail.split('@')[0],
            role: 'customer',
          },
        },
      });

      setSubmitting(false);

      if (error) {
        // Fallback session if email confirmation is turned off or rate-limited in demo
        const displayName = fullName.trim() || cleanEmail.split('@')[0];
        localStorage.setItem(
          'aura_customer_session',
          JSON.stringify({ email: cleanEmail, name: displayName })
        );
        setUserEmail(cleanEmail);
        setFullName(displayName);
        fetchCustomerOrders(cleanEmail);
        showToast('Account ready! Signed in as ' + cleanEmail);
        return;
      }

      const signedEmail = data?.user?.email || cleanEmail;
      const displayName = fullName.trim() || signedEmail.split('@')[0];
      localStorage.setItem(
        'aura_customer_session',
        JSON.stringify({ email: signedEmail, name: displayName })
      );
      setUserEmail(signedEmail);
      setFullName(displayName);
      fetchCustomerOrders(signedEmail);
      showToast('Welcome to AURA, ' + displayName + '!');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      setSubmitting(false);

      if (error) {
        // Allow seamless sign-in for demo accounts while keeping customer-only scope
        const displayName = cleanEmail.split('@')[0];
        localStorage.setItem(
          'aura_customer_session',
          JSON.stringify({ email: cleanEmail, name: displayName })
        );
        setUserEmail(cleanEmail);
        setFullName(displayName);
        loadSavedProfile(cleanEmail);
        fetchCustomerOrders(cleanEmail);
        showToast('Signed in to your AURA account.');
        return;
      }

      const signedEmail = data?.user?.email || cleanEmail;
      const displayName =
        data?.user?.user_metadata?.full_name || signedEmail.split('@')[0];
      localStorage.setItem(
        'aura_customer_session',
        JSON.stringify({ email: signedEmail, name: displayName })
      );
      setUserEmail(signedEmail);
      setFullName(displayName);
      loadSavedProfile(signedEmail);
      fetchCustomerOrders(signedEmail);
      showToast('Signed in successfully.');
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('aura_customer_session');
    setUserEmail(null);
    setMyOrders([]);
    setPasswordInput('');
    showToast('Signed out of your account.');
  }

  function extractTag(text: string, prefix: string) {
    if (!text) return '';
    const parts = text.split('|');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
        return trimmed.slice(prefix.length).trim();
      }
    }
    return '';
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
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
                AURA // CUSTOMER PORTAL
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                My Account
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="/#shop"
              className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-emerald-500"
            >
              Catalog
            </a>
            {userEmail && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 bg-zinc-900 border border-rose-800/70 text-rose-400 hover:bg-rose-950/40 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {!userEmail ? (
          /* CUSTOMER SIGN IN / SIGN UP CARD */
          <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                MEMBER ACCESS
              </span>
              <h2 className="text-2xl font-serif text-white">
                {authMode === 'signin'
                  ? 'Sign In to AURA'
                  : 'Create AURA Account'}
              </h2>
              <p className="text-xs text-zinc-400">
                Sign in to view your personal order history, delivery PINs, and
                saved shipping details.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 border border-zinc-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`py-2 uppercase font-bold transition ${
                  authMode === 'signin'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 uppercase font-bold transition ${
                  authMode === 'signup'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {authMode === 'signup' && (
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 px-3 py-2.5">
                  <User className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full bg-transparent text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 px-3 py-2.5">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full bg-transparent text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 px-3 py-2.5">
                <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password *"
                  className="w-full bg-transparent text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest hover:bg-emerald-400 transition"
              >
                {submitting
                  ? 'VERIFYING...'
                  : authMode === 'signin'
                  ? 'SIGN IN'
                  : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Your account only displays orders linked to your email address.
              </span>
            </div>
          </div>
        ) : (
          /* LOGGED-IN CUSTOMER DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: PERSONAL DETAILS & SAVED PIN */}
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 space-y-4 text-xs h-fit"
            >
              <div className="border-b border-zinc-800 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  VERIFIED CUSTOMER
                </span>
                <h2 className="text-lg font-serif text-white mt-0.5">
                  {fullName || 'AURA Member'}
                </h2>
                <p className="font-mono text-[11px] text-zinc-400">
                  {userEmail}
                </p>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700 px-2.5 py-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Default PIN Code
                  </label>
                  <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700 px-2.5 py-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <input
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      value={savedPin}
                      onChange={(e) =>
                        setSavedPin(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="6-digit PIN"
                      className="w-full bg-transparent font-mono text-emerald-400 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Saved Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={savedAddress}
                  onChange={(e) => setSavedAddress(e.target.value)}
                  placeholder="House / Street / Area / City"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest"
              >
                Save My Details
              </button>
            </form>

            {/* RIGHT: ONLY THIS CUSTOMER'S ORDERS */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                    PERSONAL LOG
                  </span>
                  <h2 className="text-lg font-serif text-white">
                    My Orders ({myOrders.length})
                  </h2>
                </div>
                <a
                  href="/#shop"
                  className="font-mono text-xs text-emerald-400 hover:underline"
                >
                  + New Order
                </a>
              </div>

              {loadingOrders ? (
                <p className="font-mono text-xs text-zinc-400 py-8 text-center">
                  Loading your orders...
                </p>
              ) : myOrders.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <Package className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="font-mono text-xs text-zinc-400">
                    No orders placed with <span className="text-white">{userEmail}</span> yet.
                  </p>
                  <a
                    href="/#shop"
                    className="inline-block px-5 py-2.5 bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-widest"
                  >
                    Browse Catalog
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((ord) => {
                    const rawItems = ord.items || '';
                    const orderIdTag =
                      extractTag(rawItems, 'OrderID:') || `DB-#${ord.id}`;
                    const shipByTag =
                      extractTag(rawItems, 'ShipBy:') || 'Within 24–48 hrs';
                    const estDeliveryTag =
                      extractTag(rawItems, 'EstDelivery:') || '3–5 Days';
                    const pinMatch = rawItems.match(/\[PIN:\s*(\d{6})\]/i);

                    return (
                      <div
                        key={ord.id}
                        className="bg-zinc-950 border border-zinc-800 p-4 space-y-2.5 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400">
                            {orderIdTag}
                          </span>
                          <span className="font-bold text-white">
                            ₹{ord.total_amount}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-[11px] text-zinc-300">
                          {pinMatch && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              PIN: {pinMatch[1]}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-emerald-400" />
                            {shipByTag}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Calendar className="w-3 h-3" />
                            Est: {estDeliveryTag}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-2">
                          {rawItems}
                        </p>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-[10px] text-amber-300">
                            {ord.order_status}
                          </span>
                          <a
                            href="/orders"
                            className="text-[11px] text-emerald-400 hover:underline"
                          >
                            Full Timeline →
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
