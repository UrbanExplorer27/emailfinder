"use client";

import { useMemo, useState } from "react";
import styles from "./dashboard.module.css";

type Activity = {
  name: string;
  domain: string;
  result: string;
};

const DEFAULT_LISTS = ["All results", "Prospects", "Customers", "Partners"];

export function ActivityRow({ item }: { item: Activity }) {
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [selected, setSelected] = useState(lists[0]);

  const options = useMemo(
    () => [...lists, "Create new list…"],
    [lists],
  );

  const handleChange = (value: string) => {
    if (value === "Create new list…") {
      const name = window.prompt("Name your new list");
      if (name && !lists.includes(name)) {
        setLists((prev) => [...prev, name]);
        setSelected(name);
      } else if (name) {
        setSelected(name);
      }
      return;
    }
    setSelected(value);
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
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

