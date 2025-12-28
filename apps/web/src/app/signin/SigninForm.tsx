"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./signin.module.css";

export function SigninForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // TODO: replace with real auth call. For now, simulate success and route to dashboard.
    setTimeout(() => {
      router.push("/dashboard");
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        <span>Work email</span>
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
      </label>

      <label className={styles.label}>
        <span>Password</span>
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
      </label>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}




