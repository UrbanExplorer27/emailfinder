const stats = [
  { label: "Leads enriched", value: "120k+" },
  { label: "Avg. match rate", value: "78%" },
  { label: "Time saved / rep", value: "4h / wk" },
];

const painPoints = [
  "Prospecting stalls because emails are missing or bounce.",
  "Your team wastes time copy/pasting from LinkedIn into spreadsheets.",
  "Bulk email finders burn credits on junk results.",
];

const solutions = [
  "LinkedIn overlay + Chrome extension that grabs name + company and returns only verified emails (result = ok).",
  "Web app + lead lists and a standalone finder—drop in any name + company and get the email.",
  "Mass CSV lookup for paid plans—free trial gets 5 credits to prove it works.",
];

const steps = [
  { title: "Open LinkedIn", desc: "Click the extension on any profile; we pull name and company instantly." },
  { title: "Find & verify", desc: "We call our API, return only result=ok emails, and stop charging on junk." },
  { title: "Save & act", desc: "Add to a lead list, export, or trigger your outreach. Billing handled by Stripe." },
];

const plans = [
  { name: "Free trial", price: "$0", detail: "5 credits to prove it works", cta: "Start free", highlight: false },
  { name: "Starter", price: "$25/mo", detail: "500 credits + mass lookup", cta: "Upgrade to Starter", highlight: true },
  { name: "Pro", price: "$49/mo", detail: "1,000 credits + priority API", cta: "Upgrade to Pro", highlight: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 py-10 lg:py-14">
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
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:border-white/30 hover:bg-white/10 transition"
          >
            View plans →
          </a>
        </header>

        <main className="mt-10 space-y-14 lg:space-y-16">
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] items-start">
            <div className="space-y-6">
              <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100">
                <span className="inline-flex items-center gap-1">
                  Built for LinkedIn & Chrome extension
                </span>
                <span className="inline-flex items-center gap-1 text-white/80">•</span>
                <span className="inline-flex items-center gap-1">Works anywhere you have a name + company</span>
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Find verified emails from LinkedIn—or anywhere—without burning credits.
              </h1>
              <p className="text-lg text-white/80">
                Chrome extension for LinkedIn, plus a web finder for any name + company. We only count “found” when the
                result is ok—no credits wasted on invalid_mx or email_disabled.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#pricing"
                  className="inline-flex justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40"
                >
                  Start free — 5 credits
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  See how it works
                </a>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm">
                {stats.map((s) => (
                  <div key={s.label} className="space-y-1">
                    <p className="text-xl font-bold text-white">{s.value}</p>
                    <p className="text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 shadow-xl shadow-sky-500/10">
              <p className="text-sm font-semibold text-sky-100">Why teams switch</p>
              <ul className="space-y-3 text-white/85">
                {painPoints.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="h-px w-full bg-white/10" />
              <p className="text-sm font-semibold text-sky-100">How we solve it</p>
              <ul className="space-y-3 text-white/85">
                {solutions.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="how-it-works" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-200">How it works</p>
                <h2 className="text-2xl font-bold text-white">From profile to outreach in three steps</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/10"
                >
                  <div className="flex items-center gap-2 text-sky-200 text-sm font-semibold mb-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
                      {i + 1}
                    </span>
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-white/75 mt-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent p-6 shadow-xl shadow-sky-500/20">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Chrome extension</p>
              <h3 className="mt-2 text-xl font-bold text-white">LinkedIn overlay</h3>
              <p className="text-white/75 mt-2">
                On any LinkedIn profile, we auto-capture name + company, call our verifier, and only mark “found” when
                result=ok. Save to a list without leaving the page.
              </p>
              <ul className="mt-3 space-y-2 text-white/80 text-sm">
                <li>• One-click lookup on profile</li>
                <li>• Save to lead lists, export later</li>
                <li>• No credits burned on invalid results</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent p-6 shadow-xl shadow-emerald-500/20">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Web + API</p>
              <h3 className="mt-2 text-xl font-bold text-white">Find anyone’s email</h3>
              <p className="text-white/75 mt-2">
                Type a name + company domain in the web app, or upload a CSV for mass lookup (Starter/Pro). The same
                verifier and credit rules apply—only ok results are counted.
              </p>
              <ul className="mt-3 space-y-2 text-white/80 text-sm">
                <li>• Single lookup: name + company domain</li>
                <li>• Mass CSV lookup for paid plans</li>
                <li>• Lead lists stay synced with the extension</li>
              </ul>
            </div>
          </section>

          <section id="pricing" className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-sky-500/10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Pricing</p>
                <h2 className="text-2xl font-bold text-white">Start free, upgrade when you’re ready</h2>
                <p className="text-white/75">
                  Free trial: 5 credits. Starter: 500 credits. Pro: 1,000 credits. Stripe-powered billing.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40"
              >
                Get started
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-4 ${
                    plan.highlight ? "border-sky-400 bg-white/10 shadow-lg shadow-sky-500/20" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-sm font-semibold text-sky-100">{plan.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">{plan.price}</p>
                  <p className="text-sm text-white/70 mb-3">{plan.detail}</p>
                  <a
                    href="#"
                    className={`inline-flex w-full justify-center rounded-full px-4 py-2 text-sm font-semibold ${
                      plan.highlight
                        ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-md shadow-sky-500/30"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Why it converts</p>
              <h2 className="text-2xl font-bold text-white">Only verified results count as “found”</h2>
              <p className="text-white/75">
                We only mark “found” when the result code is ok. No credits burned on invalid_mx, email_disabled, or
                redirects. That means cleaner lists and fewer bounces.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-sky-100">Extension + web app</p>
                <p className="text-white/75 mt-2">
                  Use the Chrome extension on LinkedIn; manage credits, lead lists, mass CSV, and billing in the web app.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-sky-100">Lead lists that stay synced</p>
                <p className="text-white/75 mt-2">
                  Save to lists right from the extension or dashboard, export anytime, and keep your team aligned.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Why this matters</p>
            <h2 className="text-2xl font-bold text-white">You don’t have a lead problem. You have an access problem.</h2>
            <div className="space-y-3 text-white/80 leading-relaxed">
              <p>
                Most outbound campaigns fail before the first message is ever read. Not because the offer is wrong or the
                copy is weak—but because the person was never truly reachable. A guessed email, a stale address, or a bad list
                quietly kills the opportunity and leaves you wondering what went wrong.
              </p>
              <p>
                Email remains the highest-converting way to start a real business conversation. It’s private. It allows follow-up.
                It creates a paper trail you can measure and improve. But only if the address is good. Bad data doesn’t just waste a
                send—it muddies results, damages sender reputation, and makes every future campaign harder to trust.
              </p>
              <p>
                This tool exists to fix the very first link in the chain. It turns “this is the person I want” into “this is someone
                I can actually reach.” By removing unreliable inputs, it gives you clean signal: when outreach underperforms, you
                know why—and when it works, you can repeat it with confidence. No guessing whether the problem was the list, the
                message, or the channel.
              </p>
              <p className="font-semibold text-white">
                Good outbound isn’t about sending more emails. It’s about making contact—and knowing when you have. That’s what this tool
                is built to do.
              </p>
            </div>
          </section>
        </main>

        <footer className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/60">
          <p>Built for outbound teams who live on LinkedIn.</p>
          <div className="flex gap-3">
            <a className="hover:text-white" href="#pricing">
              Pricing
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
