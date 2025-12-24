import type { Metadata } from "next";
import Link from "next/link";
import styles from "./lead-lists.module.css";

export const metadata: Metadata = {
  title: "Lead Lists | Email Finder",
  description: "Manage your lead lists, view saved results, and export to CSV.",
};

const mockLists = [
  { name: "All results", count: 0, slug: "all-results" },
  { name: "Prospects", count: 0, slug: "prospects" },
  { name: "Customers", count: 0, slug: "customers" },
  { name: "Partners", count: 0, slug: "partners" },
  { name: "Sample", count: 5, slug: "sample" },
];

export default function LeadListsPage() {
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
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Lead lists</p>
            <h1>Organize your saved results</h1>
            <p className={styles.subhead}>
              Group found emails into lists and export them to use in your outreach
              tools.
            </p>
          </div>
          <button type="button" className={styles.primaryCta}>
            Create list
          </button>
        </section>

        <section className={styles.listGrid}>
          {mockLists.map((list) => (
            <div key={list.name} className={styles.listCard}>
              <div>
                <p className={styles.listName}>{list.name}</p>
                <p className={styles.listCount}>{list.count} contacts</p>
              </div>
              <div className={styles.actions}>
                <Link href={`/lead-lists/${list.slug}`} className={styles.secondaryCta}>
                  View
                </Link>
                <button type="button" className={styles.ghostCta}>
                  Export CSV
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

