# Razorpay dashboard visual baseline

A screenshot-led dashboard prototype with an interactive Revenue Orchestrator proposal. Transactions retains zero metrics and presentational controls; Documentation opens Razorpay documentation. Orchestrator uses clearly labeled fictional data. No payment API, authentication, or backend is connected.

## Local development

Install Node.js 20.9 or newer, then run `npm install` and `npm run dev` from this directory. Open http://127.0.0.1:3000. Run `npm run build` for a production build and `npm start` to preview it. `npm run typecheck` checks TypeScript.

## GitHub and Vercel deployment

Publish this repository to GitHub and import it into Vercel as a Next.js project. Set Root Directory to the repository root (`.`), use the included pnpm lockfile and default build command, and deploy the `main` branch to production. No environment variables are required. `vercel.json` redirects the landing URL to `/orchestrator-v2`; the original demo remains available at `/orchestrator`.

V2 includes reversible merchant rejection, pause and revocation; retained validated learning history; and visible, editable review preferences. All merchant data is fictional, and state lasts for the current visit. The deployment does not send calls or alerts. Run `pnpm typecheck`, `node qa/v2-state-test.cjs`, `node qa/state-test.cjs`, and `pnpm build` before publishing. Local Vercel metadata and environment files are ignored by Git.

## Reference and structure

The provided Transactions overview screenshot is the design reference. The local white Razorpay logo is from https://razorpay.com/newsroom/brand-assets/ (image source: https://razorpay.com/newsroom-content/uploads/2021/02/white.png).

Reusable components live in `components/dashboard.tsx`; styling is in `app/globals.css`. Desktop follows the reference composition. Mobile hides the sidebar and stacks summary cards. Future behavior can be added to individual components without changing the page composition.


## Validation

Production build and TypeScript checks passed. Browser QA uses Microsoft Edge via Playwright; screenshots and layout results are in `qa/`. With Playwright available, run `node qa/verify.cjs` against a server at port 3000. Checked at 2232 × 1224, 1440 × 900, and 390 × 844 for loaded assets, three summary cards, browser errors, and horizontal overflow.

The repository includes `pnpm-lock.yaml`; use `pnpm install --frozen-lockfile` for reproducible installs, then `pnpm dev` or `pnpm build`. Vercel detects this lockfile automatically.

## Revenue Orchestrator demo

The proposed coordination layer is at `/orchestrator`. Enter from the PAYMENT PRODUCTS sidebar or the small link in the Failed card. It has seven interactive screens, entirely fictional data, and no backend or live agent connection. Home, Settlements, and Reports remain the original presentational controls.

Use `pnpm install --frozen-lockfile`, `pnpm dev`, and open http://127.0.0.1:3000/orchestrator. Run `pnpm typecheck` and `pnpm build`; `pnpm start` serves the production preview. Node.js 20.9+ is required.

For recording, use a 1440 × 900 viewport at 100% zoom. Navigate using the stepper, Back/Next, or left/right arrow keys (shortcuts are ignored while editing fields). Suggested dwell times: 10 / 12 / 13 / 20 / 15 / 13 / 7 seconds. Screens do not auto-advance. The bottom-center bar has two switches: “Not enough data” (low traffic) and “Recovery drops” (underperformance), plus “Reset winning demo”. Reduced-motion preferences disable transitions.

Happy path: set a goal → find the opportunity → approve rules and run the demo → review the winning plan → approve roadmap → monitor and learn. Navigation alone never approves or executes anything. Policy saves, permissions and audit logs last only for the current visit; refresh resets the scenario.

Goal edits update coverage and remaining recovery immediately. Changing selected customer groups updates an explicit illustrative scenario model: the demo assumes subscribers and non-subscribers each contribute 50% of eligible recovery. In the fixed Rs 19k example, revenue and agent costs scale with the selected groups; orchestration remains Rs 3k. Exposure changes test size, not the monthly forecast. Subscribers and both agents are required to test overlapping calls; non-subscribers remain eligible for cart recovery only. These are synthetic demo assumptions, not new merchant evidence.

Rules edits clear approvals. Approving the rules starts a 1.5-second local test; completing it refreshes the demo result, so edits no longer create a permanent approval dead end. Roadmap shows an actionable next step for each blocker. Positive, tested scenarios enable “Approve roadmap”. Both switches off gives a winning example; the default generates 20% above the goal (Rs 60k for a Rs 50k goal), and the fixed example gives Rs 19k / month; “Recovery drops” gives −Rs 12k and rolls back active execution. “Not enough data” hides estimates and blocks rollout. Switching back does not automatically restart execution; merchant approval is required. “Reset winning demo” restores defaults and clears permissions. No real calls or alerts are sent.

Standalone recovered revenue and combined net revenue are kept separate. The chart whiskers are illustrative display fixtures, not measured confidence intervals; Rs 12k–26k is the supplied forecast range. Execution monitoring is a fictional snapshot that responds to selected groups and the outcome. Detailed formulas, costs, policies and audit entries are expandable; core screens focus on one decision. Deployment remains a later phase.

The TEST toolbar under the top navigation was removed at the merchant’s request. The sidebar Test Mode control remains presentational.

### Current validation

Run `node qa/state-test.cjs` for the meaningful approval / evidence / permission state tests (uses the installed TypeScript compiler). TypeScript and production-build checks are `pnpm typecheck` and `pnpm build`.

Browser interaction checks and responsive screenshots from the Codex in-app browser are saved in `qa/orchestrator/`: seven recording screens at 1440 × 900, both demo scenarios, diagnosis, and Transactions at 2232 × 1224, 1440 × 900, and 390 × 844. Layout / regression / interaction results are the JSON files in that folder. The earlier `qa/verify.cjs` remains the historical Edge / Playwright regression script; Edge must be installed to run it.

## Three-option comparison and selected plan

Screen 1 is the recovery overview. Screen 4 compares agents separately (Rs 0 extra), a simple 7-day suppression rule (Rs −2k), and AI coordination, with two customer examples. Low traffic hides all bars. Screen 5 uses one four-row table: unchecking actions changes the total, forecast range and goal bar; only approved selections carry into monitoring. Actions below 75% illustrative confidence start at 10% rollout. Detailed formulas and assumptions stay under Details.

The default example generates a result 20% above the positive monthly goal: Rs 50k → Rs 60k, Rs 75k → Rs 90k. This is a synthetic target-beating demo, not measured or guaranteed merchant recovery. The second example keeps the original Rs 19k result and starts with a Rs 15k target. Its row contributions are Rs 7k + Rs 6k + Rs 4k + Rs 2k. Set that example's goal to Rs 50k to reproduce the Rs 31k gap and −62% deviation. The 92% confidence is illustrative; it is not statistically inferred.

A simulated external-event prompt appears once after 8–18 seconds spent on Overview. Use Simulate external event to show it on demand while recording. Later / dismiss leaves permissions unchanged; Review coordination pauses an active plan and opens rules for a retest. No external service, live event detection, or real notification is connected.
