"use client";

import { useMemo, useState } from "react";
import styles from "./find-email.module.css";

type Props = {
  compact?: boolean;
};

type Result = {
  email: string;
  confidence: string;
  note: string;
};

const buildMockResult = (fullName: string, domain: string): Result => {
  const safeDomain = domain.trim() || "company.com";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.toLowerCase() || "lead";
  const last = parts[parts.length - 1]?.toLowerCase() || "contact";
  const email = `${first}.${last}@${safeDomain}`.replace(/\.\./g, ".");
  return {
    email,
    confidence: "97%",
    note: "Based on common patterns for this domain.",
  };
};

export function FindEmailForm({ compact }: Props) {
  const [fullName, setFullName] = useState("");
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const isDisabled = useMemo(() => !fullName.trim() || !domain.trim() || isLoading, [fullName, domain, isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(buildMockResult(fullName, domain));
      setIsLoading(false);
    }, 1600);
  };

  return (
    <div className={styles.lookupContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span>Full name</span>
          <input
            className={styles.input}
            name="fullName"
            type="text"
            placeholder="Jordan Lee"
            autoComplete="off"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          <span>Company domain</span>
          <input
            className={styles.input}
            name="domain"
            type="text"
            placeholder="company.com"
            autoComplete="off"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </label>

        <button type="submit" className={styles.primaryCta} disabled={isDisabled}>
          {isLoading ? "Finding..." : "Run lookup"}
        </button>
      </form>

      <div className={styles.resultArea} data-compact={compact ? "true" : "false"}>
        {isLoading ? (
          <div className={styles.loadingCard}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Finding the best-match email…</p>
          </div>
        ) : result ? (
          <div className={styles.resultCard}>
            <div>
              <p className={styles.resultEmail}>{result.email}</p>
              <p className={styles.resultMeta}>
                Confidence: {result.confidence} · {result.note}
              </p>
            </div>
            <span className={styles.status}>Found</span>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.placeholderTitle}>Run a lookup to see results here.</p>
            <p className={styles.placeholderBody}>We’ll show the best-match email with confidence notes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

