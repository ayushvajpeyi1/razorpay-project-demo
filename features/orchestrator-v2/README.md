# Revenue Orchestrator V2

V2 is a separate, additive implementation at `/orchestrator-v2`. The original `/orchestrator`, its feature files, dashboard shell and existing tests are unchanged. The original-version header link is intentionally omitted.

## The merchant case

Aster Living is a fictional D2C/subscription merchant with ₹2 Cr monthly payment volume, ₹10L eligible recovery and 10% customer overlap. Customer C-2188 has conflicting cart and subscription recovery requests. Customer C-4410 is cart-only and keeps the existing workflow.

The journey makes system-level decision making visible:

1. Discover customer-level conflict and revenue exposure.
2. Inspect context, competing actions and a testable coordination hypothesis.
3. Authorize a five-arm customer-randomized test and advance seeded checkpoints.
4. Review the complete strategy bundle, its forecast and remaining goal gap.
5. Approve rollout, execute the customer trace and compare portfolio outcomes with the forecast.
6. Retain scoped evidence and separately saved preferences; retest only a sale-affected cohort.

## Recording the happy path

Use a 1440 × 900 viewport. Inspect the decision, switch between customer examples, then design and authorize the experiment. Advance to day 14 and day 28. Review the plan: +₹19k forecast against a ₹50k goal, leaving a ₹31k gap. Editing the goal never changes the evidence.

Approve the complete strategy, then execute three permitted actions: resolve the conflict, call the renewal agent, confirm payment and cancel the cart call. Load the separate day-28 portfolio snapshot (+₹17.8k normalized realized lift), inspect learning, and simulate the sale announcement. Run the scoped retest, load its result and approve the sale-only timing update.

## Evidence and simulation limits

All data, experimental outcomes, samples, uncertainty ranges, timestamps and customer decisions are fictional fixtures. There is no model, backend, agent connection or live data. The goal does not generate results. Permission checks and scenario transitions are functional local demo state. Refresh resets the case; preferences and audit events last for the visit.

The five seeded experiment arms have 1,000 customers each, drawn from all eligible recovery traffic, including 10% overlap. Net amounts are ₹20,000 (control), ₹19,800 (blanket rule), ₹20,700 (priority), ₹20,400 (delay) and ₹21,900 (combined). Normalize the difference per customer to 10,000 monthly eligible customers: combined monthly incremental net is ₹19,000. Costs include agent execution, communication, existing offer costs and orchestration; recovery is net of reversals. The ₹12k–26k band is an illustrative planning range, not a calculated confidence interval. Separate observed fixtures yield ₹17,800 normalized lift and a −₹1,200 forecast error. These are full-coverage equivalents, not collected cash from the 20% initial rollout.

The combined strategy is not a menu of additive contributions. Removing a component requires another test. Rollout retains a 10% independent-agent holdout.

The sale affects 20% of eligible traffic. Existing conditions remain applicable to the other 80%. Within the original test authorization, a new two-arm sale-cohort test compares 24-hour and 72-hour retry timing while retaining consent, priority and offers. The seeded 400-customer arms yield ₹19 and ₹18 net/customer; the ₹1 difference over 2,000 monthly sale customers produces ₹2,000 monthly improvement within that cohort. Do not add it blindly to the old forecast under changed conditions. A fresh merchant approval is required for the sale-only strategy update.

## Failure cases

- Too little traffic: withhold lift, show an inconclusive result, retain samples during one 14-day extension, remain inconclusive after day 42 and block rollout.
- Losing combination: report −₹12k and keep independent agents, even though individual interventions are positive.
- Runtime performance drop: automatically revert and record a simulated alert.
- Cart integration outage: stop affected cart actions; the permitted renewal trace can continue.
- Pause/revoke: stop coordinated actions; revocation retains completed evidence. Limits changes invalidate authorization; goal-only edits do not.

## Validation

Run `pnpm typecheck`, `node qa/v2-state-test.cjs`, `node qa/state-test.cjs`, and `pnpm build`. V2 state tests check evidence independence, permission gates, stale limits, execution, failure handling and selective retesting. Browser checks cover the journey, goal edits, low traffic, losing coordination, rollback and scoped failure. Desktop and mobile captures and layout results live in `qa/orchestrator-v2/`.

## Forgiving decisions and inspectable memory

Plan rejection retains experiment authorization and validated evidence. Rejection, pause and permission revocation expose explicit Undo actions that restore the prior permissions and execution status without replaying completed work. Changing limits or starting another experiment clears stale undo points. Automatic performance rollback cannot be undone through this action. Revoked permissions also have an explicit restore-authorization path that reuses completed evidence and still requires plan approval.

View validated learnings is available from every tab. Its registry starts with one dated historical fictional finding, accumulates supported and rejected completed-experiment findings and selective sale results, and adds observed lift when available. Inconclusive tests and merchant preferences are excluded. Scenario changes retain the registry; Reset case restores its seed history. The review tab displays the saved recovery preference, explains how the tested plan relates to it, and supports editing in a dialog. Preference edits do not alter experimental evidence.
