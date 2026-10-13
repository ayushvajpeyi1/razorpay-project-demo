# AI Build Log — Razorpay Revenue Orchestrator

**Author:** Ayush Vajpeyi  
**Challenge:** Razorpay AI PM Build Challenge — Track 2: Recover and Grow with AI  
**Prototype build period:** 12–13 October 2026, following earlier research and product exploration  
**Deliverable:** An interactive prototype built with Next.js, React, TypeScript, and Tailwind CSS.

## 1. Origin of the idea and human ownership

I introduced the idea of a **Meta Advantage+-inspired growth system for SMEs**: merchants specify an outcome and constraints, while a system takes on more of the prioritization, coordination, experimentation, and optimization that would otherwise require a dedicated growth team.

The analogy described the intended merchant experience and operating model. It was not a claim that advertising optimization and payment recovery have identical data, economics, or permissions.

ChatGPT and Claude helped translate my vision into Razorpay's ecosystem and challenge its assumptions. The resulting Revenue Orchestrator concept coordinates recovery capabilities around a merchant objective, tests their combined impact, and retains validated learnings. I owned the original direction, problem selection, scope, acceptance decisions, and feedback; AI supported research, critique, design exploration, implementation, and verification.

## 2. AI tools and models used

| Tool | Use in this project | Model disclosure |
| --- | --- | --- |
| ChatGPT | Business-model exploration, merchant jobs to be done, brainstorming, CIRCLES draft, literature mapping, cross-review, product-note and walkthrough refinement | The supplied research chats do not reliably identify the exact model/version. No specific version is claimed. |
| Claude | Landscape research, alternative comparison, source checking, experiment-design critique, Advantage+ analogy review, control and audit-framework exploration | The supplied Claude log does not identify the exact model/version. No specific version is claimed. |
| OpenAI Codex | Repository inspection, prototype implementation and redesign, debugging, wireframe creation, state/build/browser checks, and publication assistance | The historical implementation records supplied for this log do not reliably identify the exact model/version. Codex is the tool name, not an asserted model identifier. |

Exact model versions were not consistently recorded during the build. This is a documentation limitation rather than an assumption that all sessions used the same model.

## 3. Key prompts, workflows, and agent setup

### Representative prompts

The first two prompts below are reconstructed summaries of my requests, not verbatim transcripts:

- **Vision translation:** “Explore an Advantage+-like growth system for SMEs in Razorpay: given a merchant goal and constraints, how could it prioritize and coordinate recovery actions?”
- **Product design:** “Define the signals, decisions, approval boundaries, measurement, and learning loop for a Revenue Orchestrator, with a bounded initial scope and a broader roadmap.”

Examples recorded in the available project conversations:

- “I am trying to first understand what Razorpay does, what is their revenue/business model.”
- “We don't have an architecture flow at all. So … what are we going to do there?”
- “Check and compare against the grading rubric.”
- “Give me a corrected writeup and show what you have changes.”
- “Based on whatever website version we have currently, can you make a GPT canvas for a wireframe?”

These requests moved the work from explanation to architecture, critique, implementation, and reviewable artifacts.

### Working method

1. I supplied the challenge brief, original idea, constraints, references, and feedback.
2. ChatGPT helped develop the product argument and possible approaches.
3. I brought Claude critiques into ChatGPT for cross-review instead of accepting one tool's answer as definitive.
4. We narrowed the scope, marked assumptions, and clarified what would count as incremental value.
5. I gave Codex the product direction and requested a working prototype.
6. Codex inspected the project, planned changes, implemented them, and checked calculations, interactions, and layouts.
7. I reviewed the experience, identified mismatches, and directed further changes, including a separate V2.
8. Codex assisted with publishing after I chose the destinations and authorized account access.

### Agent setup

The build used interactive conversations with ChatGPT and Claude and a coding-agent workflow in Codex. Codex worked with repository files, a local preview, browser inspection, and verification records. This was human-directed iteration.

The Cart Recovery and Subscription Recovery agents shown inside the prototype are **simulated product capabilities**, not connected autonomous agents. The demo contains no live LLM orchestration, payment backend, or production learning system.

## 4. Detailed build workflow and decisions

### A. Researching the existing landscape

