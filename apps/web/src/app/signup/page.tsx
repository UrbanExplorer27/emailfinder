import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import styles from "./signup.module.css";

export const metadata: Metadata = {
  title: "Sign up | Email Finder",
  description:
    "Create your account to find verified professional emails by name and domain.",
};

export default function SignupPage() {
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
          <SignUp
            redirectUrl="/dashboard"
            signInUrl="/signin"
            afterSignUpUrl="/dashboard"
            routing="hash"
          />
        </section>
      </main>
    </div>
  );
}

