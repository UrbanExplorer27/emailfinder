import type { Metadata } from "next";
import Link from "next/link";
import styles from "./detail.module.css";

export const metadata: Metadata = {
  title: "Lead List | Email Finder",
  description: "View the leads saved to a specific list.",
};

const mockLists = [
  {
    slug: "all-results",
    name: "All results",
    leads: [
      { name: "Alex Rivera", email: "alex@northwind.io", domain: "northwind.io" },
      { name: "Priya Rao", email: "priya@formstack.dev", domain: "formstack.dev" },
      { name: "Samir Patel", email: "samir@canopy.ai", domain: "canopy.ai" },
      { name: "Jordan Lee", email: "jordan@horizon.dev", domain: "horizon.dev" },
      { name: "Casey Morgan", email: "casey@lumenlabs.io", domain: "lumenlabs.io" },
      { name: "Avery Chen", email: "avery@productco.io", domain: "productco.io" },
      { name: "Taylor Brooks", email: "taylor@revloop.com", domain: "revloop.com" },
      { name: "Mina Flores", email: "mina@signalpath.ai", domain: "signalpath.ai" },
      { name: "Noah Park", email: "noah@trailheadhq.com", domain: "trailheadhq.com" },
      { name: "Liam Patel", email: "liam@vectorlane.com", domain: "vectorlane.com" },
      { name: "Ivy Zhang", email: "ivy@mercator.dev", domain: "mercator.dev" },
      { name: "Diego Ramos", email: "diego@fluxworks.io", domain: "fluxworks.io" },
    ],
  },
  {
    slug: "prospects",
    name: "Prospects",
    leads: [
      { name: "Jordan Lee", email: "jordan@horizon.dev", domain: "horizon.dev" },
      { name: "Casey Morgan", email: "casey@lumenlabs.io", domain: "lumenlabs.io" },
      { name: "Mina Flores", email: "mina@signalpath.ai", domain: "signalpath.ai" },
      { name: "Noah Park", email: "noah@trailheadhq.com", domain: "trailheadhq.com" },
      { name: "Liam Patel", email: "liam@vectorlane.com", domain: "vectorlane.com" },
      { name: "Ivy Zhang", email: "ivy@mercator.dev", domain: "mercator.dev" },
      { name: "Diego Ramos", email: "diego@fluxworks.io", domain: "fluxworks.io" },
    ],
  },
  {
    slug: "customers",
    name: "Customers",
    leads: [
      { name: "Avery Chen", email: "avery@productco.io", domain: "productco.io" },
      { name: "Taylor Brooks", email: "taylor@revloop.com", domain: "revloop.com" },
      { name: "Alex Rivera", email: "alex@northwind.io", domain: "northwind.io" },
    ],
  },
  {
    slug: "partners",
    name: "Partners",
    leads: [
      { name: "Sam Blake", email: "sam@integratehq.com", domain: "integratehq.com" },
      { name: "Priya Rao", email: "priya@formstack.dev", domain: "formstack.dev" },
    ],
  },
  {
    slug: "sample",
    name: "Sample",
    leads: [
      { name: "Chris Stone", email: "chris@sampleco.com", domain: "sampleco.com" },
      { name: "Jamie Li", email: "jamie@demo.io", domain: "demo.io" },
      { name: "Morgan Diaz", email: "morgan@betaworks.dev", domain: "betaworks.dev" },
      { name: "Riley Shaw", email: "riley@testlabs.ai", domain: "testlabs.ai" },
      { name: "Quinn Harper", email: "quinn@usecase.app", domain: "usecase.app" },
    ],
  },
];

type PageProps = {
  params: { slug: string };
};

export default function LeadListDetailPage({ params }: PageProps) {
  const normalizedSlug = decodeURIComponent(params.slug || "").toLowerCase();
  const list =
    mockLists.find((l) => l.slug.toLowerCase() === normalizedSlug) ??
    mockLists.find((l) => l.slug === "sample");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
        <Link href="/lead-lists" className={styles.backLink}>
          Back to lead lists
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Lead list</p>
            <h1>{list?.name ?? "Lead list"}</h1>
            <p className={styles.subhead}>
              {list ? `${list.leads.length} saved leads` : "No leads yet for this list."}
            </p>
          </div>
          <div className={styles.heroActions}>
            <button type="button" className={styles.secondaryCta}>
              Export CSV
            </button>
          </div>
        </section>

        <section className={styles.leads}>
          {list && list.leads.length > 0 ? (
            list.leads.map((lead) => (
              <div key={lead.email} className={styles.leadRow}>
                <div>
                  <p className={styles.leadName}>{lead.name}</p>
                  <p className={styles.leadMeta}>{lead.domain}</p>
                </div>
                <p className={styles.leadEmail}>{lead.email}</p>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No leads yet</p>
              <p className={styles.emptyBody}>Add leads from activity to see them here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

