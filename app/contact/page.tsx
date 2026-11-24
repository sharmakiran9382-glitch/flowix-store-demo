'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  MessageSquare,
} from 'lucide-react';

export default function AuraContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [topic, setTopic] = useState('Order & PIN Tracking');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const ticketNo = 'TKT-' + Math.floor(10000 + Math.random() * 90000);
    setSubmittedTicket(ticketNo);
    setMessage('');
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-white transition"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                AURA // SUPPORT DESK
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Contact & Dispatch Support
              </h1>
            </div>
          </div>

          <a
            href="/orders"
            className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 font-mono text-xs text-emerald-400 hover:border-emerald-500"
          >
            Track Order
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: DIRECT SUPPORT CHANNELS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              <Headphones className="w-3.5 h-3.5" />
              <span>LIVE CONCIERGE</span>
            </div>
            <h2 className="text-2xl font-serif text-white">
              Need help with an order, size, or PIN delivery?
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our dispatch and support team responds within 2–4 business hours. Include your Order ID (e.g. FLX-XXXXXX) for priority assistance.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4 font-mono text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-zinc-500">
                  EMAIL DESK
                </span>
                <span className="text-white">support@aura-atelier.in</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-zinc-500">
                  WHATSAPP & CALL
                </span>
                <span className="text-white">+91 98000 24710</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-zinc-500">
                  OPERATING HOURS
                </span>
                <span className="text-white">Mon – Sat • 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-zinc-500">
                  DISPATCH HUB
                </span>
                <span className="text-zinc-300">
                  AURA Fulfillment Sector, Kolkata / Asansol Corridor, WB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: TICKET SUBMISSION FORM */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 md:p-8">
          {submittedTicket ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                TICKET LOGGED: {submittedTicket}
              </p>
              <h3 className="text-2xl font-serif text-white">
                Message Received
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                We have logged your request under <span className="text-white font-mono">{submittedTicket}</span>. A confirmation update will be sent to <span className="text-white font-mono">{email}</span> shortly.
              </p>
              <div className="pt-2 flex justify-center gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="px-5 py-2.5 bg-emerald-500 text-black font-bold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
                <a
                  href="/"
                  className="px-5 py-2.5 border border-zinc-700 bg-zinc-950 text-white uppercase"
                >
                  Back to Store
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                <MessageSquare className="w-4 h-4" />
                <span>Submit Support Request</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-white"
                  >
                    <option value="Order & PIN Tracking">
                      Order & PIN Tracking
                    </option>
                    <option value="Size Exchange / Return">
                      Size Exchange / Return
                    </option>
                    <option value="Bulk / Custom Brand Order">
                      Bulk / Custom Brand Order
                    </option>
                    <option value="Payment / Coupon Help">
                      Payment / Coupon Help
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. FLX-804120"
                    className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your query, delivery PIN, or exchange request..."
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
