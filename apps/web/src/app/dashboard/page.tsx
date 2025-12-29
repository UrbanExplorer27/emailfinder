 "use client";
 
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./dashboard.module.css";
import { ActivityRow } from "./ActivityRow";
import { FindEmailForm } from "../find-email/FindEmailForm";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [activity, setActivity] = useState<
    { name: string; domain: string; result: string; status?: string; createdAt?: string; confidence?: string | null }[]
  >([]);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/signin");
    }
  }, [isLoaded, isSignedIn, router]);

  const isTrial = (plan ?? "").toLowerCase().includes("trial");

  const loadCredits = useCallback(async () => {
    if (!isSignedIn) return;
    setIsCreditsLoading(true);
    setCreditsError(null);
    try {
      // Ensure user row exists
      await fetch("/api/me", { cache: "no-store" });
      const res = await fetch("/api/credits", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load credits (${res.status})`);
      }
      const data = await res.json();
      setCredits(typeof data.credits === "number" ? data.credits : null);
      setPlan(data.planName ?? data.plan ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load credits";
      setCreditsError(message);
    } finally {
      setIsCreditsLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    void loadCredits();
  }, [loadCredits]);

  // After checkout success, sync plan/credits using the session_id returned by Stripe.
  useEffect(() => {
    const maybeSync = async () => {
      if (!isSignedIn) return;
      const checkoutStatus = searchParams.get("checkout");
      const sessionId = searchParams.get("session_id");
      if (checkoutStatus !== "success" || !sessionId) return;
      try {
        await fetch("/api/stripe/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        // ignore sync errors; credits will remain unchanged
      } finally {
        await loadCredits();
      }
    };
    void maybeSync();
  }, [isSignedIn, loadCredits, searchParams]);

  useEffect(() => {
    const loadActivity = async () => {
      if (!isSignedIn) return;
      setActivityLoading(true);
      setActivityError(null);
      try {
        const res = await fetch("/api/lookups", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load lookups (${res.status})`);
        const data = await res.json();
        const mapped: {
          name: string;
          domain: string;
          result: string;
          status?: string;
          createdAt?: string;
          confidence?: string | null;
        }[] = (data.lookups ?? []).map((l: any) => ({
          name: l.fullName ?? "Unknown",
          domain: l.domain ?? "",
          result: l.email ?? l.resultEmail ?? "No result",
          status: l.status ?? "Unknown",
          createdAt: l.createdAt ?? null,
          confidence: l.confidence ?? null,
        }));
        setActivity(mapped.slice(0, 2));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load activity";
        setActivityError(message);
        setActivity([]);
      } finally {
        setActivityLoading(false);
      }
    };
    void loadActivity();
  }, [isSignedIn]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/lead-lists" className={styles.navLink}>
            Lead Lists
          </Link>
          <Link href="/subscription" className={styles.navLink}>
            Subscription
          </Link>
          <UserButton afterSignOutUrl="/signin" />
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Overview</p>
            <h1>Your lookup hub</h1>
            <p className={styles.subhead}>
              Track remaining credits, recent verifications, and start a new search.
            </p>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href="/find-email">
              Start new lookup
            </Link>
            <Link className={styles.secondaryCta} href="/mass-lookup">
              Start mass lookup
            </Link>
          </div>
        </section>

        <section>
          <div className={styles.statHeader}>
            <div>
              <p className={styles.kicker}>Usage</p>
              <h2 className={styles.statTitle}>Credits & plan</h2>
            </div>
          </div>
          <div className={styles.grid}>
            {[
              {
                label: "Remaining lookups",
                value:
                  credits !== null
                    ? credits.toLocaleString()
                    : isCreditsLoading
                    ? "Loading…"
                    : "—",
                helper: "Credits are only used when an email is found.",
                cta: (
                  <Link href="/subscription" className={styles.statCtaInCard}>
                    Get more credits
                  </Link>
                ),
              },
              {
                label: "Plan",
                value: plan ?? (isCreditsLoading ? "Loading…" : "—"),
                helper: creditsError ?? undefined,
              },
            ].map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
                {stat.helper ? <p className={styles.statHelper}>{stat.helper}</p> : null}
                {"cta" in stat && stat.cta ? <div className={styles.statCtaWrap}>{stat.cta}</div> : null}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panelLayout}>
          <div className={`${styles.panel} ${styles.lookupPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Quick lookup</p>
                <h2>Find an email</h2>
                <p className={styles.lookupHint}>
                  Enter a name and domain—we’ll return a single best-match email.
                </p>
              </div>
            </div>
            <FindEmailForm
              compact
              variant="inverted"
              onLookupSuccess={() => {
                void loadCredits();
              }}
            />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Recent activity</p>
                <h2>Latest verifications</h2>
              </div>
              <Link href="/verifications" className={styles.navLink}>
                View all
              </Link>
            </div>
            <div className={styles.activityList}>
              {activityError ? (
                <p className={styles.statHelper}>{activityError}</p>
              ) : activityLoading ? (
                <p className={styles.statHelper}>Loading…</p>
              ) : activity.length === 0 ? (
                <p className={styles.statHelper}>Run a lookup to see results here.</p>
              ) : (
                activity.map((item) => <ActivityRow key={`${item.result}-${item.domain}`} item={item} />)
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

