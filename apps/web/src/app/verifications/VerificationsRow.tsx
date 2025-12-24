"use client";

import { useState } from "react";
import styles from "./verifications.module.css";

type Verification = {
  name: string;
  email: string;
  domain: string;
  status: string;
};

const LIST_OPTIONS = ["All results", "Prospects", "Customers", "Partners", "Sample"];

export function VerificationsRow({ item }: { item: Verification }) {
  const [selected, setSelected] = useState(LIST_OPTIONS[0]);

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
            onChange={(e) => setSelected(e.target.value)}
          >
            {LIST_OPTIONS.map((option) => (
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

