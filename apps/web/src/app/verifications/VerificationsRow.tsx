"use client";

import { useEffect, useState } from "react";
import styles from "./verifications.module.css";

type Verification = {
  name: string;
  email: string;
  domain: string;
  status: string;
};

const LIST_OPTIONS = ["All results", "Prospects", "Customers", "Partners", "Sample"];

export function VerificationsRow({ item }: { item: Verification }) {
  const [options, setOptions] = useState(LIST_OPTIONS);
  const [selected, setSelected] = useState(LIST_OPTIONS[0]);
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
        const merged = names.length > 0 ? names : LIST_OPTIONS;
        setOptions(merged);
        setSelected(merged[0]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load lists";
        setListsError(message);
        setOptions(LIST_OPTIONS);
        setSelected(LIST_OPTIONS[0]);
      } finally {
        setListsLoading(false);
      }
    };
    void loadLists();
  }, []);

  return (
    <div className={styles.row}>
      <div>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.meta}>{item.domain}</p>
      </div>
      <div className={styles.right}>
        <p className={styles.email}>{item.email}</p>
        <span className={styles.status}>{item.status}</span>
        <label className={styles.listLabel}>
          <span>Add to list</span>
          <select
            className={styles.listSelect}
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setAddedText(`Added to ${e.target.value}`);
            }}
          >
            {options.map((option) => (
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

