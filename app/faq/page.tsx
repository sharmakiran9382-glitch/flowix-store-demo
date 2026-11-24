'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

interface FaqItem {
  id: number;
  category: 'Shipping & PIN' | 'Returns & Size' | 'Payments & Coupons';
  question: string;
  answer: string;
}

export default function AuraFaqPage() {
  const faqList: FaqItem[] = [
    {
      id: 1,
      category: 'Shipping & PIN',
      question: 'How does PIN-based dispatch and delivery estimation work?',
      answer:
        'When you enter your 6-digit delivery PIN at bag or checkout, our system calculates your exact dispatch window (typically within 24–48 hours) and estimated delivery timeline (3–4 days for metro PIN codes and 4–5 days for rest of India).',
    },
    {
      id: 2,
      category: 'Shipping & PIN',
      question: 'Where can I track my order after placing it?',
      answer:
        'Immediately after placing your order, you receive a unique Order ID (e.g. FLX-XXXXXX). Visit the Track Order (/orders) page or sign in to My Account (/account) to view live packing, shipping, and delivery stages.',
    },
    {
      id: 3,
      category: 'Shipping & PIN',
      question: 'Is shipping free on AURA orders?',
      answer:
        'Yes. Express dispatch is completely FREE on all orders of ₹1,999 and above. For orders below ₹1,999, a flat ₹99 standard shipping fee applies.',
    },
    {
      id: 4,
      category: 'Returns & Size',
      question: 'What is the return and size exchange policy?',
      answer:
        'We offer a hassle-free 7-day return and size exchange window from the date of delivery. Items must be unworn, unwashed, and have original AURA tags intact.',
    },
    {
      id: 5,
      category: 'Returns & Size',
      question: 'How do I pick the right fit for AURA boxy tees and hoodies?',
      answer:
        'AURA tees and hoodies are engineered with a structured drop-shoulder boxy silhouette. Stick to your regular size for the intended relaxed drape, or size down one step for a closer fit.',
    },
    {
      id: 6,
      category: 'Payments & Coupons',
      question: 'What payment methods are accepted?',
      answer:
        'You can pay via Cash on Delivery (COD) across serviceable PIN codes or choose Instant UPI / Online Payment at checkout.',
    },
    {
      id: 7,
      category: 'Payments & Coupons',
      question: 'How do I apply promo codes like FLOWIX10 or WELCOME200?',
      answer:
        'Open your AURA Bag or Checkout page, enter FLOWIX10 (10% off) or WELCOME200 (₹200 flat off) in the Promo Code field, and click Apply before placing your order.',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<number | null>(1);

  const categories = [
    'All',
    'Shipping & PIN',
    'Returns & Size',
    'Payments & Coupons',
  ];

  const filteredFaqs = faqList.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      q === '' ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

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
                AURA // KNOWLEDGE BASE
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                Frequently Asked Questions
              </h1>
            </div>
          </div>

          <a
            href="/contact"
            className="px-3.5 py-2 border border-zinc-800 bg-zinc-900 font-mono text-xs text-emerald-400 hover:border-emerald-500"
          >
            Support Desk
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* SEARCH & CATEGORY FILTERS */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>QUICK ANSWERS</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3.5 py-2.5">
            <Search className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PIN delivery, returns, sizing, promo codes..."
              className="w-full bg-transparent text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={
                  selectedCategory === cat
                    ? 'px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border bg-emerald-500 text-black border-emerald-500'
                    : 'px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider border bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ACCORDION QUESTIONS */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 p-8 text-center font-mono text-xs text-zinc-400">
              No matching questions found. Try clearing your search filter.
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-zinc-900 border transition ${
                    isOpen ? 'border-emerald-500/60' : 'border-zinc-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                        {item.category}
                      </span>
                      <h2 className="text-sm md:text-base font-semibold text-white">
                        {item.question}
                      </h2>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-zinc-800/80 text-xs md:text-sm text-zinc-300 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* STILL NEED HELP CTA */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              DIRECT ASSISTANCE
            </p>
            <p className="text-sm text-zinc-300">
              Didn&apos;t find what you were looking for? Reach out to our support desk.
            </p>
          </div>
          <a
            href="/contact"
            className="px-5 py-3 bg-emerald-500 text-black font-mono text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Us</span>
          </a>
        </div>
      </main>
    </div>
  );
}
