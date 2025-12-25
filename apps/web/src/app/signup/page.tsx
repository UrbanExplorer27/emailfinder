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

