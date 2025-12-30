 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./verifications.module.css";
import { VerificationsRow } from "./VerificationsRow";

export const dynamic = "force-dynamic";

type Verification = {
  name: string;
  email: string;
  domain: string;
  status: string;
  createdAt?: string;
  confidence?: string | null;
};

export default function VerificationsPage() {
  const [items, setItems] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/lookups", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load lookups (${res.status})`);
        const data = await res.json();
        const mapped: Verification[] = (data.lookups ?? []).map((l: any) => ({
          name: l.fullName ?? "Unknown",
          email: l.email ?? "No result",
          domain: l.domain ?? "",
          status: l.status ?? "Unknown",
          createdAt: l.createdAt ?? null,
          confidence: l.confidence ?? null,
        }));
        setItems(mapped.slice(0, 2));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load verifications";
        setError(message);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

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
          {error ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Error</p>
              <p className={styles.emptyBody}>{error}</p>
            </div>
          ) : isLoading ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Loading…</p>
              <p className={styles.emptyBody}>Fetching latest verifications.</p>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No verifications yet</p>
              <p className={styles.emptyBody}>Run a lookup to see results here.</p>
            </div>
          ) : (
            items.map((item) => <VerificationsRow key={`${item.email}-${item.domain}`} item={item} />)
          )}
        </section>
      </main>
    </div>
  );
}

