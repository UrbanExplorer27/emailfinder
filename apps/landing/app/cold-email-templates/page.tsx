"use client";

import Link from "next/link";

const templates = [
  { slug: "pain-point", title: "Pain-point opener" },
  { slug: "trigger-event", title: "Trigger-event follow-up" },
  { slug: "social-proof", title: "Social proof credibility" },
  { slug: "value-teaser", title: "Value teaser with CTA" },
  { slug: "re-engage", title: "Re-engage a cold thread" },
];

export default function TemplatesIndex() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 py-10 lg:py-14 space-y-10">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sm font-bold">
              EF
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Email Finder</p>
              <p className="text-sm text-white/80">Lead gen with a LinkedIn extension and any-company finder</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <details className="relative">
              <summary className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:border-white/30 hover:bg-white/10 transition cursor-pointer">
                Resources
                <span className="text-white/60">▼</span>
              </summary>
              <div className="dropdown-panel absolute right-0 mt-2 min-w-[200px] flex-col rounded-xl border border-white/10 bg-[#0f172a] p-2 shadow-xl shadow-black/30">
                <a href="/blog" className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
                  Blog
                </a>
                <a href="/cold-email-templates" className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
                  Cold email templates
                </a>
              </div>
            </details>
            <a
              href="/#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:border-white/30 hover:bg-white/10 transition"
            >
              View plans →
            </a>
          </div>
        </header>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Cold email templates</p>
          <h1 className="text-3xl sm:text-4xl font-bold">High-signal cold emails you can copy today</h1>
          <p className="text-white/75 max-w-2xl">
            Five proven templates for different situations—pain point, trigger events, social proof, value teaser, and
            re-engagement. Copy, personalize, send.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((t) => (
            <Link
              key={t.slug}
              href={`/cold-email-templates/${t.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/15 hover:border-white/25 transition"
            >
              <h2 className="text-xl font-semibold text-white">{t.title}</h2>
              <p className="text-sm text-white/70 mt-2">Open template →</p>
            </Link>
          ))}
        </div>

        <footer className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/60">
          <p>Built for teams that want predictable outbound—not guesswork.</p>
          <div className="flex gap-3">
            <a className="hover:text-white" href="/#pricing">
              Pricing
            </a>
            <a className="hover:text-white" href="/blog">
              Blog
            </a>
            <a className="hover:text-white" href="#">
              Get started
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

