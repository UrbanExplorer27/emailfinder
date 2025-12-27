"use client";

import { useState } from "react";

const stats = [
  { label: "120k+ prospects turned into reachable contacts", value: "120k+" },
  { label: "Consistent access you can plan around", value: "78%" },
  { label: "Hours reclaimed from cleanup and guesswork", value: "4h / wk" },
];

const painPoints = [
  "A prospect isn’t an opportunity until you can actually reach them.",
  "Bad data creates cleanup work that steals time from making contact.",
  "Most email tools introduce uncertainty instead of removing it.",
];

const solutions = [
  "Turn a LinkedIn profile into a reachable opportunity—without guessing.",
  "Move from “this is the lead” to “this is a real contact” in one step.",
  "Mass CSV lookup for paid plans—free trial gets 5 credits to prove it works.",
];

const steps = [
  { title: "Choose the prospect you want to contact", desc: "Start with the person—not a list or a guess." },
  { title: "Remove guesswork from outreach", desc: "Bad data is filtered out before it reaches your campaign." },
  {
    title: "Focus on making contact",
    desc: "Move straight to outreach without cleanup or second-guessing. Pay only for results you can actually use.",
  },
];

const plans = [
  { name: "Free trial", price: "$0", detail: "5 credits to prove it works", cta: "Start free", highlight: false },
  { name: "Starter", price: "$25/mo", detail: "500 credits + mass lookup", cta: "Upgrade to Starter", highlight: true },
  { name: "Pro", price: "$49/mo", detail: "1,000 credits + priority API", cta: "Upgrade to Pro", highlight: false },
];

const sampleLeads = [
  { name: "Jordan Blake", company: "Northwind Labs", domain: "northwindlabs.com", email: "jordan.blake@northwindlabs.com" },
  { name: "Casey Morgan", company: "Acme Ventures", domain: "acmeventures.com", email: "casey@acmeventures.com" },
  { name: "Taylor Reed", company: "Blue Horizon", domain: "bluehorizon.ai", email: "taylor.reed@bluehorizon.ai" },
];

function TryItDemo() {
  const [leadIndex, setLeadIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "checking" | "found">("idle");
  const lead = sampleLeads[leadIndex];

  const onTry = async () => {
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("found");
  };

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-sky-500/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">See it in action</p>
          <h3 className="text-xl font-bold text-white">Try it with sample data</h3>
          <p className="text-white/75 text-sm">
            Pick a sample prospect, click “Find email,” and see how result=ok returns a usable email without burning credits on junk.
          </p>
        </div>
        <div className="flex gap-2">
          {sampleLeads.map((item, idx) => (
            <button
              key={item.email}
              onClick={() => {
                setLeadIndex(idx);
                setStatus("idle");
              }}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                idx === leadIndex ? "border-sky-400 bg-white/10 text-white" : "border-white/15 text-white/70 hover:border-white/40"
              }`}
            >
              {item.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-3">
          <div className="grid gap-2 text-sm">
            <label className="text-white/70">Full name</label>
            <input
              value={lead.name}
              readOnly
              className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white placeholder:text-white/40"
            />
          </div>
          <div className="grid gap-2 text-sm">
            <label className="text-white/70">Company domain</label>
            <input
              value={lead.domain}
              readOnly
              className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white placeholder:text-white/40"
            />
          </div>
          <button
            onClick={onTry}
            className="w-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30"
          >
            {status === "checking" ? "Checking…" : "Find email"}
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 shadow-lg shadow-black/20 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60">Result</p>
              <p className="text-white font-semibold">
                {status === "found" ? lead.email : status === "checking" ? "Verifying…" : "—"}
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                status === "found"
                  ? "border-emerald-400 text-emerald-300 bg-emerald-400/10"
                  : status === "checking"
                    ? "border-sky-300 text-sky-200 bg-sky-300/10"
                    : "border-white/20 text-white/70"
              }`}
            >
              {status === "found" ? "found" : status === "checking" ? "checking" : "idle"}
            </span>
          </div>
          <p className="text-white/70">
            We filter out bad data before it reaches your campaign. Only result=ok counts as “found.”
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/15 px-2 py-1">Save to list</span>
            <span className="rounded-full border border-white/15 px-2 py-1">Export</span>
            <span className="rounded-full border border-white/15 px-2 py-1">No credits on junk</span>
          </div>
        </div>
      </div>
    </section>
  );
}

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
          <div className="hidden sm:flex items-center gap-3">
            <details className="relative">
              <summary className="list-none inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:border-white/30 hover:bg-white/10 transition cursor-pointer">
                Resources
                <span className="text-white/60">▼</span>
              </summary>
              <div className="absolute right-0 mt-2 min-w-[200px] flex-col rounded-xl border border-white/10 bg-[#0f172a] p-2 shadow-xl shadow-black/30">
                <a href="/blog" className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
                  Blog
                </a>
                <a href="/cold-email-templates" className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
                  Cold email templates
                </a>
              </div>
            </details>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:border-white/30 hover:bg-white/10 transition"
            >
              View plans →
            </a>
          </div>
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
                Turn prospects into real opportunities.
              </h1>
              <p className="text-lg text-white/80">
                Get direct access to email—the most effective way to start real conversations. Remove guesswork from outbound
                by eliminating bad data at the source.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#pricing"
                  className="inline-flex justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40"
                >
                  Get direct access to real prospects
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
              <p className="text-sm font-semibold text-sky-100">Why outbound breaks—and how to fix it</p>
              <ul className="space-y-3 text-white/85">
                {painPoints.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="h-px w-full bg-white/10" />
              <p className="text-sm font-semibold text-sky-100">How outbound becomes predictable</p>
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

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/15">
            <h2 className="text-2xl font-bold text-white">Turn prospects into real opportunities.</h2>
            <p className="text-white/80">
              Email is still the most effective way to start a business conversation. But most email finder tools create a
              new problem: bad data. Bad data means more cleanup, more second-guessing, and more time spent fixing lists
              instead of making contact. This tool removes that friction at the source. It strips out guesswork from your
              outreach so you can focus on reaching the people you chose—without paying for results you can’t use.
            </p>
          </section>

          <TryItDemo />

          <section id="how-it-works" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-200">How it works</p>
                <h2 className="text-2xl font-bold text-white">Turn prospects into real opportunities</h2>
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
              <h3 className="mt-2 text-xl font-bold text-white">Direct access from LinkedIn profiles</h3>
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
              <h3 className="mt-2 text-xl font-bold text-white">Turn names into real conversations</h3>
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
              <h2 className="text-2xl font-bold text-white">Outbound works when the inputs are reliable</h2>
              <p className="text-white/75">
                We only mark “found” when the result code is ok. No credits burned on invalid_mx, email_disabled, or
                redirects. That means cleaner lists and fewer bounces.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-sky-100">Outbound works when the inputs are reliable</p>
                <p className="text-white/75 mt-2">
                  Use the Chrome extension on LinkedIn; manage credits, lead lists, mass CSV, and billing in the web app.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-sky-100">Built for teams that want predictable outbound—not guesswork.</p>
                <p className="text-white/75 mt-2">
                  Save to lists right from the extension or dashboard, export anytime, and keep your team aligned.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/60">
          <p>Built for teams that want predictable outbound—not guesswork.</p>
          <div className="flex gap-3">
            <a className="hover:text-white" href="#pricing">
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
