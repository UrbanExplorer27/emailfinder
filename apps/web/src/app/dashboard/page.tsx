 "use client";
 
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { ActivityRow } from "./ActivityRow";
import { FindEmailForm } from "../find-email/FindEmailForm";

const mockStats = [
  { label: "Remaining lookups", value: "240" },
  { label: "Emails found this week", value: "58" },
];

const mockActivity = [
  { name: "Alex Rivera", domain: "northwind.io", result: "alex@northwind.io" },
  { name: "Priya Rao", domain: "formstack.dev", result: "priya@formstack.dev" },
  { name: "Samir Patel", domain: "canopy.ai", result: "samir@canopy.ai" },
];

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/signin");
    }
  }, [isLoaded, isSignedIn, router]);

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
          <Link href="/account" className={styles.navLink}>
            Account
          </Link>
          <SignOutButton redirectUrl="/signin">
            <button type="button" className={styles.navLink}>
              Sign out
            </button>
          </SignOutButton>
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
          <Link className={styles.primaryCta} href="/find-email">
            Start new lookup
          </Link>
        </section>

        <section className={styles.grid}>
          {mockStats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
              {stat.label === "Remaining lookups" ? (
                <p className={styles.statHelper}>Credits are only used when an email is found.</p>
              ) : null}
            </div>
          ))}
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
            <FindEmailForm compact variant="inverted" />
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
              {mockActivity.map((item) => (
                <ActivityRow key={item.result} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

