 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./subscription.module.css";

export const dynamic = "force-dynamic";

export default function SubscriptionPage() {
  const [isStarterLoading, setIsStarterLoading] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);

  const startCheckout = async (plan: "starter" | "pro") => {
    setError(null);
    plan === "starter" ? setIsStarterLoading(true) : setIsProLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Checkout failed (${res.status})`);
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing checkout url");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout";
      setError(message);
    } finally {
      setIsStarterLoading(false);
      setIsProLoading(false);
    }
  };

  useEffect(() => {
    const loadCredits = async () => {
      setIsCreditsLoading(true);
      setCreditsError(null);
      try {
        await fetch("/api/me", { cache: "no-store" });
        const res = await fetch("/api/credits", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load credits (${res.status})`);
        const data = await res.json();
        setCredits(typeof data.credits === "number" ? data.credits : null);
        setPlan(data.planName ?? data.plan ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load credits";
        setCreditsError(message);
      } finally {
        setIsCreditsLoading(false);
      }
    };
    void loadCredits();
  }, []);

  const displayPlan = plan ?? (isCreditsLoading ? "Loading…" : "Free Trial");
  const isTrial = displayPlan.toLowerCase().includes("trial");
  const creditsValue =
    credits !== null ? credits.toLocaleString() : isCreditsLoading ? "Loading…" : creditsError ? "—" : "—";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Nova Email Finder</span>
        </div>
        <Link href="/dashboard" className={styles.backLink}>
          Back to dashboard
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.kicker}>Subscription</p>
              <h1>Billing & plan</h1>
              <p className={styles.subhead}>
                {isTrial
                  ? "You’re on the free trial. Upgrade to unlock more credits and manage billing."
                  : "Manage your plan, credits, and billing portal access."}
              </p>
            </div>
            <a className={styles.primaryCta} href="/api/stripe/portal">
              Manage billing
            </a>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.label}>Plan</p>
              <p className={styles.value}>{displayPlan}</p>
              <p className={styles.helper}>
                {creditsError ? creditsError : isTrial ? "5 free credits to try the product." : "Active subscription."}
              </p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Upgrade</p>
              <p className={styles.value}>Starter or Pro</p>
              <p className={styles.helper}>Choose a plan to unlock more credits.</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Next step</p>
              <div className={styles.upgradeActions}>
                <button
                  className={styles.secondaryCta}
                  type="button"
                  onClick={() => startCheckout("starter")}
                  disabled={isStarterLoading || isProLoading}
                >
                  {isStarterLoading ? "Redirecting…" : "Upgrade to Starter"}
                </button>
                <button
                  className={styles.primaryCta}
                  type="button"
                  onClick={() => startCheckout("pro")}
                  disabled={isStarterLoading || isProLoading}
                >
                  {isProLoading ? "Redirecting…" : "Upgrade to Pro"}
                </button>
              </div>
              <p className={styles.helper}>Starter: $25/mo · 500 credits · Pro: $49/mo · 1000 credits</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Credits</p>
              <p className={styles.value}>{creditsValue} remaining</p>
              <p className={styles.helper}>Credits are only used when an email is found.</p>
            </div>
          </div>

          <div className={styles.planGrid}>
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <p className={styles.planName}>Starter</p>
                <p className={styles.planPrice}>
                  $25<span className={styles.planPriceUnit}>/mo</span>
                </p>
                <p className={styles.planNote}>500 credits · best for getting started</p>
              </div>
              <ul className={styles.featureList}>
                <li>Up to 500 found emails/month</li>
                <li>Save leads to your lists</li>
                <li>Billing portal & receipts</li>
                <li>Email finder & verifications</li>
              </ul>
              <button
                className={styles.primaryCta}
                type="button"
                onClick={() => startCheckout("starter")}
                disabled={isStarterLoading || isProLoading}
              >
                {isStarterLoading ? "Redirecting…" : "Upgrade to Starter"}
              </button>
            </div>

            <div className={`${styles.planCard} ${styles.planCardHighlight}`}>
              <div className={styles.planHeader}>
                <p className={styles.planBadge}>Most Popular</p>
                <p className={styles.planName}>Pro</p>
                <p className={styles.planPrice}>
                  $49<span className={styles.planPriceUnit}>/mo</span>
                </p>
                <p className={styles.planNote}>1000 credits · best for teams/volume</p>
              </div>
              <ul className={styles.featureList}>
                <li>Up to 1,000 found emails/month</li>
                <li>Priority credit refresh & support</li>
                <li>Full lead list management</li>
                <li>Billing portal & receipts</li>
              </ul>
              <button
                className={styles.primaryCta}
                type="button"
                onClick={() => startCheckout("pro")}
                disabled={isStarterLoading || isProLoading}
              >
                {isProLoading ? "Redirecting…" : "Upgrade to Pro"}
              </button>
            </div>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </section>
      </main>
    </div>
  );
}

