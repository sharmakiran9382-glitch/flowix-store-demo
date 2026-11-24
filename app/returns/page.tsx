'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  PackageCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AuraReturnsPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<'exchange' | 'refund'>(
    'exchange'
  );
  const [reason, setReason] = useState('Need a different size');
  const [notes, setNotes] = useState('');
  const [returnRma, setReturnRma] = useState<string | null>(null);

  function handleReturnSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;
    const rmaCode = 'RMA-' + Math.floor(100000 + Math.random() * 900000);
    setReturnRma(rmaCode);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
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
                AURA // REVERSE LOGISTICS
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                7-Day Returns & Size Exchange
              </h1>
            </div>
          </div>

          <a
            href="/orders"
            className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 font-mono text-xs text-emerald-400 hover:border-emerald-500"
          >
            My Orders
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* POLICY HIGHLIGHTS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase">
              7-Day Window
            </h2>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Raise a return or size exchange request within 7 calendar days from the doorstep delivery date.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase">
              Free First Size Swap
            </h2>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Need one size up or down? Your first size exchange pickup and re-dispatch are completely free.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase">
              Original Tags Required
            </h2>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Products must be unworn, unwashed, and packed with original AURA hangtags and box intact.
            </p>
          </div>
        </section>

        {/* RETURN / EXCHANGE REQUEST PORTAL */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>HOW IT WORKS</span>
            </div>
            <h3 className="text-xl font-serif text-white">
              3-Step Reverse Pickup
            </h3>

            <ol className="space-y-3 text-xs text-zinc-300 font-mono">
              <li className="bg-zinc-950 border border-zinc-800 p-3">
                <span className="text-emerald-400 font-bold">01. LOG RMA:</span>{' '}
                Submit your Order ID (e.g. FLX-XXXXXX) and registered email.
              </li>
              <li className="bg-zinc-950 border border-zinc-800 p-3">
                <span className="text-emerald-400 font-bold">
                  02. DOORSTEP PICKUP:
                </span>{' '}
                Courier pickup is scheduled within 24–48 hours at your PIN code.
              </li>
              <li className="bg-zinc-950 border border-zinc-800 p-3">
                <span className="text-emerald-400 font-bold">
                  03. SWAP OR REFUND:
                </span>{' '}
                Replacement ships immediately or refund settles within 3–5 business days.
              </li>
            </ol>

            <div className="flex items-start gap-2 font-mono text-[10px] text-zinc-400 pt-1">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Note: Opened innerwear or custom-monogrammed items are non-returnable unless defective.
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 md:p-8">
            {returnRma ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                  RETURN AUTHORIZED: {returnRma}
                </p>
                <h3 className="text-2xl font-serif text-white">
                  {requestType === 'exchange'
                    ? 'Size Exchange Logged'
                    : 'Return & Refund Logged'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Reverse pickup for Order{' '}
                  <span className="text-white font-mono">
                    {orderId.toUpperCase()}
                  </span>{' '}
                  has been scheduled. Confirmation sent to{' '}
                  <span className="text-white font-mono">{email}</span>.
                </p>
                <div className="pt-2 flex justify-center gap-3 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setReturnRma(null);
                      setOrderId('');
                      setNotes('');
                    }}
                    className="px-5 py-2.5 bg-emerald-500 text-black font-bold uppercase tracking-wider"
                  >
                    New Request
                  </button>
                  <a
                    href="/orders"
                    className="px-5 py-2.5 border border-zinc-700 bg-zinc-950 text-white uppercase"
                  >
                    Track Orders
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                  Initiate Return or Size Swap
                </div>

                <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 border border-zinc-800 font-mono">
                  <button
                    type="button"
                    onClick={() => setRequestType('exchange')}
                    className={`py-2 uppercase font-bold transition ${
                      requestType === 'exchange'
                        ? 'bg-emerald-500 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Size Exchange
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType('refund')}
                    className={`py-2 uppercase font-bold transition ${
                      requestType === 'refund'
                        ? 'bg-emerald-500 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Return & Refund
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                      Order ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. FLX-804120"
                      className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-emerald-400 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                      Registered Email *
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

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-white"
                  >
                    <option value="Need a different size">
                      Need a different size (Too tight / Too loose)
                    </option>
                    <option value="Received wrong item or color">
                      Received wrong item or color
                    </option>
                    <option value="Damaged or manufacturing defect">
                      Damaged or manufacturing defect
                    </option>
                    <option value="Changed my mind">Changed my mind</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Replacement Size / Pickup Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Swap Medium for Large, or preferred pickup time..."
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest hover:bg-emerald-400 transition"
                >
                  Generate Return Pickup ID
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
