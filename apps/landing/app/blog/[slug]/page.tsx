"use client";

import Link from "next/link";

const samplePost = {
  title: "Clean data makes outbound predictable",
  date: "2025-01-15",
  tags: ["Outbound", "Data quality"],
  hero:
    "Eliminate bad data before it reaches your lists. Keep credits for results you can actually use, and give reps certainty on access.",
  body: [
    "Email is still the fastest way to start a business conversation—but only if the address is valid. When invalid_mx and email_disabled leak into your lists, reps lose time cleaning and confidence stalls.",
    "We filter out junk at the source: result=ok is the only state that counts as “found.” Credits aren’t burned on bad rows. The Chrome extension captures name + company from LinkedIn; the web app and CSV import handle everyone else.",
    "Lead lists stay synced between the extension and the app. Save, export, or kick off outreach with data you can trust. Predictable access means you can forecast, sequence, and measure without second-guessing.",
  ],
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-8">
        <div className="flex items-center justify-between text-sm text-white/70">
          <Link href="/blog" className="hover:text-white">
            ← Back to blog
          </Link>
          <div className="flex gap-2">
            {samplePost.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{samplePost.date}</p>
          <h1 className="text-3xl font-bold leading-tight">{samplePost.title}</h1>
          <p className="text-lg text-white/80">{samplePost.hero}</p>
        </header>

        <article className="prose prose-invert prose-headings:text-white prose-p:text-white/80 prose-a:text-sky-200 max-w-none">
          {samplePost.body.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </article>
      </div>
    </div>
  );
}

