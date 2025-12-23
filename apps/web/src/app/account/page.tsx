import type { Metadata } from "next";
import Link from "next/link";
import styles from "./account.module.css";

export const metadata: Metadata = {
  title: "Account | Email Finder",
  description: "Manage your account, billing, and subscription details.",
};

const mockAccount = {
  email: "you@company.com",
  plan: "Pro Monthly",
  renewal: "Renews Feb 15, 2026",
  credits: "240 remaining",
};

export default function AccountPage() {
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
              <p className={styles.kicker}>Account</p>
              <h1>Profile & billing</h1>
              <p className={styles.subhead}>
                View your plan, renewal date, and credits. Manage billing in the
                Stripe customer portal.
              </p>
            </div>
            <a className={styles.primaryCta} href="/api/stripe-portal">
              Manage billing
            </a>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.label}>Account email</p>
              <p className={styles.value}>{mockAccount.email}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Plan</p>
              <p className={styles.value}>{mockAccount.plan}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Renewal</p>
              <p className={styles.value}>{mockAccount.renewal}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.label}>Credits</p>
              <p className={styles.value}>{mockAccount.credits}</p>
              <p className={styles.helper}>Credits are only used when an email is found.</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/forgot-password" className={styles.secondaryCta}>
              Reset password
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

