"use client";

export default function SocialProofTemplate() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Template</p>
          <h1 className="text-3xl font-bold">Social proof credibility</h1>
          <p className="text-white/75">
            Lead with a peer result and make a concise, relevant offer.
          </p>
        </header>

        <article className="space-y-4 text-white/80 text-sm bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p>Subject: Quick win we just saw at [peer]</p>
          <p>Hi [Name],</p>
          <p>
            We helped [peer customer] get [specific outcome] in [timeframe] by fixing [problem]. Given you’re also [similar
            role/company], the same approach could apply.
          </p>
          <p>Two lines on how we did it if helpful. Want me to send?</p>
          <p>– [You]</p>
        </article>
      </div>
    </div>
  );
}

