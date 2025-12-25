 "use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./subscription.module.css";

export const dynamic = "force-dynamic";

export default function SubscriptionPage() {
  const [isStarterLoading, setIsStarterLoading] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
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
                You’re on the free trial. Upgrade to unlock more credits and manage billing.
              </p>
            </div>
            <a className={styles.primaryCta} href="/api/stripe/portal">
              Manage billing
            </a>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.label}>Plan</p>
              <p className={styles.value}>Free Trial</p>
              <p className={styles.helper}>5 free credits to try the product.</p>
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
              <p className={styles.value}>5 remaining</p>
              <p className={styles.helper}>Credits are only used when an email is found.</p>
            </div>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </section>
      </main>
    </div>
  );
}

