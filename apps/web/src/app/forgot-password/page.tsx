import type { Metadata } from "next";
import Link from "next/link";
import styles from "./forgot-password.module.css";

export const metadata: Metadata = {
  title: "Forgot password | Email Finder",
  description: "Reset your Email Finder password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
        <Link href="/signin" className={styles.backLink}>
          Back to sign in
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.formCard}>
          <p className={styles.kicker}>Reset access</p>
          <h1>Forgot your password?</h1>
          <p className={styles.subhead}>
            Enter your work email and we’ll send instructions to reset your
            password.
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

            <button type="button" className={styles.submitButton}>
              Send reset link
            </button>
          </form>

          <p className={styles.switch}>
            Remembered it? <Link href="/signin">Back to sign in</Link>
          </p>
        </section>
      </main>
    </div>
  );
}




