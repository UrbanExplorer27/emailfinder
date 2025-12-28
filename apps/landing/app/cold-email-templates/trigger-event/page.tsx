"use client";

export default function TriggerEventTemplate() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-6">
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
      </div>
    </div>
  );
}

