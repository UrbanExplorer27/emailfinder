"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

type Activity = {
  name: string;
  domain: string;
  result: string;
};

const DEFAULT_LISTS = ["All results", "Prospects", "Customers", "Partners"];

export function ActivityRow({ item }: { item: Activity }) {
  const [lists, setLists] = useState<string[]>(DEFAULT_LISTS);
  const [selected, setSelected] = useState(DEFAULT_LISTS[0]);
  const [addedText, setAddedText] = useState("");
  const [listsError, setListsError] = useState<string | null>(null);
  const [listsLoading, setListsLoading] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      setListsLoading(true);
      setListsError(null);
      try {
        const res = await fetch("/api/lead-lists", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load lists (${res.status})`);
        const data = await res.json();
        const names: string[] = (data.lists ?? []).map((l: { name: string }) => l.name);
        const merged = names.length > 0 ? names : DEFAULT_LISTS;
        setLists(merged);
        setSelected(merged[0]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load lists";
        setListsError(message);
        setLists(DEFAULT_LISTS);
        setSelected(DEFAULT_LISTS[0]);
      } finally {
        setListsLoading(false);
      }
    };
    void loadLists();
  }, []);

  const handleChange = (value: string) => {
    setSelected(value);
    setAddedText(`Added to ${value}`);
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
            value={selected}
            onChange={(e) => handleChange(e.target.value)}
          >
            {lists.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {listsLoading ? <span className={styles.listHelper}>Loading lists…</span> : null}
          {listsError ? <span className={styles.listHelper}>{listsError}</span> : null}
          {addedText ? <span className={styles.listHelper}>{addedText}</span> : null}
        </label>
      </div>
    </div>
  );
}

