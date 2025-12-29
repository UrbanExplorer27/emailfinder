"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./mass-lookup.module.css";

type ParsedRow = { firstName: string; lastName: string; domain: string };
type ResultRow = ParsedRow & {
  email: string | null;
  status?: string;
  score?: number | null;
  result?: string | null;
  error?: string;
};

export const dynamic = "force-dynamic";

export default function MassLookupPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ processed: number; debited: number; remainingCredits: number } | null>(
    null
  );
  const [leadLists, setLeadLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    const loadLists = async () => {
      try {
        const res = await fetch("/api/lead-lists", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const lists = (data.lists ?? []).map((l: any) => ({ id: l.id, name: l.name }));
        setLeadLists(lists);
        if (lists.length > 0) {
          setSelectedListId((prev) => prev ?? lists[0].id);
        }
      } catch {
        // ignore list load errors
      }
    };
    void loadLists();
  }, []);

  const handleUpload = (file: File | null) => {
    if (!file) return;
    setUploadError(null);
    setProcessError(null);
    setResults([]);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const parsed: ParsedRow[] = [];
        const looksLikeHeader = (cols: string[]) => {
          const hdr = cols.map((c) => c.toLowerCase());
          return (
            hdr[0]?.includes("first") &&
            hdr[1]?.includes("last") &&
            (hdr[2]?.includes("domain") || hdr[2]?.includes("company"))
          );
        };
        // Always treat the first row as a header; skip it from processing/preview.
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim());
          if (cols.length < 3) continue;
          if (i === 1 && looksLikeHeader(cols)) continue; // redundant safety
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
    const source = results.length ? results : rows.map((r) => ({ ...r, email: "" }));
    if (!source.length) return;
    const header = "firstName,lastName,domain,email";
    const body = source.map((r) => `${r.firstName},${r.lastName},${r.domain},${r.email ?? ""}`).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lookups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSampleCsv = () => {
    const sample = [
      "firstName,lastName,domain",
      "Ada,Lovelace,analyticalengine.com",
      "Grace,Hopper,navy.mil",
      "Alan,Turing,turing.org",
      "Katherine,Johnson,nasa.gov",
      "Margaret,Hamilton,apollo.dev",
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-mass-lookup.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const runLookups = async () => {
    if (!rows.length) {
      setProcessError("Upload a CSV first.");
      return;
    }
    if (!isAllowed) {
      setProcessError("Mass lookup is available on Starter and Pro.");
      return;
    }
    setIsProcessing(true);
    setProcessError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/mass-lookup/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to process (${res.status}): ${text.slice(0, 200)}`);
      }
      const data = await res.json();
      setResults((data.results ?? []) as ResultRow[]);
      if (typeof data.processed === "number" && typeof data.debited === "number") {
        setSummary({
          processed: data.processed,
          debited: data.debited,
          remainingCredits: data.remainingCredits ?? 0,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process lookups";
      setProcessError(message);
      setResults([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveFoundToLeadList = async () => {
    if (!results.length) {
      setSaveStatus("Run lookups first to save results.");
      return;
    }
    if (!selectedListId) {
      setSaveStatus("Select a lead list first.");
      return;
    }
    const found = results.filter((r) => r.email);
    if (!found.length) {
      setSaveStatus("No found emails to save.");
      return;
    }
    setIsSaving(true);
    setSaveStatus(null);
    try {
      for (const r of found) {
        await fetch(`/api/lead-lists/${selectedListId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${r.firstName} ${r.lastName}`.trim(),
            email: r.email,
            domain: r.domain,
          }),
        });
      }
      setSaveStatus(`Saved ${found.length} emails to lead list.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save to lead list";
      setSaveStatus(message);
    } finally {
      setIsSaving(false);
    }
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
            <button type="button" className={styles.ghostButton} onClick={downloadSampleCsv}>
              Download sample CSV
            </button>
          </div>
          {!isAllowed ? (
            <div className={styles.banner}>
              Mass lookup is available on Starter and Pro. Upgrade to add more credits and unlock bulk uploads.
            </div>
          ) : null}
          {processError ? <p className={styles.error}>{processError}</p> : null}
          {uploadError ? <p className={styles.error}>{uploadError}</p> : null}
          {rows.length > 0 ? (
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <div>
                  <p className={styles.label}>Preview ({rows.length} rows)</p>
                  <p className={styles.helper}>Showing first {Math.min(rows.length, 50)} rows from your file.</p>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.primaryCta}
                    type="button"
                    onClick={runLookups}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Running…" : "Run lookups"}
                  </button>
                  <button className={styles.ghostButton} type="button" onClick={downloadCsv}>
                    Export CSV
                  </button>
                </div>
              </div>
              {results.length ? (
                <div className={styles.actions}>
                  <label className={styles.leadListSelect}>
                    <span>Select lead list</span>
                    <select
                      value={selectedListId ?? ""}
                      onChange={(e) => setSelectedListId(e.target.value || null)}
                    >
                      {leadLists.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                      {leadLists.length === 0 ? <option value="">No lead lists</option> : null}
                    </select>
                  </label>
                  <button
                    className={styles.primaryCta}
                    type="button"
                    onClick={saveFoundToLeadList}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving…" : "Save found emails"}
                  </button>
                  {saveStatus ? <p className={styles.helper}>{saveStatus}</p> : null}
                </div>
              ) : null}
              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <span>First name</span>
                  <span>Last name</span>
                  <span>Domain</span>
                  <span>Result</span>
                </div>
                {(results.length ? results : rows).map((r, idx) => {
                  const isResult = "email" in r;
                  return (
                    <div key={`${r.domain}-${idx}`} className={styles.tableRow}>
                      <span>{r.firstName}</span>
                      <span>{r.lastName}</span>
                      <span>{r.domain}</span>
                      <span>{isResult ? (r.email ? r.email : "No result found") : ""}</span>
                    </div>
                  );
                })}
              </div>
              {summary ? (
                <p className={styles.helper}>
                  Processed {summary.processed} rows, debited {summary.debited} credits, remaining {summary.remainingCredits}.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}




