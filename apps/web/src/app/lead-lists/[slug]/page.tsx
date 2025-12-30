"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import styles from "./detail.module.css";

export const dynamic = "force-dynamic";

type LeadItem = { id: string; name: string | null; email: string; domain: string };
type LeadList = { id: string; name: string; items: LeadItem[] };

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function LeadListDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [list, setList] = useState<LeadList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/lead-lists/${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load list (${res.status})`);
        const data = await res.json();
        setList(data.list ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load list";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [slug]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Nova Email Finder</span>
        </div>
        <Link href="/lead-lists" className={styles.backLink}>
          Back to lead lists
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Lead list</p>
            <h1>{isLoading ? "Loading..." : list?.name ?? "Lead list"}</h1>
            <p className={styles.subhead}>
              {isLoading
                ? "Loading..."
                : list
                  ? `${list.items.length} saved leads`
                  : error ?? "No leads yet for this list."}
            </p>
          </div>
          <div className={styles.heroActions}>
            <button type="button" className={styles.secondaryCta}>
              Export CSV
            </button>
          </div>
        </section>

        <section className={styles.leads}>
          {error ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Error</p>
              <p className={styles.emptyBody}>{error}</p>
            </div>
          ) : isLoading ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Loading...</p>
              <p className={styles.emptyBody}>Fetching leads for this list.</p>
            </div>
          ) : list && list.items.length > 0 ? (
            <>
              {removeError ? <p className={styles.actionError}>{removeError}</p> : null}
              {list.items.map((lead) => (
                <div key={lead.id} className={styles.leadRow}>
                  <div>
                    <p className={styles.leadName}>{lead.name ?? "Unknown"}</p>
                    <p className={styles.leadMeta}>{lead.domain}</p>
                  </div>
                  <div className={styles.leadActions}>
                    <p className={styles.leadEmail}>{lead.email}</p>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={async () => {
                        if (!list) return;
                        setRemoveError(null);
                        setRemovingId(lead.id);
                        try {
                          const res = await fetch(`/api/lead-lists/${list.id}/items?itemId=${lead.id}`, {
                            method: "DELETE",
                          });
                          if (!res.ok) {
                            const text = await res.text();
                            throw new Error(text || "Failed to remove");
                          }
                          setList((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  items: prev.items.filter((i) => i.id !== lead.id),
                                }
                              : prev,
                          );
                        } catch (err) {
                          const message = err instanceof Error ? err.message : "Failed to remove lead";
                          setRemoveError(message);
                        } finally {
                          setRemovingId(null);
                        }
                      }}
                      disabled={removingId === lead.id}
                    >
                      {removingId === lead.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No leads yet</p>
              <p className={styles.emptyBody}>Add leads from activity to see them here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

