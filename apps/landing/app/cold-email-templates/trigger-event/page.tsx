"use client";

export default function TriggerEventTemplate() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-6">
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

        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Template</p>
          <h1 className="text-3xl font-bold">Trigger-event follow-up</h1>
          <p className="text-white/75">
            React to a public signal (hiring, launch, funding) and tie it to a clear, relevant outcome.
          </p>
        </header>

        <article className="space-y-4 text-white/80 text-sm bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p>Subject: Saw your [trigger] – quick idea</p>
          <p>Hi [Name],</p>
          <p>
            Congrats on the [trigger event]. Teams in this stage often need [outcome] to support the momentum. We just helped
            [peer] do [result] after their [similar trigger].
          </p>
          <p>
            If [outcome] is on your list this quarter, I can share the 2–3 steps that made the biggest difference. Up for a
            quick reply?
          </p>
          <p>– [You]</p>
        </article>

        <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/60">
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

