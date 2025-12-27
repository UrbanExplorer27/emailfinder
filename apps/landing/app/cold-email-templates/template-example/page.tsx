"use client";

import Link from "next/link";

export default function ColdEmailTemplateExample() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-8">
        <div className="flex items-center justify-between text-sm text-white/70">
          <Link href="/cold-email-templates" className="hover:text-white">
            ← Back to templates
          </Link>
          <div className="flex gap-2">
            <span className="rounded-full border border-white/15 px-2 py-1 text-xs">cold email template</span>
            <span className="rounded-full border border-white/15 px-2 py-1 text-xs">follow-up</span>
          </div>
        </div>

        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">2025-01-20</p>
          <h1 className="text-3xl font-bold leading-tight">Follow-up after no reply (short)</h1>
          <p className="text-lg text-white/80">
            A concise follow-up when someone opened but didn’t respond. Keeps the ask simple and actionable.
          </p>
        </header>

        <article className="prose prose-invert prose-headings:text-white prose-p:text-white/80 prose-a:text-sky-200 max-w-none">
          <h2>When to use this</h2>
          <ul>
            <li>They opened your first email but didn’t reply.</li>
            <li>You have a single, clear next step you want them to take.</li>
          </ul>

          <h2>Subject lines</h2>
          <ul>
            <li>"Quick follow-up for {{company}}"</li>
            <li>"Idea for {{team}}"</li>
          </ul>

          <h2>Body</h2>
          <p>Hi {{first_name}},</p>
          <p>
            Following up on my note about {{problem}}. We help {{similar_customer}} cut {{pain}} and have a quick idea for
            {{company}}.
          </p>
          <p>Open to a 10-minute chat this week?</p>
          <p>Thanks,<br />{{your_name}}</p>

          <h2>Variations</h2>
          <ul>
            <li>Shorter ask: “Mind if I send a 2-line idea?”</li>
            <li>More direct: “Who owns {{problem}} at {{company}}?”</li>
          </ul>

          <h2>Tips</h2>
          <ul>
            <li>One CTA only.</li>
            <li>Keep it under 5 lines.</li>
            <li>Mention a proof point only if it’s relevant (one line max).</li>
          </ul>
        </article>
      </div>
    </div>
  );
}

