import "use client";

import type { Metadata } from "next";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import styles from "./lead-lists.module.css";

export const metadata: Metadata = {
  title: "Lead Lists | Email Finder",
  description: "Manage your lead lists, view saved results, and export to CSV.",
};

export const dynamic = "force-dynamic";

type LeadList = {
  id: string;
  name: string;
  items: { id: string }[];
};

export default function LeadListsPage() {
  const [lists, setLists] = useState<LeadList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadLists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead-lists", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load lists (${res.status})`);
      const data = await res.json();
      setLists(data.lists ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load lists";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLists();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/lead-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName.trim() }),
      });
      if (!res.ok) throw new Error(`Failed to create list (${res.status})`);
      setNewListName("");
      await loadLists();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create list";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/lead-lists/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete list (${res.status})`);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete list";
      setError(message);
    }
  };

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
              Group found emails into lists and export them to use in your outreach tools.
            </p>
          </div>
          <form className={styles.createForm} onSubmit={onCreate}>
            <input
              className={styles.createInput}
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button type="submit" className={styles.primaryCta} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create list"}
            </button>
          </form>
        </section>

        {error ? <p className={styles.error}>{error}</p> : null}

        <section className={styles.listGrid}>
          {isLoading ? (
            <p className={styles.subhead}>Loading lists...</p>
          ) : lists.length === 0 ? (
            <p className={styles.subhead}>No lists yet. Create your first list.</p>
          ) : (
            lists.map((list) => (
              <div key={list.id} className={styles.listCard}>
                <div>
                  <p className={styles.listName}>{list.name}</p>
                  <p className={styles.listCount}>
                    {list.items?.length ?? 0} contacts
                  </p>
                </div>
                <div className={styles.actions}>
                  <Link href={`/lead-lists/${list.id}`} className={styles.secondaryCta}>
                    View
                  </Link>
                  <button
                    type="button"
                    className={styles.ghostCta}
                    onClick={() => onDelete(list.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

