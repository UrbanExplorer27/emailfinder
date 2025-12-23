import type { Metadata } from "next";
import Link from "next/link";
import styles from "./signup.module.css";

export const metadata: Metadata = {
  title: "Sign up | Email Finder",
  description:
    "Create your account to find verified professional emails by name and domain.",
};

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.formCard}>
          <p className={styles.kicker}>Get started free</p>
          <h1>Create your account</h1>
          <p className={styles.subhead}>
            We’ll add Clerk + Stripe shortly. For now, use your work email to
            preview the onboarding flow.
          </p>

          <form className={styles.form}>
            <label className={styles.label}>
              <span>Full name</span>
              <input
                className={styles.input}
                name="fullName"
                type="text"
                placeholder="Avery Chen"
                autoComplete="name"
                required
              />
            </label>

            <label className={styles.label}>
              <span>Work email</span>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="avery@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label className={styles.label}>
              <span>Company domain</span>
              <input
                className={styles.input}
                name="domain"
                type="text"
                placeholder="company.com"
                autoComplete="organization"
                required
              />
            </label>

            <label className={styles.label}>
              <span>Password</span>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
            </label>

            <button type="button" className={styles.submitButton}>
              Create account
            </button>
          </form>

          <p className={styles.disclaimer}>
            By continuing, you agree to our acceptable use and email verification
            policies.
          </p>
          <p className={styles.switch}>
            Already have an account? <Link href="/signin">Sign in</Link>
          </p>
        </section>

        <section className={styles.sidePanel}>
          <p className={styles.kicker}>What you get</p>
          <ul className={styles.list}>
            <li>
              <strong>Verified emails</strong> — Real-time checks before you
              export or sync.
            </li>
            <li>
              <strong>Domain accuracy</strong> — Uses both name + domain to avoid
              false positives.
            </li>
            <li>
              <strong>Team-ready</strong> — Role-based access and usage tracking
              planned.
            </li>
          </ul>

          <div className={styles.note}>
            Next up: wire this form to Clerk for auth, plus Stripe for billing
            and usage limits.
          </div>
        </section>
      </main>
    </div>
  );
}

