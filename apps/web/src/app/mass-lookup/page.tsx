"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./mass-lookup.module.css";

type ParsedRow = { firstName: string; lastName: string; domain: string };

export const dynamic = "force-dynamic";

export default function MassLookupPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isAllowed = useMemo(() => {
    if (!plan) return false;
    const lower = plan.toLowerCase();
    return lower.includes("starter") || lower.includes("pro");
  }, [plan]);

  useEffect(() => {
    const loadPlan = async () => {
      setIsLoadingPlan(true);
      setPlanError(null);
      try {
        const res = await fetch("/api/credits", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load plan (${res.status})`);
        const data = await res.json();
        setPlan(data.planName ?? data.plan ?? "Unknown");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load plan";
        setPlanError(message);
      } finally {
        setIsLoadingPlan(false);
      }
    };
    void loadPlan();
  }, []);

  const handleUpload = (file: File | null) => {
    if (!file) return;
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const parsed: ParsedRow[] = [];
        for (let i = 0; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim());
          if (cols.length < 3) continue;
          parsed.push({ firstName: cols[0], lastName: cols[1], domain: cols[2] });
          if (parsed.length >= 50) break; // simple cap for preview
        }
        if (!parsed.length) {
          setUploadError("No valid rows found. Provide first,last,domain columns.");
        } else {
          setRows(parsed);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to read file";
        setUploadError(message);
      }
    };
    reader.readAsText(file);
  };

  const downloadCsv = () => {
    if (!rows.length) return;
    const header = "firstName,lastName,domain,email";
    const body = rows
      .map((r) => `${r.firstName},${r.lastName},${r.domain},example@${r.domain}`)
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lookups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
        <Link href="/dashboard" className={styles.backLink}>
          Back to dashboard
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Mass lookup</p>
            <h1>Upload contacts to find emails in bulk</h1>
            <p className={styles.subhead}>
              Upload a CSV with first name, last name, and domain columns. Results are available to Starter and Pro
              plans.
            </p>
          </div>
          <div className={styles.status}>
            {isLoadingPlan ? "Checking plan…" : plan ? `Plan: ${plan}` : "Plan unavailable"}
            {planError ? <span className={styles.helper}>{planError}</span> : null}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.uploadRow}>
            <div>
              <p className={styles.label}>Upload CSV</p>
              <p className={styles.helper}>Columns: first name, last name, domain (comma-separated).</p>
            </div>
            <label className={`${styles.uploadButton} ${!isAllowed ? styles.uploadButtonDisabled : ""}`}>
              <input
                type="file"
                accept=".csv,text/csv"
                disabled={!isAllowed}
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
              />
              Choose file
            </label>
          </div>
          {!isAllowed ? (
            <div className={styles.banner}>
              Mass lookup is available on Starter and Pro. Upgrade to add more credits and unlock bulk uploads.
            </div>
          ) : null}
          {uploadError ? <p className={styles.error}>{uploadError}</p> : null}
          {rows.length > 0 ? (
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <div>
                  <p className={styles.label}>Preview ({rows.length} rows)</p>
                  <p className={styles.helper}>Showing first {Math.min(rows.length, 50)} rows from your file.</p>
                </div>
                <button className={styles.primaryCta} type="button" onClick={downloadCsv}>
                  Export CSV
                </button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <span>First name</span>
                  <span>Last name</span>
                  <span>Domain</span>
                  <span>Result (mock)</span>
                </div>
                {rows.map((r, idx) => (
                  <div key={`${r.domain}-${idx}`} className={styles.tableRow}>
                    <span>{r.firstName}</span>
                    <span>{r.lastName}</span>
                    <span>{r.domain}</span>
                    <span>example@{r.domain}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

