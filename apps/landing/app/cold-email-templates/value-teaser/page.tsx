"use client";

export default function ValueTeaserTemplate() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Template</p>
          <h1 className="text-3xl font-bold">Value teaser with CTA</h1>
          <p className="text-white/75">
            Offer a concise, specific value and a single next step.
          </p>
        </header>

        <article className="space-y-4 text-white/80 text-sm bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p>Subject: A quick win for [team/metric]</p>
          <p>Hi [Name],</p>
          <p>
            I noticed you’re focused on [goal]. We’ve been helping teams like [peer] get [specific lift] without changing
            their stack—just by addressing [bottleneck].
          </p>
          <p>If I share the 2-step outline we used, would you take a look?</p>
          <p>– [You]</p>
        </article>
      </div>
    </div>
  );
}

