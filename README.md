# Email Finder Monorepo

Monorepo for an email finder SaaS (hunter.io style). The frontend ships first; backend services will follow (email verification API integration, Stripe billing, Clerk auth).

## Layout
- `apps/web`: Next.js frontend (App Router, TypeScript, ESLint).
- `apps/backend`: Placeholder for the API service (Clerk auth, Stripe, verification API).
- `packages`: Shared libraries/components to keep frontend and backend aligned.

## Getting Started
1) Install dependencies from the repo root (npm workspaces):  
   `npm install`
2) Run the web app:  
   `npm run dev:web`
3) Lint the web app:  
   `npm run lint:web`
4) Build the web app:  
   `npm run build:web`

## GitHub Setup
1) Create a new GitHub repo (private is fine for now).  
2) Add it as a remote:  
   `git remote add origin <git-url>`
3) Push the scaffold:  
   `git push -u origin main` (after creating an initial commit/branch).

## Next Steps
- Flesh out `apps/backend` with REST/GraphQL endpoints that wrap the email verification provider.
- Add shared validation/types in `packages` for request/response contracts.
- Wire Clerk auth + Stripe billing flows on the web app once backend routes are ready.




