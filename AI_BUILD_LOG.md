# AI build log — Revenue Orchestrator

## Inspection and baseline
- Inspected Next.js 15 App Router, TypeScript, Tailwind 4, Lucide, and the existing custom CSS tokens. Existing Home, Settlements, and Reports controls are presentational; only Transactions has a page.
- Read the live Chrome Razorpay dashboard as a visual reference. No account actions or external writes were performed.
- Initialized the local Git repository, committed the baseline, and created `feature/revenue-orchestrator` at the user's request.
- Kept the existing header, TEST toolbar (including removed notch), and support button. Rejected adding a new CSS system, backend, or deployment.

## Screen 1 and integration
- Added the `/orchestrator` route and isolated feature styles, shared primitives, fictional fixtures, and reducer state.
- Added the sidebar entry and Failed-card recovery link. Existing zero metrics and visual-only main navigation stay intact.
- Built the two-agent problem and duplicate-customer timeline. Free step navigation never grants approvals.
- All setup edits invalidate relevant approvals; changed experiment setup keeps historical fixtures visibly stale rather than inventing new evidence.

## Screen 2 — Goal and diagnosis
- Added validated goal, timeline, cost cap and opt-out inputs with the planned defaults.
- Analysis is a cancellable 1.4-second local animation, followed by the fixed fictional overlap diagnosis.
- Editing inputs cancels pending analysis; unmounting clears the timer. No transaction or agent-log API is called.

## Screen 3 — Merchant framework
- Added agent and cohort eligibility, spend and exposure controls, required randomized holdout, and editable stop conditions.
- The consent / offer policy is explicit: only sequence, delay or suppress existing permitted outreach; never add contact, change prices or create discounts.
- Edit focuses the spend field. Approval records an audit entry but cannot make stale or inconclusive evidence usable for rollout.

## Screen 4 — Experiment centerpiece
- Added the animated SVG net-revenue comparison, independent / coordinated cost math, overlap callout and incremental Rs 19k result.
- Kept standalone Rs 1.4L / Rs 1.1L recovered-revenue baselines separate: their costs are not supplied, so they cannot be represented as net bars.
- Display whiskers are explicitly fictional display fixtures, not calculated statistical intervals. The supplied Rs 12k–26k range remains a forecast.
- Low traffic removes both arm point estimates and the incremental estimate, shows wide uncertainty, and blocks rollout while extending the illustrative test by 10 days.

## Screen 5 — Roadmap
- Added Sequence / Suppress / Keep recommendations, the Rs 19k of Rs 50k gauge, and honest Rs 31k remaining gap.
- Goal edits change the target and gap only. Low traffic hides the goal estimate; stale evidence and insufficient caps / guardrails cannot authorize rollout.
- Approve starts simulated monitoring only after framework approval. Edit returns to framework and Reject visibly retains independent agents.

## Screen 6 — Simulated execution
- Added a clearly fictional monitoring snapshot, complaint / opt-out / spend guardrails, merchant overrides and local audit history.
- Pause, Revoke permissions and Edit cohorts have stateful outcomes. Navigation alone never starts execution.
- Underperformance immediately reverts to independent agents and records a simulated alert. Disabling the toggle does not automatically restart coordination.
- Monitoring numbers are explicitly fixed demonstration values, not accumulating live metrics.

## Screen 7 — Revenue memory
- Added separate scenario context, dated / expiring illustrative learnings and editable merchant preferences.
- Saved preferences stay in visit memory and cannot alter experimental evidence or permissions.
- Seasonal selective retest returns to framework, invalidates rollout approval, and explicitly requires fresh evidence. The fixed demo does not fabricate retest outcomes.

## Requested visual revision during QA
- Removed the entire TEST toolbar from Transactions and Orchestrator after the user identified it in an attached screenshot. This supersedes the original plan to keep that toolbar.
- Removed its unused component, icons and styles and closed the empty space above content. The top navigation and sidebar Test Mode control remain unchanged.

## Validation and recording refinements
- TypeScript and the initial production build passed. Pure reducer tests cover arithmetic, navigation versus permission, approvals, stale setups, low traffic, automatic reversion, pause, revoke, rejection, retest, policies and validation.
- Browser QA exercised 36 interaction / state checks, including both entries, keyboard shortcuts and focus exclusion, form validation, diagnosis, the default approval path, edited goals, stale framework blocking, and refresh reset.
- Checked all seven desktop screens and all seven mobile screens for horizontal overflow and demo / support overlap. Transactions retained its three zero-valued cards and loaded logo at all three reference sizes.
- Tightened feature-only spacing and placed actions away from the floating Help control. After analysis, the form becomes a compact goal summary with an Edit goal action, making diagnosis visible in the recording frame.
- Both failure scenarios remain explicit simulations. Required reversion / holdout / consent guardrails cannot be disabled; their numeric thresholds are editable.
- Added reduced-motion CSS that disables feature transitions and animations; inspected its cascade. No OS preferences were changed.
- Browser QA uses the existing Codex in-app browser, not the historical Edge QA runner (Edge is absent on this Mac). Results and screenshots are in `qa/orchestrator/`.
- No additional frameworks, chart libraries, runtime dependencies, backend calls, or deployment were introduced.

