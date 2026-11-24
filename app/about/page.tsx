'use client';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Award,
  Layers,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AuraAboutPage() {
  const pillars = [
    {
      code: 'MOD // 01',
      title: 'Technical Material Engineering',
      desc: 'Every garment and footwear release is built with heavyweight 260–420 GSM fabrics, reinforced stitching, and high-rebound soles tested for daily wear.',
      icon: Layers,
    },
    {
      code: 'MOD // 02',
      title: 'PIN-Verified Express Dispatch',
      desc: 'Orders are packed within 24–48 hours with transparent PIN-code delivery timelines and real-time stage tracking from warehouse to doorstep.',
      icon: Truck,
    },
    {
      code: 'MOD // 03',
      title: 'Zero-Noise Minimalist Design',
      desc: 'No loud branding or seasonal clutter—only clean monochrome silhouettes engineered to pair effortlessly across streetwear and everyday carry.',
      icon: Cpu,
    },
    {
      code: 'MOD // 04',
      title: 'Verified Quality & Easy Returns',
      desc: 'Every unit goes through a multi-point inspection prior to dispatch, backed by a straightforward 7-day size exchange and return policy.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* STICKY HEADER */}
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
                AURA // BRAND DOSSIER
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                About AURA Atelier
              </h1>
            </div>
          </div>

          <a
            href="/#shop"
            className="px-4 py-2 bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider"
          >
            Catalog →
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* HERO MANIFESTO */}
        <section className="bg-zinc-900/90 border border-zinc-800 p-7 md:p-10 space-y-5 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400">
            <Award className="w-3.5 h-3.5" />
            <span>EST. 2026 • TECHNICAL APPAREL & FOOTWEAR</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight max-w-3xl">
            Built for precision fit, durable construction, and transparent delivery.
          </h2>

          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
            AURA was created to bridge technical utility with clean everyday essentials. Instead of mass-produced fast fashion, we focus on curated drops—heavyweight tees, structured outerwear, modular accessories, and all-day footwear backed by live PIN-based dispatch tracking.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono">
            <div className="bg-zinc-950 border border-zinc-800 p-3.5">
              <span className="block text-[10px] text-zinc-500">DISPATCH SLA</span>
              <span className="text-base font-bold text-emerald-400">24–48 HRS</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3.5">
              <span className="block text-[10px] text-zinc-500">FABRIC SPEC</span>
              <span className="text-base font-bold text-white">260–420 GSM</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3.5">
              <span className="block text-[10px] text-zinc-500">RETURN WINDOW</span>
              <span className="text-base font-bold text-white">7 DAYS</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3.5">
              <span className="block text-[10px] text-zinc-500">COVERAGE</span>
              <span className="text-base font-bold text-emerald-400">PAN-INDIA PIN</span>
            </div>
          </div>
        </section>

        {/* CORE PILLARS */}
        <section className="space-y-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
              ARCHITECTURE
            </span>
            <h3 className="text-2xl font-serif text-white mt-1">
              How AURA Operates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.code}
                  className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-6 space-y-3 transition"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
                    <span>{item.code}</span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUALITY PROMISE & CTA */}
        <section className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>VERIFIED DIRECT-TO-CUSTOMER STOREFRONT</span>
            </div>
            <p className="text-sm text-zinc-300 max-w-xl">
              Explore our active catalog or check live order dispatch status anytime using your email and 6-digit delivery PIN.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 font-mono text-xs shrink-0">
            <a
              href="/#shop"
              className="px-5 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest flex items-center gap-1.5"
            >
              <span>Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/orders"
              className="px-5 py-3 border border-zinc-700 bg-zinc-900 text-white font-bold uppercase tracking-widest hover:border-emerald-500"
            >
              Track Order
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
