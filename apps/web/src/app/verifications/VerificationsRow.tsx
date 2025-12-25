"use client";

import { useEffect, useState } from "react";
import styles from "./verifications.module.css";

type Verification = {
  name: string;
  email: string;
  domain: string;
  status: string;
};

export function VerificationsRow({ item }: { item: Verification }) {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [addedText, setAddedText] = useState("");
  const [listsError, setListsError] = useState<string | null>(null);
  const [listsLoading, setListsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    const loadLists = async () => {
      setListsLoading(true);
      setListsError(null);
      try {
        const res = await fetch("/api/lead-lists", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load lists (${res.status})`);
        const data = await res.json();
        const lists: { id: string; name: string }[] = (data.lists ?? []).map(
          (l: { id: string; name: string }) => ({ id: l.id, name: l.name })
        );
        setOptions(lists);
        setSelected(lists[0]?.id ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load lists";
        setListsError(message);
        setOptions([]);
        setSelected(null);
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
            value={selected ?? ""}
            onChange={(e) => {
              setSelected(e.target.value);
              setAddError(null);
              setAddedText("");
              const list = options.find((o) => o.id === e.target.value);
              if (!list) return;
              setIsSaving(true);
              fetch(`/api/lead-lists/${list.id}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: item.name,
                  email: item.email,
                  domain: item.domain,
                }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error(`Failed to add to ${list.name} (${res.status})`);
                  setAddedText(`Added to ${list.name}`);
                })
                .catch((err) => {
                  const message = err instanceof Error ? err.message : "Failed to add to list";
                  setAddError(message);
                })
                .finally(() => setIsSaving(false));
            }}
            disabled={isSaving}
          >
            {options.map((option) => (
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