## Final verification
- Final production build passed after the TEST-toolbar removal and approval edge-case fixes. Direct goal invalidation cannot bypass rollout checks; re-approving a framework pauses an already running simulation.
- All seven default desktop screens end within the 1440 × 900 recording frame, with unobstructed buttons and two illustrative / proposal badges. Diagnosis and underperformance states also fit; goal Edit restores the form.
- Transactions passes the three-size regression after toolbar removal. All seven mobile screens have no horizontal overflow or demo / support collision.
- Left the production preview running at `http://127.0.0.1:3000/orchestrator`. Vercel deployment remains deferred.

- Final production browser inspection showed no console errors. The preview is reset to the first screen with no permissions pre-granted.

## Merchant usability revision
- User reported that underperformance was unclear, Roadmap approval stayed disabled after edits, and the flow felt like a text-heavy slide deck. Inspected the actual open tab: stale setup plus the underperformance toggle were blocking approval while the UI still showed positive numbers.
- Replaced the permanent stale-state dead end with a cancellable local test. Rule approval starts the test; finishing refreshes synthetic scenario results. There is no backend or claim of real evidence.
- Centralized the interactive scenario model: default coordination gain Rs 19k; losing scenario net Rs 1.88L versus Rs 2L control, a Rs 12k loss. Selecting one of two equally weighted demo customer groups changes the gain to Rs 8k due to fixed Rs 3k orchestration cost. Exposure affects test size, not forecast profit.
- Made winning / losing / inconclusive outcomes visible on Test and Your plan. Active underperformance rolls back monitoring and updates numeric comparisons. Inactive underperformance shows a losing scenario without pretending agents were running.
- Roadmap now presents a useful primary action for each blocker instead of a permanently disabled button. Reset winning demo clears permissions and preserves saved preferences. No approval is granted by navigation or reset.
- Simplified all seven screens around a merchant question and next action. Renamed steps to Your goal / Your rules / Test / Your plan / Monitor / Learn. Moved math, assumptions and logs behind expandable details; consent and price restrictions remain visible during approval.
- Added direct monthly-goal editing on Your plan and plain-language scenario switches: Not enough data / Recovery drops. Kept the honest remaining gap: the default gain covers 38% of the Rs 50k target.
- Revision QA: reducer checks pass for positive / negative outcome arithmetic, customer edits, stale-result recovery, async cancellation, rollback, reset and permissions. Browser checks confirm active approval after retest, direct goal edits, clear losing numbers, and a reset that grants no permissions.
- All seven revised desktop screens have 48–115 visible words in the core content with details closed; each fits the recording frame with unobstructed actions. All seven mobile screens have no horizontal overflow or demo / support overlap. Revision screenshots and check results are in `qa/merchant-demo/`.
- Final revision build and TypeScript checks passed. Verified 16 browser interaction checks, including production roadmap approval. Left the preview on Your plan with a positive Rs 19k result and an enabled Approve roadmap action; execution has not been approved.

## Three-option experiment and selectable plan redesign
- Applied the user's new Screen 4/5 specification plus their explicit additions for Screen 1 and the default winning scenarios. Used the confirmed 20% above-goal default. Work stays on `feature/revenue-orchestrator`.
- Screen 4 now has exactly three extra-recovery bars: independent agents (zero), a simple 7-day suppression rule (Rs −2k), and AI coordination. Removed whiskers; ranges are text. Two illustrative customer comparisons show priority and 72-hour retry logic. Revenue / cost math and the north-star formula are under Details.
- Screen 5 now has one headline, one goal bar and one four-row selectable table. Fixed-example contributions are Rs 7k / 6k / 4k / 2k. Unchecking rows updates totals, range and goal deviation immediately. Lower-confidence rows start at 10% rollout. Approved actions and amounts are saved as a snapshot and carried into monitoring.
- Added two explicit synthetic demo examples: target-beating (20% above whatever positive goal is entered, all actions selected) and the original fixed Rs 19k case with a Rs 15k goal. Changing back to a Rs 50k goal in the fixed case reproduces the honest Rs 31k / −62% gap. The target-beating case is generated demo data, not measured or guaranteed business performance.
- Added illustrative 92% full-plan confidence and conservative per-selection confidence. These are fixture values, not statistical inference. Customer-group counts may overlap; they are not summed as unique customers.
- Screen 1 is now a recovery overview dashboard. A simulated business-event prompt appears once after a randomized 8–18 seconds spent on the overview, or can be triggered manually for recording. Dismissal changes no permissions; reviewing pauses active coordination and requires rule approval / retest. No real external event is detected and no real alert is sent.
- Left the dashboard shell and Screens 2/3 layouts untouched. Screen 6 only gains selected-plan carryover; Screen 7's existing layout is unchanged, with its result source wired to the active example for consistency.
- Verified 24 browser checks covering exact chart / card / table counts, row recalculation, approved subset carryover, both winning scenarios, the original Rs 31k / −62% gap, inline gap expansion, low-traffic hiding all bars, automatic and manual external events, dismissal and retuning. Overview / Test / Plan have no page overflow or obstructed actions at 1440 × 900; mobile page overflow checks pass with the table scrolling inside its container.

- Final production build passed. Confirmed three comparison bars and enabled selected-plan approval in production; left the preview on the new Overview with no execution permissions granted. Lower-confidence rollout is capped at the merchant's exposure limit.
