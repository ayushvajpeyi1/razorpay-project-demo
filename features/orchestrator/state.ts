import { merchant, monitoring, scenarioFor, planActions, planAmounts, type DemoScenario, type PlanId, type ApprovedAction } from './data';
export type Goal = { amount: number; days: number; spend: number; risk: number };
export type Framework = { cart: boolean; subscription: boolean; subscribers: boolean; nonSubscribers: boolean; exposure: number; spend: number; complaintLimit: number; optOutLimit: number; stopBelowControl: boolean };
export type Status = 'idle' | 'running' | 'paused' | 'revoked' | 'reverted';
export type State = {
  step: number; goal: Goal; framework: Framework; diagnosed: boolean; frameworkApproved: boolean;
  roadmapApproved: boolean; stale: boolean; lowTraffic: boolean; underperformance: boolean;
  experimentRunning: boolean; scenario: DemoScenario; targetGoal: number; selectedActions: PlanId[]; approvedActions: ApprovedAction[]; approvedExtra: number; eventIndex: number | null; eventSeen: boolean;
  status: Status; rejected: boolean; policy: string; policyDraft: string; policySaved: boolean; audit: string[]; notice: string;
};
export const initialState: State = {
  step: 0, goal: { amount: merchant.goal, days: merchant.days, spend: merchant.spend, risk: merchant.optOutLimit },
  framework: { cart: true, subscription: true, subscribers: true, nonSubscribers: true, exposure: 20, spend: merchant.spend, complaintLimit: 1, optOutLimit: merchant.optOutLimit, stopBelowControl: true },
  diagnosed: false, frameworkApproved: false, roadmapApproved: false, stale: false, lowTraffic: false, underperformance: false,
  scenario: 'goal-beating', targetGoal: merchant.goal, selectedActions: planActions.map(row => row.id), approvedActions: [], approvedExtra: 0, eventIndex: null, eventSeen: false, experimentRunning: false, status: 'idle', rejected: false, policy: 'Use existing consent and offers only. Prioritize subscriber renewals. Wait 72 hours before a redundant call.', policyDraft: 'Use existing consent and offers only. Prioritize subscriber renewals. Wait 72 hours before a redundant call.', policySaved: false, audit: [], notice: '',
};
export function validGoal(g: Goal) { return Object.values(g).every(Number.isFinite) && g.amount > 0 && g.days >= 1 && g.spend > 0 && g.risk > 0 && g.risk <= 100; }
export function validFramework(f: Framework) { return (f.cart || f.subscription) && (f.subscribers || f.nonSubscribers) && f.spend > 0 && Number.isFinite(f.spend) && f.exposure >= 1 && f.exposure <= 100 && f.complaintLimit > 0 && f.complaintLimit <= 100 && f.optOutLimit > 0 && f.optOutLimit <= 100; }
export function currentResult(s: State) { return scenarioFor(s.framework, s.underperformance, s.goal.amount, s.scenario); }
export function selectedPlan(s: State) {
  const result = currentResult(s), amounts = planAmounts(result.increment);
  const rows = planActions.map((row, i) => ({ ...row, extra: amounts[i], rollout: row.confidence < 75 ? Math.min(10, s.framework.exposure) : s.framework.exposure })).filter(row => s.selectedActions.includes(row.id));
  const extra = rows.reduce((sum, row) => sum + row.extra, 0);
  const ratio = result.increment ? extra / result.increment : 0;
  return { rows, extra, confidence: rows.length === planActions.length ? 92 : rows.length ? Math.min(...rows.map(row => row.confidence)) : 0, low: Math.round(result.low * ratio), high: Math.round(result.high * ratio) };
}
export function rolloutBlock(s: State): string {
  if (!validGoal(s.goal)) return 'Enter a valid positive recovery goal, timeline, spend cap and risk limit before rollout.';
  if (s.experimentRunning) return 'Demo experiment is running. Wait for the simulated result.';
  if (!s.frameworkApproved) return 'Approve your rules in step 3 first.';
  if (s.stale) return 'Your rules changed. Run the demo test again before approving this plan.';
  if (s.lowTraffic) return 'Not enough data yet. Keep testing before turning coordination on.';
  if (!currentResult(s).both) return 'Choose subscribers and both agents to test overlapping calls.';
  if (s.framework.spend < currentResult(s).coordinated.cost) return 'The spend cap is below the simulated coordinated cost. Increase it in the framework.';
  if (s.framework.optOutLimit < monitoring.optOuts || s.framework.complaintLimit < monitoring.complaints) return 'The illustrative guardrail values exceed your limits. Revise the framework or retest.';
  if (!s.selectedActions.length) return 'Select at least one action before approving your plan.';
  if (selectedPlan(s).extra <= 0) return 'This selected plan does not recover extra money. Keep agents independent.';
  if (s.underperformance) return 'This test loses money against agents working separately. Keep the agents independent.';
  return '';
}
export type Action =
  | { type: 'step'; step: number } | { type: 'goal'; goal: Goal } | { type: 'diagnosed' }
  | { type: 'editGoal' } | { type: 'framework'; framework: Framework } | { type: 'approveFramework' } | { type: 'approveRoadmap' }
  | { type: 'lowTraffic'; value: boolean } | { type: 'underperformance'; value: boolean }
  | { type: 'runExperiment' } | { type: 'experimentComplete' } | { type: 'resetDemo' }
  | { type: 'pause' } | { type: 'revoke' } | { type: 'reject' } | { type: 'retest' }
  | { type: 'scenario'; value: DemoScenario } | { type: 'selectAction'; id: PlanId; checked: boolean }
  | { type: 'showEvent'; index: number } | { type: 'dismissEvent' } | { type: 'reviewEvent' }
  | { type: 'policyDraft'; value: string } | { type: 'savePolicy' };
