// A single fictional merchant case. All evidence is seeded, never inferred from the goal.
export const stages = ['Discover', 'Decide', 'Experiment', 'Approve', 'Execute', 'Learn'];
export const arms = [
  { name: 'Independent agents', intervention: 'Existing workflows, no coordination', gross: 24000, cost: 4000, net: 20000 },
  { name: 'Blanket 7-day rule', intervention: 'Block every second call for seven days', gross: 23700, cost: 3900, net: 19800 },
  { name: 'Renewal priority only', intervention: 'Choose renewal first; keep existing retries', gross: 24500, cost: 3800, net: 20700 },
  { name: 'Conditional delay only', intervention: 'Keep existing priority; delay eligible retries', gross: 24000, cost: 3600, net: 20400 },
  { name: 'Combined strategy', intervention: 'Contextual priority + delay + suppression', gross: 25800, cost: 3900, net: 21900 },
];
export const money = (n: number) => `${n < 0 ? '−' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`;
export const lift = (n: number) => `${n > 0 ? '+' : ''}${money(n)}`;
export type Scenario = 'standard' | 'low-traffic' | 'losing';
export type Settings = { goal: number; budget: number; complaintLimit: number };
export type ValidatedLearning = {
  id: string; title: string; population: string; conditions: string; date: string;
  lift: number; observed?: number; customersPerArm: number; verdict: 'supported' | 'rejected'; finding: string;
};
export const historicalLearnings: ValidatedLearning[] = [{
  id: 'priority', title: 'Renewal priority alone', population: 'Eligible recovery traffic; apply priority to renewal/cart overlap',
  conditions: 'Normal trading; existing offers', date: '29 Sep 2026', lift: 7000, customersPerArm: 1000, verdict: 'supported',
  finding: 'Renewal-first priority improved net recovery against independent agents. This does not establish the combined strategy’s lift.',
}];
export type CaseState = {
  stage: number; settings: Settings; scenario: Scenario; experiment: 'idle' | 'running' | 'complete'; checkpoint: number; extensions: number;
  envelope: boolean; approved: boolean; status: 'off' | 'running' | 'paused' | 'reverted'; execution: number;
  event: boolean; seasonalTest: 'idle' | 'running' | 'complete'; seasonalApproved: boolean; failure: boolean;
  preferences: string; history: string[]; learnings: ValidatedLearning[];
  undo: { kind: 'reject' | 'pause' | 'revoke'; previous: Pick<CaseState, 'envelope' | 'approved' | 'status' | 'experiment' | 'seasonalTest' | 'seasonalApproved'> } | null;
};
export const initialCase: CaseState = {
  stage: 0, settings: { goal: 50000, budget: 45000, complaintLimit: 1 }, scenario: 'standard',
  experiment: 'idle', checkpoint: 0, extensions: 0, envelope: false, approved: false, status: 'off', execution: 0,
  event: false, seasonalTest: 'idle', seasonalApproved: false, failure: false,
  preferences: 'Prefer renewal recovery. Use existing consent and offers only.', history: [], learnings: historicalLearnings, undo: null,
};
export const forecast = (s: CaseState) => s.scenario === 'losing' ? -12000 : 19000;
export const resultReady = (s: CaseState) => s.experiment === 'complete' && s.scenario !== 'low-traffic';
export const validSettings = (s: Settings) => Number.isFinite(s.goal) && s.goal > 0 && Number.isFinite(s.budget) && s.budget > 0 && Number.isFinite(s.complaintLimit) && s.complaintLimit > 0 && s.complaintLimit <= 100;
export function approvalBlock(s: CaseState) {
  if (!resultReady(s)) return 'Complete an approved experiment with sufficient evidence first.';
  if (!s.envelope) return 'Permissions are revoked. Your experiment results are saved; restore authorization to continue.';
  if (!validSettings(s.settings)) return 'Enter a valid goal, spending cap and complaint limit.';
  if (forecast(s) <= 0) return 'Coordination underperforms. Keep independent agents running.';
  if (s.settings.budget < 39000) return 'The ₹39,000 monthly cost exceeds your spending cap.';
  if (s.settings.complaintLimit < 0.3) return 'The 0.3% complaint rate exceeds your stop limit.';
  return '';
}
export type CaseAction =
  | { type: 'stage'; value: number } | { type: 'settings'; value: Settings } | { type: 'scenario'; value: Scenario }
  | { type: 'authorize' } | { type: 'advanceTest' } | { type: 'extendTest' } | { type: 'approve' }
  | { type: 'execute' } | { type: 'reject' } | { type: 'pause' } | { type: 'resume' } | { type: 'revoke' } | { type: 'undoDecision' } | { type: 'reauthorize' } | { type: 'drop' } | { type: 'failure' }
  | { type: 'event' } | { type: 'seasonalTest' } | { type: 'seasonalComplete' } | { type: 'seasonalApprove' }
  | { type: 'preferences'; value: string } | { type: 'reset' };
