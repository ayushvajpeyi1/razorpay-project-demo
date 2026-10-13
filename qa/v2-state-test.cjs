const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const { initialCase, caseReducer, forecast, resultReady, approvalBlock } = require('../features/orchestrator-v2/model.ts');
const fresh = () => structuredClone(initialCase);
const act = (s, type, extra = {}) => caseReducer(s, { type, ...extra });
const tested = (s = fresh()) => act(act(act(s, 'authorize'), 'advanceTest'), 'advanceTest');
const approved = () => act(tested(), 'approve');
const observed = () => Array.from({length: 4}).reduce(s => act(s, 'execute'), approved());
// Browsing and arbitrary action ordering cannot create permission or evidence.
let s = act(fresh(), 'stage', {value: 4});
for (const type of ['approve', 'execute', 'advanceTest', 'seasonalComplete', 'seasonalApprove']) s = act(s, type);
assert.equal(s.approved, false); assert.equal(s.execution, 0); assert.equal(s.experiment, 'idle');
s = act(fresh(), 'authorize'); assert.equal(resultReady(s), false);
assert.equal(act(s, 'approve').approved, false);
s = tested(); assert.equal(resultReady(s), true); assert.equal(forecast(s), 19000);
// Intent never manufactures lift, and preferences never alter evidence.
for (const goal of [1000, 50000, 75000, 1000000]) {
 const changed = act(s, 'settings', {value: {...s.settings, goal}});
 assert.equal(forecast(changed), 19000); assert.equal(changed.experiment, 'complete'); assert.equal(changed.envelope, true);
}
const pref = act(s, 'preferences', {value: 'Prefer carts'});
assert.equal(pref.preferences, 'Prefer carts'); assert.equal(forecast(pref), 19000); assert.equal(pref.approved, false);
for (const scenario of ['low-traffic', 'losing']) {
 const variant = tested(act(fresh(), 'scenario', {value: scenario}));
 assert.ok(approvalBlock(variant)); assert.equal(act(variant, 'approve').approved, false);
 if (scenario === 'low-traffic') {
  const extended = act(variant, 'extendTest'); assert.equal(resultReady(extended), false);
  assert.equal(act(act(extended, 'advanceTest'), 'advanceTest').scenario, 'low-traffic');
 }
}
assert.match(approvalBlock(tested({...fresh(), settings: {...initialCase.settings, complaintLimit: 0.1}})), /complaint/);
assert.equal(act({...fresh(), settings: {...initialCase.settings, budget: 38000}}, 'authorize').envelope, false);
s = approved(); assert.equal(s.status, 'running');
const paused = act(s, 'pause'); assert.equal(act(paused, 'execute').execution, 0);
assert.equal(act(paused, 'resume').status, 'running');
const revoked = act(s, 'revoke'); assert.equal(revoked.envelope, false); assert.equal(revoked.experiment, 'complete'); assert.equal(act(revoked, 'execute').execution, 0);
const drop = act(s, 'drop'); assert.equal(drop.status, 'reverted'); assert.equal(drop.approved, false); assert.equal(act(drop, 'resume').status, 'reverted');
const failed = act(s, 'failure'); assert.equal(failed.failure, true); assert.equal(failed.status, 'running'); assert.equal(act(failed, 'execute').execution, 1);
const limits = act(s, 'settings', {value: {...s.settings, budget: 39000}}); assert.equal(limits.envelope, false); assert.equal(limits.status, 'paused'); assert.equal(act(limits, 'approve').approved, false);
assert.equal(act(s, 'event').event, false);
s = observed(); assert.equal(s.execution, 4); assert.equal(act(s, 'execute').history.length, s.history.length);
s = act(s, 'event'); assert.equal(s.event, true); assert.equal(s.approved, true); assert.equal(s.status, 'running'); assert.equal(s.seasonalApproved, false);
s = act(s, 'seasonalTest'); assert.equal(s.seasonalTest, 'running'); assert.equal(act(s, 'seasonalApprove').seasonalApproved, false);
assert.equal(act(act(s, 'pause'), 'seasonalComplete').seasonalTest, 'running');
assert.equal(act(act(s, 'revoke'), 'seasonalComplete').seasonalTest, 'idle');
s = act(s, 'seasonalComplete'); assert.equal(s.seasonalTest, 'complete');
s = act(s, 'seasonalApprove'); assert.equal(s.seasonalApproved, true); assert.equal(forecast(s), 19000);
const changedScenario = act(s, 'scenario', {value: 'losing'}); assert.equal(changedScenario.approved, false); assert.equal(changedScenario.execution, 0); assert.equal(changedScenario.event, false);
assert.deepEqual(act(s, 'reset'), fresh());
// Rejection is reversible without revoking authorization or retesting.
s = tested();
const rejected = act(s, 'reject');
assert.equal(rejected.envelope, true); assert.equal(rejected.experiment, 'complete'); assert.equal(rejected.status, 'off');
assert.equal(approvalBlock(rejected), ''); assert.equal(rejected.undo.kind, 'reject');
assert.deepEqual(act(rejected, 'reject'), rejected); // repeated clicks don't overwrite the undo point
const rejectionUndone = act(rejected, 'undoDecision');
assert.equal(rejectionUndone.envelope, s.envelope); assert.equal(rejectionUndone.approved, s.approved); assert.equal(rejectionUndone.status, s.status);
assert.equal(rejectionUndone.undo, null); assert.equal(act(rejected, 'approve').status, 'running');
// Undo restores permission/status, never replays or erases completed execution.
s = act(approved(), 'execute');
for (const type of ['reject', 'pause', 'revoke']) {
 const stopped = act(s, type);
 assert.equal(act(stopped, 'execute').execution, 1);
 const undone = act(stopped, 'undoDecision');
 assert.equal(undone.status, 'running'); assert.equal(undone.approved, true); assert.equal(undone.envelope, true);
 assert.equal(undone.execution, 1); assert.equal(act(undone, 'execute').execution, 2);
 assert.equal(undone.experiment, 'complete'); assert.deepEqual(undone.learnings, s.learnings);
 assert.ok(undone.history.includes(s.history.at(-1)));
}
const pausedThenRevoked = act(act(s, 'pause'), 'revoke');
assert.equal(act(pausedThenRevoked, 'undoDecision').status, 'paused');
const newPreference = act(act(s, 'revoke'), 'preferences', {value:'Prefer cart recovery'});
assert.equal(act(newPreference, 'undoDecision').preferences, 'Prefer cart recovery');
const staleUndo = act(act(s, 'revoke'), 'settings', {value: {...s.settings, budget: 38000}});
assert.equal(staleUndo.undo, null); assert.equal(act(staleUndo, 'undoDecision').envelope, false);
assert.equal(act(staleUndo, 'reauthorize').envelope, false);
const revokedAgain = act(s, 'revoke');
const restoredAuthorization = act(revokedAgain, 'reauthorize');
assert.equal(restoredAuthorization.envelope, true); assert.equal(restoredAuthorization.approved, false);
assert.equal(restoredAuthorization.execution, 1); assert.equal(restoredAuthorization.experiment, 'complete');
assert.equal(act(restoredAuthorization, 'approve').status, 'running');
const autoReverted = act(s, 'drop'); assert.equal(autoReverted.undo, null);
assert.equal(act(autoReverted, 'undoDecision').status, 'reverted');
const interruptedTest = act(act(fresh(), 'authorize'), 'revoke');
assert.equal(act(interruptedTest, 'undoDecision').experiment, 'running');
// Registry includes supported and rejected validated findings, not incomplete tests/preferences.
assert.equal(fresh().learnings.length, 1);
assert.equal(tested().learnings.length, 4);
assert.equal(tested().learnings.find(row => row.id === 'blanket').verdict, 'rejected');
assert.equal(tested(act(fresh(), 'scenario', {value:'low-traffic'})).learnings.length, 1);
assert.equal(act(tested(), 'preferences', {value:'New preference'}).learnings.length, 4);
assert.equal(observed().learnings.find(row => row.id === 'combined-standard').observed, 17800);
const saleLearned = act(act(act(observed(), 'event'), 'seasonalTest'), 'seasonalComplete');
assert.equal(saleLearned.learnings.length, 5); assert.equal(saleLearned.learnings.find(row => row.id === 'sale-timing').customersPerArm, 400);
const laterCase = act(saleLearned, 'scenario', {value:'losing'});
assert.equal(laterCase.learnings.length, 5); assert.equal(laterCase.undo, null);
const laterTested = tested(laterCase);
assert.equal(laterTested.learnings.find(row => row.id === 'combined-losing').verdict, 'rejected');
assert.equal(laterTested.learnings.find(row => row.id === 'combined-standard').observed, 17800);
console.log('PASS: V2 evidence independence, permissions, rejection/pause/revoke undo, stale-undo prevention, recovery without retesting, execution preservation, rollback, scoped retests and accumulated validated learning history.');
