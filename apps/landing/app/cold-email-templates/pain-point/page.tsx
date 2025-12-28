"use client";

export default function PainPointTemplate() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Template</p>
          <h1 className="text-3xl font-bold">Pain-point opener</h1>
          <p className="text-white/75">
            Directly address a known pain and ask for a brief reply to confirm it’s a priority.
          </p>
        </header>

        <article className="space-y-4 text-white/80 text-sm bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg shadow-black/20">
          <p>Subject: Quick question about [pain area]</p>
          <p>Hi [Name],</p>
          <p>
            I noticed [specific pain] is common for [role/team]. We’ve helped teams like [peer company] cut this down by
            [outcome]. Is [pain] something you’re actively solving this quarter?
          </p>
          <p>Worth a quick reply either way.</p>
          <p>– [You]</p>
        </article>
      </div>
    </div>
  );
}

