# Razorpay dashboard visual baseline

A screenshot-led visual mockup. All metrics are zero. Controls are presentational; Documentation opens Razorpay documentation. No payment API, authentication, or backend is connected.

## Local development

Install Node.js 20.9 or newer, then run `npm install` and `npm run dev` from this directory. Open http://127.0.0.1:3000. Run `npm run build` for a production build and `npm start` to preview it. `npm run typecheck` checks TypeScript.

## Vercel deployment (later phase)

Push this project to your Git repository and import it into Vercel. If the repository contains the parent workspace, set Root Directory to `razorpay-dashboard`. Select Next.js; use the default install and build commands. No environment variables are required. Review the Vercel preview before promoting to production.

## Reference and structure

The provided Transactions overview screenshot is the design reference. The local white Razorpay logo is from https://razorpay.com/newsroom/brand-assets/ (image source: https://razorpay.com/newsroom-content/uploads/2021/02/white.png).

Reusable components live in `components/dashboard.tsx`; styling is in `app/globals.css`. Desktop follows the reference composition. Mobile hides the sidebar and stacks summary cards. Future behavior can be added to individual components without changing the page composition.


## Validation

Production build and TypeScript checks passed. Browser QA uses Microsoft Edge via Playwright; screenshots and layout results are in `qa/`. With Playwright available, run `node qa/verify.cjs` against a server at port 3000. Checked at 2232 × 1224, 1440 × 900, and 390 × 844 for loaded assets, three summary cards, browser errors, and horizontal overflow.

The repository includes `pnpm-lock.yaml`; use `pnpm install --frozen-lockfile` for reproducible installs, then `pnpm dev` or `pnpm build`. Vercel detects this lockfile automatically.
