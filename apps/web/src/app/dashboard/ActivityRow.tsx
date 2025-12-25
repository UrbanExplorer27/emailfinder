"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

type Activity = {
  name: string;
  domain: string;
  result: string;
  status?: string;
  createdAt?: string;
  confidence?: string | null;
};

export function ActivityRow({ item }: { item: Activity }) {
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [addedText, setAddedText] = useState("");
  const [listsError, setListsError] = useState<string | null>(null);
  const [listsLoading, setListsLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      setListsLoading(true);
      setListsError(null);
      try {
        const res = await fetch("/api/lead-lists", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load lists (${res.status})`);
        const data = await res.json();
        const options: { id: string; name: string }[] = (data.lists ?? []).map(
          (l: { id: string; name: string }) => ({ id: l.id, name: l.name })
        );
        setLists(options);
        setSelected(options[0]?.id ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load lists";
        setListsError(message);
        setLists([]);
        setSelected(null);
      } finally {
        setListsLoading(false);
      }
    };
    void loadLists();
  }, []);

  const addToList = async () => {
    if (!selected) return;
    const list = lists.find((l) => l.id === selected);
    if (!list) return;
    setAddError(null);
    setAddedText("");
    setIsSaving(true);
    try {
      const res = await fetch(`/api/lead-lists/${list.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          email: item.result,
          domain: item.domain,
        }),
      });
      if (!res.ok) throw new Error(`Failed to add to ${list.name} (${res.status})`);
      setAddedText(`Saved to ${list.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add to list";
      setAddError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.activityRow}>
      <div>
        <p className={styles.activityName}>{item.name}</p>
        <div className={styles.activityMetaRow}>
          <span className={styles.domainPill}>{item.domain}</span>
          {item.createdAt ? <span className={styles.timeMeta}>{new Date(item.createdAt).toLocaleString()}</span> : null}
          {item.confidence && item.confidence !== "—" ? (
            <span className={styles.confidenceMeta}>Confidence: {item.confidence}</span>
          ) : null}
        </div>
      </div>
      <div className={styles.activityActions}>
        <p className={styles.activityResult}>{item.result}</p>
        <span className={styles.statusBadge} data-state={(item.status ?? "").toLowerCase()}>
          {item.status ?? "Status"}
        </span>
        <label className={styles.listLabel}>
          <span>Add to list</span>
          <select
            className={styles.listSelect}
            value={selected ?? ""}
            onChange={(e) => setSelected(e.target.value)}
          >
            {lists.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.listSaveButton}
            onClick={addToList}
            disabled={!selected || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {listsLoading ? <span className={styles.listHelper}>Loading lists…</span> : null}
          {listsError ? <span className={styles.listHelper}>{listsError}</span> : null}
          {addError ? <span className={styles.listHelper}>{addError}</span> : null}
          {addedText ? <span className={styles.listHelper}>{addedText}</span> : null}
        </label>
      </div>
    </div>
  );
}

