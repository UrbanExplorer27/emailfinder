import type { Metadata } from "next";
import Link from "next/link";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Dashboard | Email Finder",
  description: "View lookups, limits, and recent activity for your email finder account.",
};

const mockStats = [
  { label: "Remaining lookups", value: "240" },
  { label: "Verified this week", value: "58" },
  { label: "Bounce risk flagged", value: "3" },
];

const mockActivity = [
  { name: "Alex Rivera", domain: "northwind.io", result: "alex@northwind.io" },
  { name: "Priya Rao", domain: "formstack.dev", result: "priya@formstack.dev" },
  { name: "Samir Patel", domain: "canopy.ai", result: "samir@canopy.ai" },
];

export default function DashboardPage() {
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
          <Link href="/signin" className={styles.navLink}>
            Sign out
          </Link>
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
          <button className={styles.primaryCta} type="button">
            Start new lookup
          </button>
        </section>

        <section className={styles.grid}>
          {mockStats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          ))}
        </section>

        <section className={styles.panelLayout}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Quick lookup</p>
                <h2>Find an email</h2>
              </div>
            </div>
            <form className={styles.form}>
              <label className={styles.label}>
                <span>Full name</span>
                <input
                  className={styles.input}
                  name="fullName"
                  type="text"
                  placeholder="Jordan Lee"
                  autoComplete="off"
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
                />
              </label>
              <button type="button" className={styles.secondaryCta}>
                Run lookup
              </button>
            </form>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Recent activity</p>
                <h2>Latest verifications</h2>
              </div>
              <Link href="#" className={styles.navLink}>
                View all
              </Link>
            </div>
            <div className={styles.activityList}>
              {mockActivity.map((item) => (
                <div key={item.result} className={styles.activityRow}>
                  <div>
                    <p className={styles.activityName}>{item.name}</p>
                    <p className={styles.activityMeta}>{item.domain}</p>
                  </div>
                  <p className={styles.activityResult}>{item.result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

