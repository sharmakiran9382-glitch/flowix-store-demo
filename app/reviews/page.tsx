'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ShieldCheck,
  MessageSquarePlus,
  MapPin,
} from 'lucide-react';

interface ReviewEntry {
  id: number;
  author: string;
  city: string;
  product: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function AuraReviewsPage() {
  const initialReviews: ReviewEntry[] = [
    {
      id: 1,
      author: 'Rohan Kulkarni',
      city: 'Pune • PIN 411001',
      product: 'AURA 260GSM Core Boxy Tee',
      rating: 5,
      date: '18 Nov 2026',
      comment:
        'Fabric weight feels genuinely premium—collar sits flat even after multiple washes and the boxy drop-shoulder cut is spot on.',
      verified: true,
    },
    {
      id: 2,
      author: 'Ananya Sen',
      city: 'Kolkata • PIN 700019',
      product: 'AURA Storm-Flap Overcoat',
      rating: 5,
      date: '14 Nov 2026',
      comment:
        'Dispatched within 24 hours and delivered right on the estimated PIN date. Matte hardware and stitching quality beat much pricier labels.',
      verified: true,
    },
    {
      id: 3,
      author: 'Vikramaditya Rao',
      city: 'Bengaluru • PIN 560038',
      product: 'AURA Runner Low-Top Sneakers',
      rating: 5,
      date: '09 Nov 2026',
      comment:
        'Lightweight cushioning for all-day walking and the monochrome silhouette pairs with everything.',
      verified: true,
    },
    {
      id: 4,
      author: 'Kabir Mehta',
      city: 'New Delhi • PIN 110016',
      product: 'AURA 420GSM Tech Fleece Hoodie',
      rating: 4,
      date: '03 Nov 2026',
      comment:
        'Very thick and warm fleece with a structured double-lined hood. True to size for a relaxed fit.',
      verified: true,
    },
  ];

  const [reviews, setReviews] = useState<ReviewEntry[]>(initialReviews);
  const [starFilter, setStarFilter] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [productName, setProductName] = useState(
    'AURA 260GSM Core Boxy Tee'
  );
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewerName.trim() || !commentInput.trim()) return;

    const todayStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newEntry: ReviewEntry = {
      id: Date.now(),
      author: reviewerName.trim(),
      city: reviewerCity.trim() || 'India • Verified PIN',
      product: productName,
      rating: ratingInput,
      date: todayStr,
      comment: commentInput.trim(),
      verified: true,
    };

    setReviews([newEntry, ...reviews]);
    setReviewerName('');
    setReviewerCity('');
    setCommentInput('');
    setRatingInput(5);
    showToast('Review published to AURA Buyer Feed!');
  }

  const visibleReviews =
    starFilter === 0
      ? reviews
      : reviews.filter((r) => r.rating === starFilter);

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

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
                AURA // FIELD REPORTS
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Verified Buyer Reviews
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
        {/* RATING SUMMARY BANNER */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% VERIFIED ORDER FEEDBACK</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-mono font-bold text-white">
                {avgRating}
              </span>
              <span className="font-mono text-sm text-zinc-400">/ 5.0</span>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              Based on {reviews.length} verified deliveries across India.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {[0, 5, 4].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStarFilter(st)}
                className={
                  starFilter === st
                    ? 'px-3.5 py-2 uppercase font-bold border bg-emerald-500 text-black border-emerald-500'
                    : 'px-3.5 py-2 uppercase border bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }
              >
                {st === 0 ? 'All Reviews' : `${st} ★ Only`}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: WRITE A REVIEW FORM */}
          <form
            onSubmit={handleAddReview}
            className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 space-y-4 text-xs h-fit"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit Product Review</span>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                City / PIN (Optional)
              </label>
              <input
                type="text"
                value={reviewerCity}
                onChange={(e) => setReviewerCity(e.target.value)}
                placeholder="e.g. Mumbai • PIN 400001"
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Product Purchased
              </label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2.5 font-mono bg-zinc-950 border border-zinc-700 text-white"
              >
                <option value="AURA 260GSM Core Boxy Tee">
                  AURA 260GSM Core Boxy Tee
                </option>
                <option value="AURA Storm-Flap Overcoat">
                  AURA Storm-Flap Overcoat
                </option>
                <option value="AURA Runner Low-Top Sneakers">
                  AURA Runner Low-Top Sneakers
                </option>
                <option value="AURA 420GSM Tech Fleece Hoodie">
                  AURA 420GSM Tech Fleece Hoodie
                </option>
                <option value="AURA Chrono & Optics Kit">
                  AURA Chrono & Optics Kit
                </option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Rating
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRatingInput(num)}
                    className={`px-3 py-1.5 font-mono font-bold border ${
                      ratingInput >= num
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {num} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                Your Experience *
              </label>
              <textarea
                rows={3}
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share feedback on fabric GSM, fit, or PIN delivery speed..."
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 text-black font-mono font-black uppercase tracking-widest hover:bg-emerald-400 transition"
            >
              Post Review
            </button>
          </form>

          {/* RIGHT: REVIEWS FEED */}
          <div className="lg:col-span-7 space-y-4">
            {visibleReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-zinc-900 border border-zinc-800 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {rev.author}
                      </h3>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{rev.city}</span>
                      <span>• {rev.date}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  ITEM: {rev.product}
                </div>

                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
