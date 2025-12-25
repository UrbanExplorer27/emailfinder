import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import styles from "./signin.module.css";

export const metadata: Metadata = {
  title: "Sign in | Email Finder",
  description:
    "Access your Email Finder account to search and verify professional emails.",
};

export default function SigninPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Email Finder</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.formCard}>
          <SignIn
            redirectUrl="/dashboard"
            signUpUrl="/signup"
            afterSignInUrl="/dashboard"
            routing="hash"
          />
        </section>
      </main>
    </div>
  );
}