ChatGPT helped organize Razorpay's business and product surface into transaction signals, checkout capabilities, recovery workflows, engagement channels, and financial operations. Claude researched Agent Studio's launch agents, partners, and controls.

I challenged the early framing that Agent Studio merely provided individual tools. The research discussions indicated that existing capabilities already included detection, reasoning, execution, and merchant controls. “Find a problem and deploy an agent” was therefore insufficient differentiation.

The proposed gap shifted toward cross-opportunity prioritization, coordination when interventions interact, and measurement of incremental net value. I treated “agent bloat” as a possible future trajectory, not an established current fact.

### B. Exploring merchant needs and alternatives

AI drafted segments and jobs to be done for D2C, subscription, small, mid-market, and marketplace businesses. I focused on SMEs, particularly growing merchants that could benefit from a stronger growth system without assembling a specialist team.

We compared a playbook marketplace, AI teams, trust infrastructure, regulatory AI, and orchestration. I selected orchestration, moved the marketplace to a possible later-phase input, and rejected “AI teams” as a headline because a label alone added no new behavior.

These were product hypotheses. AI-generated segmentation did not substitute for completed merchant interviews.

### C. Challenging the product argument

ChatGPT produced a CIRCLES draft; Claude critiqued scope, differentiation, evidence, and feasibility. Cross-review exposed unsupported confidence figures and a gap between the long-term vision and the initial demonstration.

I removed the consulting-firm analogy and an “82% confidence” figure that implied evidence we did not have. I revised an overstated liability-gap claim, removed pricing and discount levers from scope, and downgraded a claimed marketplace moat to a potential compounding advantage.

The roadmap retained a bounded initial demonstration and a broader orchestration vision.

### D. Research support and measurement design

ChatGPT mapped literature to contextual intervention selection, controlled experiments, and oversight. Claude checked and critiqued the mapping. I narrowed the references to Wager & Athey, Kohavi, and Babic, treating marketing evidence as transferable by analogy rather than direct proof of payment recovery performance.

We examined the tension between adaptive optimization and predictable merchant-approved policies. The proposed approach became bounded tests, evaluation, and reviewed promotion of validated policies.

The central metric became:

**Incremental net recovered revenue = net recovery under coordinated policy − net recovery under independent-agent policy.**

Each arm must account for its own relevant costs. Real evaluation would require comparable populations, appropriate normalization, and adequate sample size. The prototype illustrates the comparison; it does not calculate production causal estimates.

### E. Merchant control and audit design

Claude proposed six levels of visibility: raw logs, dashboard summaries, agent drill-downs, transaction traces, weekly summaries, and compliance exports.

I used this as a design framework for inspectable decisions and outcomes. I rejected removing control to create lock-in and adopted **“hide complexity, not control.”**

The prototype demonstrates parts of this direction through approvals, execution traces, learning history, pause, revocation, and rollback. The complete six-level audit framework was not implemented. Its example figures are not observed merchant results, and auditability alone is not claimed as the unique differentiator.

### F. First prototype and usability revisions

Codex planned and built a seven-screen journey covering goals, rules, experiments, approval, monitoring, and memory. Its work included components, synthetic fixtures, calculations, local state, navigation, and approval boundaries.

I provided the concept and references and reviewed the experience. I flagged dense screens, unclear underperformance, blocked approval paths, and a flow that felt like a slide deck.

Codex simplified the interface, moved detail behind expandable sections, made blockers actionable, and added clearer charts, selectable actions, and scenario switches. My review focused on whether a merchant could understand the decision and its consequences.

### G. V2 redesign

After comparing the demo with the proposal, Codex identified gaps in visible decision logic, experimentation, execution detail, and learning. I authorized a separate V2 while preserving the original.

V2 uses **Discover → Decide → Experiment → Approve → Execute → Learn**. It adds customer-level conflicts, five experiment arms, checkpoint results, execution traces, and selective retesting after changed conditions.

Further feedback led to Undo for rejection, pause, and revocation; retained evidence; inspectable learning history; and editable preferences. Codex also created an editable wireframe from the current experience.

### H. Communication and publication

ChatGPT and Claude helped critique the product note and refine the walkthrough. Codex assisted with deployment configuration, GitHub publication, and GPT Sites and Vercel hosting.

