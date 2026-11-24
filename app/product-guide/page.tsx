'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Ruler,
  Layers,
  ShieldCheck,
  Sparkles,
  Droplets,
  Wind,
  AlertTriangle,
} from 'lucide-react';

export default function AuraProductGuidePage() {
  const [sizeTab, setSizeTab] = useState<'apparel' | 'footwear'>('apparel');

  const apparelSizes = [
    { size: 'XS', chest: '38 in', length: '26.5 in', shoulder: '18.5 in', fit: 'Relaxed Boxy' },
    { size: 'S', chest: '40 in', length: '27.5 in', shoulder: '19.5 in', fit: 'Relaxed Boxy' },
    { size: 'M', chest: '42 in', length: '28.5 in', shoulder: '20.5 in', fit: 'Relaxed Boxy' },
    { size: 'L', chest: '44 in', length: '29.5 in', shoulder: '21.5 in', fit: 'Relaxed Boxy' },
    { size: 'XL', chest: '46 in', length: '30.5 in', shoulder: '22.5 in', fit: 'Relaxed Boxy' },
  ];

  const footwearSizes = [
    { uk: 'UK 7', eu: 'EU 41', us: 'US 8', cm: '25.8 cm' },
    { uk: 'UK 8', eu: 'EU 42', us: 'US 9', cm: '26.6 cm' },
    { uk: 'UK 9', eu: 'EU 43', us: 'US 10', cm: '27.5 cm' },
    { uk: 'UK 10', eu: 'EU 44', us: 'US 11', cm: '28.3 cm' },
    { uk: 'UK 11', eu: 'EU 45', us: 'US 12', cm: '29.2 cm' },
  ];

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
                AURA // TECHNICAL MANUAL
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Sizing, Materials & Care Guide
              </h1>
            </div>
          </div>

          <a
            href="/#shop"
            className="px-4 py-2 bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider"
          >
            Shop Catalog →
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* SECTION 1: SIZE MATRIX */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5" />
                <span>DIMENSION CHART</span>
              </span>
              <h2 className="text-2xl font-serif text-white mt-1">
                Precision Fit & Size Guide
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 border border-zinc-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSizeTab('apparel')}
                className={`px-4 py-2 uppercase font-bold transition ${
                  sizeTab === 'apparel'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Apparel (Tees / Hoodies)
              </button>
              <button
                type="button"
                onClick={() => setSizeTab('footwear')}
                className={`px-4 py-2 uppercase font-bold transition ${
                  sizeTab === 'footwear'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Footwear (UK / EU)
              </button>
            </div>
          </div>

          {sizeTab === 'apparel' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Chest</th>
                    <th className="py-3 px-4">Length</th>
                    <th className="py-3 px-4">Drop Shoulder</th>
                    <th className="py-3 px-4">Silhouette</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {apparelSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-zinc-950/70">
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        {row.size}
                      </td>
                      <td className="py-3 px-4 text-white">{row.chest}</td>
                      <td className="py-3 px-4 text-white">{row.length}</td>
                      <td className="py-3 px-4 text-zinc-300">{row.shoulder}</td>
                      <td className="py-3 px-4 text-zinc-400">{row.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                    <th className="py-3 px-4">UK Size</th>
                    <th className="py-3 px-4">EU Size</th>
                    <th className="py-3 px-4">US Size</th>
                    <th className="py-3 px-4">Foot Length (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {footwearSizes.map((row) => (
                    <tr key={row.uk} className="hover:bg-zinc-950/70">
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        {row.uk}
                      </td>
                      <td className="py-3 px-4 text-white">{row.eu}</td>
                      <td className="py-3 px-4 text-zinc-300">{row.us}</td>
                      <td className="py-3 px-4 text-white">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="font-mono text-[11px] text-zinc-400 bg-zinc-950 border border-zinc-800 p-3">
            FIT TIP: All AURA tops are cut in a structured boxy fit. Choose your true size for the intended drape, or size down once for a regular tailored silhouette.
          </p>
        </section>

        {/* SECTION 2: MATERIAL SPECIFICATIONS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
              <span>SPEC // 260 GSM</span>
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Heavyweight Combed Jersey
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              100% bio-washed ring-spun cotton engineered to hold collar structure and resist twisting after repeated washes.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
              <span>SPEC // 420 GSM</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Dense Terry & Tech Fleece
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-density loopback and brushed fleece built for warmth, wind resistance, and zero-sag cuffs.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
              <span>SPEC // OUTSOLE</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              High-Rebound EVA & Rubber
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dual-density cushioning paired with high-abrasion tread for all-day urban traction.
            </p>
          </div>
        </section>

        {/* SECTION 3: GARMENT CARE PROTOCOL */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h3 className="font-serif text-xl text-white">
            Wash & Maintenance Protocol
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1.5">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <p className="font-bold text-white">Cold Gentle Wash (30°C)</p>
              <p className="text-[11px] text-zinc-400">
                Turn garments inside out before washing to protect matte prints and dye depth.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1.5">
              <Wind className="w-4 h-4 text-emerald-400" />
              <p className="font-bold text-white">Flat Shade Dry</p>
              <p className="text-[11px] text-zinc-400">
                Dry flat in shade. Avoid high-heat tumble drying to preserve GSM density.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <p className="font-bold text-white">No Direct Iron on Prints</p>
              <p className="text-[11px] text-zinc-400">
                Use low steam from the reverse side only; avoid bleach or harsh detergents.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
