'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Search,
  MapPin,
  Truck,
  Calendar,
  Package,
  CheckCircle2,
  RefreshCw,
  Clock,
} from 'lucide-react';

export default function AuraOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const [activeEmailSearch, setActiveEmailSearch] = useState('');

  useEffect(() => {
    fetchOrders('');
  }, []);

  async function fetchOrders(emailQuery: string) {
    setLoading(true);
    try {
      let query = supabase
        .from('customer_orders')
        .select('*')
        .order('id', { ascending: false });

      if (emailQuery.trim()) {
        query = query.ilike('customer_email', `%${emailQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        setOrders(data);
      }
    } catch {
      // Keep current list on transient error
    }
    setLoading(false);
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
    const pinMatch = text.match(/\[PIN:\s*(\d{6})\]/i);
    if (prefix.toLowerCase().includes('pin') && pinMatch) {
      return pinMatch[1];
    }
    return '';
  }

  function getProgressStage(statusText: string) {
    const s = (statusText || '').toLowerCase();
    if (s.includes('delivered')) return 4;
    if (s.includes('out for delivery') || s.includes('shipped')) return 3;
    if (s.includes('packed')) return 2;
    return 1;
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActiveEmailSearch(emailFilter.trim());
    fetchOrders(emailFilter);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
              title="Back to Store"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                AURA LOGISTICS & DISPATCH
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Track Your Orders
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => fetchOrders(activeEmailSearch)}
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href="/"
              className="px-3.5 py-2 bg-emerald-500 text-black font-bold uppercase tracking-wider"
            >
              Store
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* EMAIL FILTER BOX */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col sm:flex-row gap-2.5"
        >
          <div className="flex items-center gap-2 flex-1 bg-zinc-950 border border-zinc-800 px-3 py-2">
            <Search className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Enter customer email to filter orders (or leave blank for all)..."
              className="w-full bg-transparent text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 font-mono text-xs">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-black font-bold uppercase tracking-wider"
            >
              Find Orders
            </button>
            {activeEmailSearch && (
              <button
                type="button"
                onClick={() => {
                  setEmailFilter('');
                  setActiveEmailSearch('');
                  fetchOrders('');
                }}
                className="px-3 py-2 border border-zinc-700 bg-zinc-950 text-zinc-300 uppercase"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* ORDERS LIST */}
        {loading ? (
          <div className="bg-zinc-900 border border-zinc-800 p-10 text-center font-mono text-xs text-zinc-400">
            Loading dispatch records...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-10 text-center space-y-3">
            <p className="font-mono text-xs text-zinc-400">
              No orders found for your current filter.
            </p>
            <a
              href="/#shop"
              className="inline-block px-5 py-2.5 bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-widest"
            >
              Place an Order
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((ord) => {
              const rawItems = ord.items || '';
              const orderIdTag = extractTag(rawItems, 'OrderID:') || `DB-#${ord.id}`;
              const orderedAtTag = extractTag(rawItems, 'Ordered:') || 'Recent Order';
              const shipByTag =
                extractTag(rawItems, 'ShipBy:') || 'Within 24–48 hrs';
              const estDeliveryTag =
                extractTag(rawItems, 'EstDelivery:') || '3–5 Business Days';
              const pinMatch = rawItems.match(/\[PIN:\s*(\d{6})\]/i);
              const pinTag = pinMatch ? pinMatch[1] : 'Verified PIN';

              const stage = getProgressStage(ord.order_status);

              return (
                <div
                  key={ord.id}
                  className="bg-zinc-900/90 border border-zinc-800 p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 font-mono">
                    <div>
                      <span className="text-xs font-bold text-emerald-400">
                        {orderIdTag}
                      </span>
                      <span className="text-zinc-600 mx-2">•</span>
                      <span className="text-xs text-zinc-300">
                        {ord.customer_email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-zinc-950 border border-emerald-500/40 text-[10px] font-bold uppercase text-emerald-300">
                        {ord.order_status || 'Order Placed'}
                      </span>
                      <span className="text-sm font-bold text-white">
                        ₹{ord.total_amount}
                      </span>
                    </div>
                  </div>

                  {/* PIN, ORDER TIME, SHIP STATUS & ESTIMATED DELIVERY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-[11px]">
                    <div className="bg-zinc-950 border border-zinc-800 p-3">
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        Delivery PIN
                      </span>
                      <span className="block font-bold text-white mt-1">
                        {pinTag}
                      </span>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 p-3">
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        Ordered On
                      </span>
                      <span className="block font-bold text-white mt-1">
                        {orderedAtTag}
                      </span>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 p-3">
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase">
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        Shipping Window
                      </span>
                      <span className="block font-bold text-white mt-1">
                        {shipByTag}
                      </span>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 p-3">
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        Estimated Delivery
                      </span>
                      <span className="block font-bold text-emerald-400 mt-1">
                        {estDeliveryTag}
                      </span>
                    </div>
                  </div>

                  {/* 4-STEP TIMELINE BAR */}
                  <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                    {[
                      { step: 1, label: 'Placed' },
                      { step: 2, label: 'Packed' },
                      { step: 3, label: 'Shipped' },
                      { step: 4, label: 'Delivered' },
                    ].map((sItem) => {
                      const done = stage >= sItem.step;
                      return (
                        <div key={sItem.step} className="space-y-1">
                          <div
                            className={`h-1.5 w-full ${
                              done ? 'bg-emerald-500' : 'bg-zinc-800'
                            }`}
                          />
                          <span
                            className={`block text-center uppercase ${
                              done ? 'text-emerald-400 font-bold' : 'text-zinc-500'
                            }`}
                          >
                            {sItem.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* FULL ITEM & ADDRESS SUMMARY */}
                  <div className="bg-zinc-950/70 border border-zinc-800/80 p-3 font-mono text-[11px] text-zinc-400 flex items-start gap-2">
                    <Package className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="break-words">{rawItems}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
