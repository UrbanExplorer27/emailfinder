"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./find-email.module.css";

type Props = {
  compact?: boolean;
  variant?: "default" | "inverted";
  onLookupSuccess?: () => void;
};

type Result = {
  email: string;
  confidence: string;
  note: string;
  status: "found" | "not_found" | "error";
  resultCode?: string | null;
};

export function FindEmailForm({ compact, variant = "default", onLookupSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [listsLoading, setListsLoading] = useState(false);
  const [listsError, setListsError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [addHelper, setAddHelper] = useState("");
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
          (l: { id: string; name: string }) => ({ id: l.id, name: l.name }),
        );
        setLists(options);
        setSelectedList(options[0]?.id ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load lists";
        setListsError(message);
        setLists([]);
        setSelectedList(null);
      } finally {
        setListsLoading(false);
      }
    };
    void loadLists();
  }, []);

  const isDisabled = useMemo(() => !fullName.trim() || !domain.trim() || isLoading, [fullName, domain, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    setIsLoading(true);
    setResult(null);
    setAddHelper("");
    setAddError(null);

    try {
      const res = await fetch("/api/find-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, domain }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Lookup failed (${res.status})`);
      }

      const data = await res.json();
      const foundEmail = data.email ?? null;
      const resultCode: string | null = data.result ?? data.status ?? null;
      const isEmailDisabled = resultCode === "email_disabled";
      const isInvalidMx = resultCode === "invalid_mx";
      const isFound = resultCode === "ok" && !!foundEmail;

      if (isEmailDisabled || isInvalidMx || !isFound) {
        setResult({
          email: "No result",
          confidence: "—",
          note: isEmailDisabled
            ? "Email disabled for this contact."
            : isInvalidMx
              ? "Domain has invalid MX records."
              : "No email found for this name/domain.",
          status: "not_found",
          resultCode,
        });
        return;
      }

      const confidenceValue =
        typeof data.score === "number" ? String(data.score) : typeof data.confidence === "string" ? data.confidence : "—";

      if (foundEmail) {
        let note = data.status ?? "Found";
        let status: Result["status"] = "found";

        try {
          const recordRes = await fetch("/api/lookups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName,
              domain,
              resultEmail: foundEmail,
              confidence: confidenceValue,
            }),
          });
          if (!recordRes.ok) {
            const text = await recordRes.text();
            note = text || note;
            status = "error";
          } else if (onLookupSuccess) {
            onLookupSuccess();
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to record lookup";
          note = message;
          status = "error";
        }

        setResult({
          email: foundEmail,
          confidence: confidenceValue,
          note,
          status,
        });
      } else {
        setResult({
          email: "No result",
          confidence: "—",
          note: "No email found for this name/domain.",
          status: "not_found",
          resultCode,
        });
      }
    } catch (err) {
      setResult({
        email: "Lookup failed",
        confidence: "—",
        note: err instanceof Error ? err.message : "Unknown error",
        status: "error",
        resultCode: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canSaveToList = result?.status === "found" && !!selectedList && !isSaving;

  const saveToList = async () => {
    if (!result || result.status !== "found" || !selectedList) return;
    const list = lists.find((l) => l.id === selectedList);
    if (!list) return;
    setIsSaving(true);
    setAddError(null);
    setAddHelper("");
    try {
      const res = await fetch(`/api/lead-lists/${list.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: result.email,
          domain,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to add to ${list.name}`);
      }
      setAddHelper(`Saved to ${list.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add to list";
      setAddError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.lookupContainer} data-theme={variant}>
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
            <div className={styles.resultActions}>
              <span className={styles.status} data-state={result.status}>
                {result.status === "found" ? "Found" : result.status === "not_found" ? "Not found" : "Error"}
              </span>
              <label className={styles.listLabel}>
                <span>Add to list</span>
                <select
                  className={styles.listSelect}
                  value={selectedList ?? ""}
                  onChange={(e) => setSelectedList(e.target.value)}
                  disabled={!lists.length || result.status !== "found"}
                >
                  {lists.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                  {!lists.length ? <option value="">No lists</option> : null}
                </select>
                <button
                  type="button"
                  className={styles.listSaveButton}
                  onClick={saveToList}
                  disabled={!canSaveToList}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                {listsLoading ? <span className={styles.listHelper}>Loading lists…</span> : null}
                {listsError ? <span className={`${styles.listHelper} ${styles.listHelperError}`}>{listsError}</span> : null}
                {addError ? <span className={`${styles.listHelper} ${styles.listHelperError}`}>{addError}</span> : null}
                {addHelper ? <span className={styles.listHelper}>{addHelper}</span> : null}
              </label>
            </div>
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

