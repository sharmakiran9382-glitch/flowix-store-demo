'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Package, Truck, CheckCircle2, Search } from 'lucide-react';

export default function OrdersTrackingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const steps = [
    'Order Confirmed',
    'Packed & Ready',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('customer_orders')
      .select('*')
      .order('id', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  }

  const visibleOrders = orders.filter((o) =>
    (o.customer_email || '').toLowerCase().includes(filterEmail.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-stone-900">
      <header className="bg-white border-b border-stone-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-serif">My Orders & Delivery Tracker</h1>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-stone-300 px-3 py-2 hover:border-stone-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Email Filter Box */}
        <div className="bg-white border border-stone-200 p-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="Filter by your email address..."
            className="w-full text-sm focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-sm text-stone-500">Loading your orders...</p>
        ) : visibleOrders.length === 0 ? (
          <div className="bg-white border border-stone-200 p-10 text-center space-y-3">
            <Package className="w-8 h-8 mx-auto text-stone-400" />
            <p className="text-sm text-stone-600">No orders found yet.</p>
            <a
              href="/"
              className="inline-block bg-stone-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest"
            >
              Explore Store
            </a>
          </div>
        ) : (
          visibleOrders.map((order) => {
            const currentIdx = Math.max(0, steps.indexOf(order.order_status || 'Order Confirmed'));
            return (
              <div key={order.id} className="bg-white border border-stone-200 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                      Order #{order.id}
                    </span>
                    <p className="text-xs text-stone-500 mt-0.5">{order.customer_email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
                      <Truck className="w-3.5 h-3.5" /> {order.order_status || 'Order Confirmed'}
                    </span>
                    <p className="text-sm font-bold mt-1">₹{order.total_amount}</p>
                  </div>
                </div>

                <p className="text-sm text-stone-800">{order.items}</p>

                {/* Step-by-Step Delivery Progress Bar */}
                <div className="grid grid-cols-5 gap-1 pt-2">
                  {steps.map((step, idx) => {
                    const done = idx <= currentIdx;
                    return (
                      <div key={step} className="space-y-1.5">
                        <div className={`h-1.5 ${done ? 'bg-stone-900' : 'bg-stone-200'}`} />
                        <p className={`text-[10px] font-semibold leading-tight ${done ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