const record = (s: CaseState, entry: string) => [...s.history, entry];
const decisionSnapshot = (s: CaseState, kind: 'reject' | 'pause' | 'revoke'): CaseState['undo'] => ({ kind, previous: { envelope: s.envelope, approved: s.approved, status: s.status, experiment: s.experiment, seasonalTest: s.seasonalTest, seasonalApproved: s.seasonalApproved } });
const mergeLearnings = (saved: ValidatedLearning[], updates: ValidatedLearning[]) => [...saved.filter(row => !updates.some(update => update.id === row.id)), ...updates];
function experimentLearnings(s: CaseState): ValidatedLearning[] {
  return arms.slice(1).map((arm, i) => {
    const increment = i === 3 ? forecast(s) : (arm.net - arms[0].net) * 10;
    return { id: ['blanket', 'priority', 'delay', `combined-${s.scenario}`][i], title: arm.name, population: 'Eligible recovery traffic; 10% renewal/cart overlap', conditions: 'Normal trading; existing offers', date: '12 Oct 2026', lift: increment, customersPerArm: 1000, verdict: increment > 0 ? 'supported' : 'rejected', finding: i === 3 ? increment > 0 ? 'The complete bundle beats independent agents. Removing components requires another test.' : 'The combination loses even though individual interventions help. Keep independent agents.' : arm.intervention };
  });
}
export function caseReducer(s: CaseState, a: CaseAction): CaseState {
  switch (a.type) {
    case 'stage': return { ...s, stage: Math.max(0, Math.min(5, a.value)) };
    case 'settings': {
      const limitsChanged = a.value.budget !== s.settings.budget || a.value.complaintLimit !== s.settings.complaintLimit;
      return { ...s, settings: a.value, undo: limitsChanged ? null : s.undo, envelope: limitsChanged ? false : s.envelope, approved: limitsChanged ? false : s.approved, experiment: limitsChanged ? 'idle' : s.experiment, checkpoint: limitsChanged ? 0 : s.checkpoint, execution: limitsChanged ? 0 : s.execution, event: limitsChanged ? false : s.event, seasonalTest: limitsChanged ? 'idle' : s.seasonalTest, seasonalApproved: limitsChanged ? false : s.seasonalApproved, status: limitsChanged && s.status === 'running' ? 'paused' : s.status };
    }
    case 'scenario': return { ...initialCase, settings: s.settings, preferences: s.preferences, learnings: s.learnings, scenario: a.value, history: record(s, 'New fictional evidence scenario selected; approvals cleared; learning history retained.') };
    case 'authorize': return validSettings(s.settings) && s.settings.budget >= 39000 ? { ...s, undo: null, envelope: true, approved: false, status: 'off', execution: 0, event: false, seasonalTest: 'idle', seasonalApproved: false, failure: false, experiment: 'running', checkpoint: 1, extensions: 0, stage: 2, history: record(s, 'Merchant authorized five-arm experiment: 50% exposure, randomized customers, existing consent only.') } : s;
    case 'advanceTest': return s.experiment === 'running' ? { ...s, undo: null, checkpoint: Math.min(3, s.checkpoint + 1), experiment: s.checkpoint >= 2 ? 'complete' : 'running', learnings: s.checkpoint >= 2 && s.scenario !== 'low-traffic' ? mergeLearnings(s.learnings, experimentLearnings(s)) : s.learnings, history: s.checkpoint >= 2 ? record(s, s.scenario === 'low-traffic' ? `Day ${s.extensions ? 42 : 28}: insufficient sample; result inconclusive.` : 'Day 28: seeded experiment completed; validated findings saved to learning history.') : s.history } : s;
    case 'extendTest': return s.scenario === 'low-traffic' && s.experiment === 'complete' && s.extensions === 0 && s.envelope ? { ...s, undo: null, experiment: 'running', checkpoint: 1, extensions: 1, history: record(s, 'Test extended by 14 days within the approved envelope; existing samples retained, outcome may remain inconclusive.') } : s;
    case 'approve': return approvalBlock(s) ? s : { ...s, undo: null, approved: true, status: 'running', stage: 4, history: record(s, 'Merchant approved complete strategy bundle; 20% initial rollout, holdout retained.') };
    case 'execute': return s.approved && s.status === 'running' && s.execution < 4 && !approvalBlock(s) ? { ...s, undo: null, execution: s.execution + 1, learnings: s.execution === 3 ? s.learnings.map(row => row.id === 'combined-standard' ? { ...row, observed: 17800 } : row) : s.learnings, history: record(s, ['Renewal agent reserved customer C-2188; cart call held.', 'Consent checked outside model; existing renewal call executed.', 'Payment confirmed for C-2188; cart call cancelled.', 'Day 28 portfolio snapshot loaded; observed lift +₹17,800/month.'][s.execution]) } : s;
    case 'reject': return resultReady(s) && s.undo?.kind !== 'reject' ? { ...s, undo: decisionSnapshot(s, 'reject'), approved: false, status: 'off', seasonalApproved: false, history: record(s, 'Merchant kept agents independent; experiment authorization and validated findings retained.') } : s;
    case 'pause': return s.status === 'running' ? { ...s, undo: decisionSnapshot(s, 'pause'), status: 'paused', history: record(s, 'Merchant paused all coordinated actions.') } : s;
    case 'resume': return s.approved && s.status === 'paused' && !approvalBlock(s) ? { ...s, undo: null, status: 'running', history: record(s, 'Merchant resumed approved coordination; affected actions remain held.') } : s;
    case 'revoke': return s.envelope || s.approved ? { ...s, undo: decisionSnapshot(s, 'revoke'), envelope: false, approved: false, status: 'off', experiment: s.experiment === 'running' ? 'idle' : s.experiment, seasonalTest: s.seasonalTest === 'running' ? 'idle' : s.seasonalTest, seasonalApproved: false, history: record(s, 'Merchant revoked permissions; coordinated actions stopped; completed evidence retained.') } : s;
    case 'undoDecision': {
      if (!s.undo) return s;
      const restored = { ...s, ...s.undo.previous };
      if (restored.approved && approvalBlock(restored)) return s;
      return { ...restored, undo: null, history: record(s, `Merchant undid ${s.undo.kind}; prior permissions and execution status restored. Completed actions unchanged.`) };
    }
    case 'reauthorize': return resultReady(s) && validSettings(s.settings) && s.settings.budget >= 39000 ? { ...s, undo: null, envelope: true, approved: false, status: 'off', history: record(s, 'Merchant restored experiment authorization; existing validated results retained. Plan approval still required.') } : s;
    case 'drop': return s.approved && s.status === 'running' ? { ...s, undo: null, status: 'reverted', approved: false, history: record(s, 'Live demo loss −₹12,000: auto-reverted to independent agents; simulated merchant alert.') } : s;
    case 'failure': return s.approved && s.status === 'running' ? { ...s, undo: null, failure: true, history: record(s, 'Cart integration unavailable: affected cart retries stopped; renewal workflow continues.') } : s;
    case 'event': return s.execution === 4 ? { ...s, undo: null, event: true, seasonalApproved: false, stage: 5, history: record(s, 'Sale announced: 20% sale cohort held for reassessment; non-sale evidence retained.') } : s;
    case 'seasonalTest': return s.event && s.approved && s.status === 'running' && !s.failure && !s.seasonalApproved ? { ...s, undo: null, seasonalTest: 'running', history: record(s, 'Selective sale-cohort test started inside approved envelope; non-sale strategy retained.') } : s;
    case 'seasonalComplete': return s.seasonalTest === 'running' && s.approved && s.status === 'running' && !s.failure ? { ...s, undo: null, seasonalTest: 'complete', learnings: mergeLearnings(s.learnings, [{ id: 'sale-timing', title: '24-hour retry during the sale', population: 'Sale cohort only; 20% of eligible traffic', conditions: 'Diwali sale; priority, consent and offers unchanged', date: '12 Oct 2026', lift: 2000, customersPerArm: 400, verdict: 'supported', finding: '24-hour retry beats 72-hour retry within sale customers. Do not generalize to normal trading.' }]), history: record(s, 'Sale-cohort fixture validated: 24-hour retry beats 72-hour retry by ₹2,000/month; no new offers.') } : s;
    case 'seasonalApprove': return s.seasonalTest === 'complete' && s.approved && s.status === 'running' && !s.failure && !approvalBlock(s) ? { ...s, undo: null, seasonalApproved: true, history: record(s, 'Merchant approved 24-hour retry for sale cohort only.') } : s;
    case 'preferences': return a.value.trim() ? { ...s, preferences: a.value.trim(), history: record(s, 'Merchant preference saved separately; experimental evidence unchanged.') } : s;
    case 'reset': return { ...initialCase };
  }
}