const log = (s: State, entry: string) => [`${String(s.audit.length + 1).padStart(2, '0')} · ${entry}`, ...s.audit];
export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'step': return { ...s, step: Math.max(0, Math.min(6, a.step)), notice: '' };
    case 'goal': {
      const setupChanged = a.goal.spend !== s.goal.spend || a.goal.risk !== s.goal.risk;
      const resultChanged = s.scenario === 'goal-beating' && a.goal.amount !== s.goal.amount;
      return { ...s, goal: a.goal, targetGoal: s.scenario === 'goal-beating' ? a.goal.amount : s.targetGoal, diagnosed: false, framework: { ...s.framework, spend: setupChanged ? a.goal.spend : s.framework.spend, optOutLimit: setupChanged ? a.goal.risk : s.framework.optOutLimit }, roadmapApproved: false, frameworkApproved: setupChanged ? false : s.frameworkApproved, stale: s.stale || setupChanged || resultChanged, experimentRunning: setupChanged || resultChanged ? false : s.experimentRunning, status: s.status === 'running' ? 'paused' : s.status };
    }
    case 'editGoal': return { ...s, diagnosed: false };
    case 'diagnosed': return validGoal(s.goal) ? { ...s, diagnosed: true } : s;
    case 'framework': return { ...s, experimentRunning: false, framework: a.framework, frameworkApproved: false, roadmapApproved: false, stale: true, status: s.status === 'running' ? 'paused' : s.status, notice: 'Framework edited. Approve it, then run the updated demo experiment.' };
    case 'approveFramework': return validFramework(s.framework) ? { ...s, experimentRunning: true, frameworkApproved: true, roadmapApproved: false, rejected: false, status: s.status === 'running' ? 'paused' : s.status, step: 3, audit: log(s, 'Merchant approved illustrative experiment framework. Randomized holdout retained.') } : s;
    case 'approveRoadmap': return rolloutBlock(s) ? s : { ...s, roadmapApproved: true, approvedActions: selectedPlan(s).rows.map(row => ({ id: row.id, description: row.description, customers: row.customers, extra: row.extra, confidence: row.confidence, rollout: row.rollout })), approvedExtra: selectedPlan(s).extra, rejected: false, status: 'running', step: 5, notice: 'Roadmap approved. Simulated monitoring started.', audit: log(s, 'Merchant approved roadmap. Simulated coordination started.') };
    case 'lowTraffic': return { ...s, lowTraffic: a.value, roadmapApproved: a.value ? false : s.roadmapApproved, status: a.value && s.status === 'running' ? 'paused' : s.status, audit: a.value ? log(s, 'Low-traffic demo: inconclusive, test extended by 10 days; rollout blocked.') : s.audit };
    case 'underperformance': return { ...s, underperformance: a.value, status: a.value && s.status === 'running' ? 'reverted' : s.status, roadmapApproved: a.value ? false : s.roadmapApproved, notice: a.value ? 'Underperformance demo: coordinated net is below independent agents. Review the losing comparison in steps 4–5.' : 'Winning demo restored. Coordination beats control; approval is still required to execute.', audit: a.value ? log(s, s.status === 'running' ? 'Auto-reverted to independent agents. Merchant alert simulated; no message sent.' : 'Underperformance scenario selected. Losing simulated result; no execution started.') : s.audit };
    case 'runExperiment': return s.frameworkApproved && validFramework(s.framework) ? { ...s, step: 3, experimentRunning: true, roadmapApproved: false, status: s.status === 'running' ? 'paused' : s.status, notice: 'Running a local simulated experiment for the approved setup…' } : s;
    case 'experimentComplete': return s.experimentRunning && s.frameworkApproved ? { ...s, experimentRunning: false, stale: false, notice: s.lowTraffic ? 'Demo test finished: inconclusive. Turn off low traffic to inspect the winning example.' : s.underperformance ? 'Demo test finished: independent agents win. Keep coordination off.' : 'Demo test finished: coordination wins on incremental net revenue.', audit: log(s, 'Local demo experiment completed for approved settings. Synthetic scenario, not merchant evidence.') } : s;
    case 'resetDemo': return { ...initialState, step: 2, policy: s.policy, policyDraft: s.policy, audit: log(s, 'Default winning demo restored. Permissions cleared; framework approval required.'), notice: 'Goal-beating defaults restored. Approve your rules and review the demo plan.' };
    case 'pause': return s.status === 'running' ? { ...s, status: 'paused', audit: log(s, 'Merchant paused simulated coordination.') } : s;
    case 'revoke': return { ...s, experimentRunning: false, frameworkApproved: false, roadmapApproved: false, status: 'revoked', audit: log(s, 'Merchant revoked simulated coordination permissions.') };
    case 'reject': return { ...s, roadmapApproved: false, rejected: true, status: 'idle', notice: 'Roadmap rejected. Independent agents retained.', audit: log(s, 'Merchant rejected roadmap. Independent agents retained.') };
    case 'retest': return { ...s, experimentRunning: false, step: 2, stale: true, frameworkApproved: false, roadmapApproved: false, status: s.status === 'running' ? 'paused' : s.status, notice: 'Selective retest proposed. Review cohorts and approve a fresh framework; run a new local demo experiment after approving the framework.', audit: log(s, 'Merchant requested selective seasonal retest; existing evidence retained separately.') };
    case 'scenario': return { ...s, framework: { ...s.framework, cart: true, subscription: true, subscribers: true, nonSubscribers: true }, frameworkApproved: s.frameworkApproved && s.framework.cart && s.framework.subscription && s.framework.subscribers && s.framework.nonSubscribers, scenario: a.value, goal: { ...s.goal, amount: a.value === '19k-example' ? 15000 : s.targetGoal }, selectedActions: planActions.map(row => row.id), approvedActions: [], approvedExtra: 0, roadmapApproved: false, stale: true, experimentRunning: false, status: s.status === 'running' ? 'paused' : s.status, notice: 'Demo example changed. Run the test again before approving.' };
    case 'selectAction': return { ...s, selectedActions: a.checked ? [...new Set([...s.selectedActions, a.id])] : s.selectedActions.filter(id => id !== a.id), roadmapApproved: false, status: s.status === 'running' ? 'paused' : s.status };
    case 'showEvent': return { ...s, eventIndex: a.index, eventSeen: true };
    case 'dismissEvent': return { ...s, eventIndex: null };
    case 'reviewEvent': return { ...s, eventIndex: null, step: 2, stale: true, frameworkApproved: false, roadmapApproved: false, experimentRunning: false, status: s.status === 'running' ? 'paused' : s.status, notice: 'Review your customers and rules for the new event, then retest.', audit: log(s, 'Merchant chose to review coordination after a simulated external event.') };
    case 'policyDraft': return { ...s, policyDraft: a.value, policySaved: false };
    case 'savePolicy': return s.policyDraft.trim() ? { ...s, policy: s.policyDraft.trim(), policySaved: true, audit: log(s, 'Merchant preferences saved for this visit; experimental evidence unchanged.') } : s;
  }
}
