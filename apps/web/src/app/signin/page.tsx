import type { Metadata } from "next";
import Link from "next/link";
import styles from "./signin.module.css";

export const metadata: Metadata = {
  title: "Sign in | Email Finder",
  description:
    "Access your Email Finder account to search and verify professional emails.",
};

export default function SigninPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
        <Link href="/signup" className={styles.backLink}>
          Create account
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.formCard}>
          <p className={styles.kicker}>Welcome back</p>
          <h1>Sign in to continue</h1>
          <p className={styles.subhead}>
            Enter your work email and password. We’ll wire this to Clerk for
            authentication next.
          </p>

          <form className={styles.form}>
            <label className={styles.label}>
              <span>Work email</span>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label className={styles.label}>
              <span>Password</span>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="button" className={styles.submitButton}>
              Sign in
            </button>
          </form>

          <p className={styles.switch}>
            New here? <Link href="/signup">Create an account</Link>
          </p>
        </section>

        <section className={styles.sidePanel}>
          <p className={styles.kicker}>Why teams sign in</p>
          <ul className={styles.list}>
            <li>
              <strong>Verified lookups</strong> — Keep bounce rates low with
              checked addresses.
            </li>
            <li>
              <strong>Usage visibility</strong> — Track searches across your
              team.
            </li>
            <li>
              <strong>Exports</strong> — Save verified contacts for outreach tools.
            </li>
          </ul>

          <div className={styles.note}>
            Coming soon: SSO + magic links via Clerk, plus rate limits tied to
            Stripe plans.
          </div>
        </section>
      </main>
    </div>
  );
}

