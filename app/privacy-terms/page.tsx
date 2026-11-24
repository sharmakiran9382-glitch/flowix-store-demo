'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  Lock,
  CheckCircle2,
  Scale,
} from 'lucide-react';

export default function AuraPrivacyTermsPage() {
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms'>('privacy');

  const privacySections = [
    {
      code: 'SEC // 01',
      title: 'Information We Collect',
      body: 'When you browse AURA, create a customer account, or place an order, we collect only essential fulfillment details: your name, email address, phone number, shipping address, and 6-digit delivery PIN code.',
    },
    {
      code: 'SEC // 02',
      title: 'How Your Data Is Used',
      body: 'Your information is used strictly to process orders, calculate PIN-based dispatch and delivery timelines, send order status updates, and assist with returns or size exchanges.',
    },
    {
      code: 'SEC // 03',
      title: 'Payment & Account Security',
      body: 'We do not store raw UPI PINs, card numbers, or banking passwords on our servers. All customer account sessions and database records are protected with encrypted transport and role-based access controls.',
    },
    {
      code: 'SEC // 04',
      title: 'Third-Party Logistics & Payment Partners',
      body: 'Only necessary shipping details (recipient name, phone, address, and PIN code) are shared with verified courier partners to complete doorstep delivery. We never sell or rent customer data to third parties.',
    },
  ];

  const termsSections = [
    {
      code: 'TRM // 01',
      title: 'Order Acceptance & Pricing',
      body: 'All prices listed on AURA are in Indian Rupees (INR). An order is confirmed once submitted at checkout and assigned a unique Order ID (e.g. FLX-XXXXXX).',
    },
    {
      code: 'TRM // 02',
      title: 'PIN Serviceability & Delivery Timelines',
      body: 'Dispatch typically occurs within 24–48 hours of order confirmation. Estimated delivery dates shown at checkout are calculated based on your 6-digit PIN code and courier transit schedules.',
    },
    {
      code: 'TRM // 03',
      title: 'Promo Codes & Discounts',
      body: 'Promotional codes (such as FLOWIX10 or WELCOME200) must be applied prior to placing an order. Only one promo code can be redeemed per order unless stated otherwise.',
    },
    {
      code: 'TRM // 04',
      title: 'Returns, Exchanges & Intellectual Property',
      body: 'Eligible unworn items with original tags may be returned or exchanged within 7 days of delivery. All AURA branding, product photography, 3D visuals, and storefront code remain the property of AURA Atelier.',
    },
  ];

  const currentSections =
    activeDoc === 'privacy' ? privacySections : termsSections;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
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
                AURA // LEGAL & COMPLIANCE
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Privacy Policy & Terms
              </h1>
            </div>
          </div>

          <a
            href="/contact"
            className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 font-mono text-xs text-emerald-400 hover:border-emerald-500"
          >
            Legal Desk
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* SWITCH TABS */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              <Scale className="w-3.5 h-3.5" />
              <span>EFFECTIVE: NOVEMBER 2026</span>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 border border-zinc-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveDoc('privacy')}
                className={`px-4 py-2 uppercase font-bold flex items-center gap-1.5 transition ${
                  activeDoc === 'privacy'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('terms')}
                className={`px-4 py-2 uppercase font-bold flex items-center gap-1.5 transition ${
                  activeDoc === 'terms'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms of Service</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {activeDoc === 'privacy'
              ? 'This Privacy Policy explains how AURA Technical Atelier collects, safeguards, and uses your personal and delivery information.'
              : 'These Terms of Service govern your access to the AURA storefront, order placement, PIN shipping estimates, and return policies.'}
          </p>
        </div>

        {/* CLAUSE CARDS */}
        <div className="space-y-4">
          {currentSections.map((sec) => (
            <div
              key={sec.code}
              className="bg-zinc-900 border border-zinc-800 p-6 space-y-2.5"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
                <span>{sec.code}</span>
                <Lock className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base md:text-lg font-semibold text-white">
                {sec.title}
              </h2>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER VERIFICATION */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>AURA Storefront Data Protection & Commerce Policy</span>
          </div>
          <a href="/" className="text-zinc-300 hover:text-white underline">
            Return to Storefront →
          </a>
        </div>
      </main>
    </div>
  );
}
