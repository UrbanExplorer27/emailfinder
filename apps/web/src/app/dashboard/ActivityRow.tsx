"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

type Activity = {
  name: string;
  domain: string;
  result: string;
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

  const handleChange = async (value: string) => {
    setAddError(null);
    setSelected(value);
    setAddedText("");
    const list = lists.find((l) => l.id === value);
    if (!list) return;

    // We only have a display lead; use item fields as payload
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
      setAddedText(`Added to ${list.name}`);
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
        <p className={styles.activityMeta}>{item.domain}</p>
      </div>
      <div className={styles.activityActions}>
        <p className={styles.activityResult}>{item.result}</p>
        <label className={styles.listLabel}>
          <span>Add to list</span>
          <select
            className={styles.listSelect}
            value={selected ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isSaving}
          >
            {lists.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {listsLoading ? <span className={styles.listHelper}>Loading lists…</span> : null}
          {listsError ? <span className={styles.listHelper}>{listsError}</span> : null}
          {addError ? <span className={styles.listHelper}>{addError}</span> : null}
          {addedText ? <span className={styles.listHelper}>{addedText}</span> : null}
        </label>
      </div>
    </div>
  );
}

