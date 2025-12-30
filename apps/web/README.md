## Email Finder – Web App

### Environments and Neon branches
- Preview (Vercel) and local development must use the Neon `sandbox` branch.
- Production uses the Neon `main` branch only.

### Getting Started (local)
```bash
yarn install
yarn dev
# app runs at http://localhost:3000
```

### Notes
- Make sure `.env.local` (Preview values) points to the Neon `sandbox` branch connection string.
- Production deploys should point to the Neon `main` branch connection string.

### Deploy
- Sandbox/preview: push to `sandbox` (uses Neon `sandbox` branch).
- Production: promote `main` with the Neon `main` branch connection.

### Environment matrix
- **Sandbox / Preview / Local dev**
  - DB: Neon branch `sandbox`
  - Stripe: Test keys (`sk_test`, `pk_test`, test price IDs)
  - Email finder: Production key (OK to use)
  - Clerk: Preview/dev keys
  - Vercel: Preview environment; pull envs locally with `vercel env pull --environment preview`
- **Production**
  - DB: Neon branch `main`
  - Stripe: Live keys (`sk_live`, live price IDs)
  - Email finder: Production key
  - Clerk: Production keys
  - Vercel: Production environment