I made the final scope and acceptance decisions, selected hosting destinations, and authorized account access. This log does not claim that a completed demo video was produced.

## 5. One AI-assisted output significantly corrected

An earlier demo generated a winning result at **120% of whatever goal the merchant entered**. Review identified that this made the story less credible: changing the target appeared to change the evidence.

V2 separates merchant intent from experimental evidence:

| Earlier behavior | Revised behavior |
| --- | --- |
| Entering a different goal generated a correspondingly higher winning result | Changing the goal leaves the experiment result unchanged |
| The scenario implied that coordination would beat the requested target | A ₹50,000 goal is compared with a fixed ₹19,000 illustrative forecast, leaving a ₹31,000 gap |
| The demonstration emphasized a convenient success story | A separate ₹17,800 synthetic observed outcome illustrates forecast-versus-observed comparison |

**Why it mattered:** An optimizer should reveal whether an objective is achievable, not manufacture success around it. AI accelerated implementation, but review was needed to decide whether the implementation represented the product honestly.

All amounts above remain fictional demonstration values.

## 6. What AI did versus what I did

| AI contribution | My contribution |
| --- | --- |
| Organized research and proposed interpretations | Introduced the Advantage+-inspired SME growth-system idea and challenged interpretations |
| Generated alternatives, drafts, and critiques | Selected the product direction, narrowed scope, and rejected weak framing |
| Mapped literature and checked the proposed argument | Set evidence standards and treated unvalidated claims as hypotheses |
| Implemented components, local state, scenarios, calculations, and wireframes | Supplied requirements and references; identified product and usability problems |
| Ran checks, debugged issues, and revised the prototype | Reviewed successive versions and decided what was acceptable |
| Assisted with publication and submission writing | Chose publication destinations and authorized access |

Most prototype code was AI-assisted through Codex. My primary contribution was product thinking, specification, review, and acceptance; I do not claim to have manually written all implementation code.

## 7. Known limitations, risks, and verification

### Verification recorded during the build

Saved records report passing TypeScript, production-build, and state checks, plus browser interaction and desktop/mobile layout checks. V2 checks covered:

- Approval boundaries and goal/evidence independence.
- Insufficient traffic and inconclusive outcomes.
- Losing coordination and runtime rollback.
- Integration outage and selective retesting.
- Undo, pause, revocation, and inspectable learning.

These statements describe saved build records. Checks were not rerun for this documentation publication, and passing them does not establish real merchant impact.

### Limitations and risks

- **Fictional evidence:** Merchant data, revenue figures, experiment outcomes, confidence values, uncertainty ranges, and execution events are fixtures.
- **No live AI or recovery execution:** The demo has no connected model, payment backend, live agents, customer calls, or external alerts.
- **Unvalidated problem hypotheses:** Merchant behavior, agent interference, willingness to delegate, and intervention effectiveness need real-world research.
- **Illustrative confidence:** Displayed confidence is not a measured probability of success. Real deployment needs calibrated estimates and explicit uncertainty.
- **Experimental feasibility:** A live system would need adequate traffic, comparable customer groups, correct cost accounting, and safeguards against contamination between arms.
- **Production controls:** Local approval behavior demonstrates intent; it is not production authentication, consent enforcement, authorization, or durable audit storage.
- **Limited persistence:** Refresh resets the visit; preferences and audit events are local demonstration state.
- **Research limitations:** Exact model versions were not consistently logged, and literature analogies do not prove the proposed use case.
- **No quantified productivity claim:** No controlled development-time or cost comparison was recorded.

## 8. Supporting records and artifacts

- [Detailed implementation log](AI_BUILD_LOG.md)
- [V2 behavior and assumptions](features/orchestrator-v2/README.md)
- [V2 validation records](qa/orchestrator-v2/validation.json)
- [V2 usability checks](qa/orchestrator-v2/forgiving-checks.json)
- [Source repository](https://github.com/ayushvajpeyi1/razorpay-project-demo)
- [Hosted prototype](https://revenue-orchestrator.vercel.app)

This submission log combines recorded build conversations, the supplied Codex build summary, and the supplied Claude research log. It distinguishes implemented behavior, design explorations, human decisions, and unresolved validation.
