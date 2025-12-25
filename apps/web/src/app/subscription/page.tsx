import type { Metadata } from "next";
import Link from "next/link";
import styles from "./subscription.module.css";

export const metadata: Metadata = {
  title: "Subscription | Email Finder",
  description: "Manage your plan, renewal, and billing portal access.",
};

export const dynamic = "force-dynamic";

const mockSubscription = {
  plan: "Pro Monthly",
  renewal: "Renews Feb 15, 2026",
  credits: "240 remaining",
  billingEmail: "you@company.com",
};

export default function SubscriptionPage() {
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
                View your plan, renewal date, and credits. Manage billing in the Stripe
                customer portal.
              </p>
            </div>
            <a className={styles.primaryCta} href="/api/stripe-portal">
              Manage billing
            </a>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.label}>Plan</p>
              <p className={styles.value}>{mockSubscription.plan}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Renewal</p>
              <p className={styles.value}>{mockSubscription.renewal}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Credits</p>
              <p className={styles.value}>{mockSubscription.credits}</p>
              <p className={styles.helper}>Credits are only used when an email is found.</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Billing email</p>
              <p className={styles.value}>{mockSubscription.billingEmail}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

