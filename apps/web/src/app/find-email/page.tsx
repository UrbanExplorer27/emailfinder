import type { Metadata } from "next";
import Link from "next/link";
import styles from "./find-email.module.css";

export const metadata: Metadata = {
  title: "Find an Email | Email Finder",
  description: "Look up a professional email by name and domain.",
};

export default function FindEmailPage() {
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
          <p className={styles.kicker}>Find an email</p>
          <h1>Search by name + domain</h1>
          <p className={styles.subhead}>
            Enter the person’s full name and their company domain. We’ll suggest
            the best-match email.
          </p>

          <form className={styles.form}>
            <label className={styles.label}>
              <span>Full name</span>
              <input
                className={styles.input}
                name="fullName"
                type="text"
                placeholder="Jordan Lee"
                autoComplete="off"
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
                autoComplete="off"
                required
              />
            </label>

            <button type="button" className={styles.primaryCta}>
              Run lookup
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

