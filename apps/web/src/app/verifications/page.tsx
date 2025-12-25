import type { Metadata } from "next";
import Link from "next/link";
import styles from "./verifications.module.css";
import { VerificationsRow } from "./VerificationsRow";

export const metadata: Metadata = {
  title: "Latest Verifications | Email Finder",
  description: "See all recent email lookups and their results.",
};

export const dynamic = "force-dynamic";

const mockVerifications = [
  { name: "Alex Rivera", email: "alex@northwind.io", domain: "northwind.io", status: "Found" },
  { name: "Priya Rao", email: "priya@formstack.dev", domain: "formstack.dev", status: "Found" },
  { name: "Samir Patel", email: "samir@canopy.ai", domain: "canopy.ai", status: "Found" },
  { name: "Jordan Lee", email: "jordan@horizon.dev", domain: "horizon.dev", status: "Found" },
  { name: "Casey Morgan", email: "casey@lumenlabs.io", domain: "lumenlabs.io", status: "Found" },
  { name: "Mina Flores", email: "mina@signalpath.ai", domain: "signalpath.ai", status: "Found" },
];

export default function VerificationsPage() {
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
            <p className={styles.kicker}>Verifications</p>
            <h1>Latest lookups</h1>
            <p className={styles.subhead}>
              Recent results returned by name + domain lookups.
            </p>
          </div>
          <Link href="/find-email" className={styles.primaryCta}>
            New lookup
          </Link>
        </section>

        <section className={styles.list}>
          {mockVerifications.map((item) => (
            <VerificationsRow key={item.email} item={item} />
          ))}
        </section>
      </main>
    </div>
  );
}

