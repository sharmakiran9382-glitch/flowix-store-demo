'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  Clock,
  PackageCheck,
} from 'lucide-react';

export default function AuraShippingPolicyPage() {
  const [pinCode, setPinCode] = useState('');

  function formatDateShort(dateObj: Date) {
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function getPinEstimate(rawPin: string) {
    const clean = rawPin.trim();
    const now = new Date();
    const shipDate = new Date(now);
    shipDate.setDate(now.getDate() + 1);

    const isMetroZone = /^[145678]/.test(clean);
    const transitDays = isMetroZone ? 4 : 5;
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + transitDays);

    return {
      zone: isMetroZone
        ? 'Zone A — Metro & Tier-1 Corridor'
        : 'Zone B — Pan-India Express Corridor',
      shipBy: `${formatDateShort(shipDate)} (Within 24–48 hrs)`,
      estDelivery: `${formatDateShort(deliveryDate)} (${transitDays} days)`,
    };
  }

  const estimate = pinCode.length === 6 ? getPinEstimate(pinCode) : null;

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
                AURA // LOGISTICS & DISPATCH
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Shipping & PIN Delivery Policy
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

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* LIVE PIN CHECKER */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>LIVE PIN ESTIMATOR</span>
            </span>
            <h2 className="text-2xl font-serif text-white">
              Check Dispatch & Delivery Window
            </h2>
            <p className="text-xs text-zinc-400">
              Enter your 6-digit Indian PIN code to preview exact warehouse dispatch and doorstep delivery dates.
            </p>
          </div>

          <div className="max-w-md space-y-3 font-mono text-xs">
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit PIN (e.g. 713339)"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 text-emerald-400 font-bold tracking-widest focus:outline-none focus:border-emerald-500"
            />

            {estimate && (
              <div className="bg-zinc-950 border border-emerald-500/40 p-4 space-y-2 text-[11px]">
                <p className="text-emerald-400 font-bold uppercase">
                  ✓ Serviceable • {estimate.zone}
                </p>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Warehouse Dispatch: {estimate.shipBy}</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Delivery: {estimate.estDelivery}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SHIPPING TIERS & RULES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase">
              24–48 Hr Dispatch
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              All confirmed orders undergo multi-point quality inspection and are handed over to courier partners within 24–48 business hours.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase">
              Free Express Above ₹1,999
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Orders totaling ₹1,999 or more qualify for zero-cost express delivery. Orders below ₹1,999 carry a flat ₹99 shipping fee.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase">
              Live Order Tracking
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Track every transit milestone—Order Confirmed, Packed & QC, Shipped, and Delivered—via your Order ID or My Account.
            </p>
          </div>
        </section>

        {/* TRANSIT TIMELINE TABLE */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h3 className="font-serif text-xl text-white">
            Estimated Transit Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                  <th className="py-3 px-4">Delivery Region</th>
                  <th className="py-3 px-4">Dispatch SLA</th>
                  <th className="py-3 px-4">Transit Time</th>
                  <th className="py-3 px-4">Shipping Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                <tr>
                  <td className="py-3 px-4 text-white font-semibold">
                    Metro Cities (Kolkata, Delhi, Mumbai, Bengaluru, Pune)
                  </td>
                  <td className="py-3 px-4 text-emerald-400">24–48 Hours</td>
                  <td className="py-3 px-4 text-zinc-300">3–4 Days</td>
                  <td className="py-3 px-4 text-zinc-300">
                    FREE above ₹1,999 (₹99 below)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-semibold">
                    Tier-2 & Tier-3 Cities (Pan-India PINs)
                  </td>
                  <td className="py-3 px-4 text-emerald-400">24–48 Hours</td>
                  <td className="py-3 px-4 text-zinc-300">4–5 Days</td>
                  <td className="py-3 px-4 text-zinc-300">
                    FREE above ₹1,999 (₹99 below)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-semibold">
                    Remote / North-East / J&K PINs
                  </td>
                  <td className="py-3 px-4 text-emerald-400">24–48 Hours</td>
                  <td className="py-3 px-4 text-zinc-300">5–7 Days</td>
                  <td className="py-3 px-4 text-zinc-300">
                    FREE above ₹1,999 (₹99 below)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
