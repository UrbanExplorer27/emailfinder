"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";

type Activity = {
  name: string;
  domain: string;
  result: string;
};

const DEFAULT_LISTS = ["All results", "Prospects", "Customers", "Partners"];

export function ActivityRow({ item }: { item: Activity }) {
  const [lists] = useState(DEFAULT_LISTS);
  const [selected, setSelected] = useState(lists[0]);
  const [addedText, setAddedText] = useState("");

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
          {addedText ? <span className={styles.listHelper}>{addedText}</span> : null}
        </label>
      </div>
    </div>
  );
}

