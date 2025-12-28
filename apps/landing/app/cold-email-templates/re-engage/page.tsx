"use client";

export default function ReEngageTemplate() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Template</p>
          <h1 className="text-3xl font-bold">Re-engage a cold thread</h1>
          <p className="text-white/75">
            Acknowledge the silence, add a new angle, and make it easy to respond.
          </p>
        </header>

        <article className="space-y-4 text-white/80 text-sm bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p>Subject: Still relevant?</p>
          <p>Hi [Name],</p>
          <p>
            I didn’t hear back after my note on [topic]. Sharing one more angle: we recently helped [peer] solve [problem] and
            saw [result]. If [goal] is still on your list, happy to send the short rundown.
          </p>
          <p>Otherwise, I’ll close the loop. Either way works—just let me know.</p>
          <p>– [You]</p>
        </article>
      </div>
    </div>
  );
}

