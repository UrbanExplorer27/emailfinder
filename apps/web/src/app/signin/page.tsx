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
            appearance={{
              elements: {
                formButtonPrimary: "bg-[#2563eb] hover:bg-[#1e4fc7] text-white",
                card: "shadow-lg rounded-2xl",
              },
              variables: {
                colorPrimary: "#2563eb",
                borderRadius: "12px",
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              },
            }}
          />
        </section>
      </main>
    </div>
  );
}

