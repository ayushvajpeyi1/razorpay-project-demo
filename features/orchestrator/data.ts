// Entirely fictional demonstration fixtures. No Razorpay account data is used.
export const steps = ['Overview', 'Your goal', 'Your rules', 'Test', 'Your plan', 'Monitor', 'Learn'];
export const merchant = { volume: 20000000, eligible: 1000000, overlap: 10, exposure: 100000, goal: 50000, days: 90, spend: 45000, optOutLimit: 3 };
export const evidence = {
  cartRevenue: 140000, subscriptionRevenue: 110000,
  independent: { revenue: 240000, cost: 40000, net: 200000 },
  coordinated: { revenue: 258000, agentCost: 36000, orchestrationCost: 3000, cost: 39000, net: 219000 },
  increment: 19000, low: 12000, high: 26000, firstRecovery: 22, secondRecovery: 9,
  // Graph whiskers are display fixtures, not calculated confidence intervals.
  displayBands: [[188000, 212000], [207000, 231000]],
  lowTrafficBands: [[110000, 275000], [105000, 285000]],
};
export const monitoring = { contactsAvoided: 126, recoveryPerCustomer: 219, complaints: 0.3, optOuts: 1.2, overrides: 2 };
export const learningDate = '12 Oct 2026';
export const learningExpiry = '11 Nov 2026';
export const strategies = [
  { label: 'Sequence', title: 'Subscription Recovery first', detail: 'For subscribers, lead with the agent that fits the renewal context.' },
  { label: 'Suppress', title: 'Wait 72 hours before a second call', detail: 'Suppress redundant outreach. Allow the other eligible workflow only if the first fails after 72 hours.' },
  { label: 'Keep', title: 'Cart Recovery for non-subscribers', detail: 'Keep the existing cart workflow when subscription recovery is not relevant.' },
];
export function rupees(value: number) {
  const absolute = Math.abs(value);
  return `Rs ${value < 0 ? '−' : ''}${absolute >= 10000000 ? `${+(absolute / 10000000).toFixed(2)} Cr` : absolute >= 100000 ? `${+(absolute / 100000).toFixed(2)}L` : absolute >= 1000 ? `${+(absolute / 1000).toFixed(2)}k` : absolute.toLocaleString('en-IN')}`;
}

// Interactive demo assumptions, not fitted merchant evidence.
export const demoModel = { subscriberShare: 0.5, nonSubscriberShare: 0.5, singleAgentCost: 20000, losingRevenue: 227000, lowGrossGain: 15000, highGrossGain: 29000, testDurationMs: 1500, eligibleCustomers: 1000 };
export function scenarioFor(setup: { cart: boolean; subscription: boolean; subscribers: boolean; nonSubscribers: boolean }, underperformance: boolean, goal = 50000, scenario: DemoScenario = '19k-example') {
  const coverage = (setup.subscribers ? demoModel.subscriberShare : 0) + (setup.nonSubscribers ? demoModel.nonSubscriberShare : 0);
  const both = setup.cart && setup.subscription && setup.subscribers;
  const revenue = (both ? evidence.independent.revenue : (setup.cart ? evidence.cartRevenue : 0) + (setup.subscription && setup.subscribers ? evidence.subscriptionRevenue : 0)) * coverage;
  const independentCost = (both ? evidence.independent.cost : demoModel.singleAgentCost * (Number(setup.cart) + Number(setup.subscription && setup.subscribers))) * coverage;
  const independent = { revenue, cost: independentCost, net: revenue - independentCost };
  const coordinatedRevenue = both ? (underperformance ? demoModel.losingRevenue : evidence.coordinated.revenue) * coverage : revenue;
  const agentCost = both ? evidence.coordinated.agentCost * coverage : independentCost;
  const orchestrationCost = evidence.coordinated.orchestrationCost;
  const coordinated = { revenue: coordinatedRevenue, agentCost, orchestrationCost, cost: agentCost + orchestrationCost, net: coordinatedRevenue - agentCost - orchestrationCost };
  if (scenario === 'goal-beating' && both && !underperformance && Number.isFinite(goal) && goal > 0) {
    const generatedExtra = Math.ceil(goal * 1.2);
    coordinated.net = independent.net + generatedExtra;
    coordinated.revenue = coordinated.net + coordinated.cost;
  }
  const increment = coordinated.net - independent.net;
  return { coverage, both, independent, coordinated, increment, low: scenario === 'goal-beating' && both && !underperformance ? Math.round(goal * 1.05) : both && !underperformance ? demoModel.lowGrossGain * coverage - orchestrationCost : increment - 7000, high: scenario === 'goal-beating' && both && !underperformance ? Math.round(goal * 1.35) : both && !underperformance ? demoModel.highGrossGain * coverage - orchestrationCost : increment + 7000, winner: both && coverage > 0 && increment > 0 };
}
export function signedRupees(value: number) { return `${value > 0 ? '+' : ''}${rupees(value)}`; }

export type DemoScenario = 'goal-beating' | '19k-example';
export const planActions = [
  { id: 'prioritize', verb: 'PRIORITIZE', description: 'Give Subscription Recovery priority on failed renewals', customers: 1400, baseExtra: 7000, confidence: 88, level: 'High' },
  { id: 'sequence', verb: 'SEQUENCE', description: 'In the overlap group, call the agent likelier to succeed first', customers: 600, baseExtra: 6000, confidence: 85, level: 'High' },
  { id: 'delay', verb: 'DELAY', description: 'Hold the second call 72 hours; release only if the first fails', customers: 450, baseExtra: 4000, confidence: 72, level: 'Medium' },
  { id: 'suppress', verb: 'SUPPRESS', description: 'Skip a second call with low success odds or high complaint risk', customers: 250, baseExtra: 2000, confidence: 70, level: 'Medium' },
] as const;
export type PlanId = typeof planActions[number]['id'];
export type ApprovedAction = { id: PlanId; description: string; customers: number; extra: number; confidence: number; rollout: number };
export function planAmounts(extra: number) {
  const unit = Math.abs(extra) >= 19000 ? 1000 : 100;
  const first = planActions.slice(0, 3).map(row => Math.round(extra * row.baseExtra / 19000 / unit) * unit);
  return [...first, extra - first.reduce((sum, value) => sum + value, 0)];
}
export const simpleRule = { extra: -2000, revenue: 237000, cost: 39000, low: -5000, high: 1000 };
export const customerExamples = [
  { id: 'C-2188', amount: 'Rs 3,200 renewal', simple: ['Cart agent called first and failed', 'Renewal call blocked for 7 days'], simpleResult: 'Rs 3,200 lost', ai: ['Subscription agent called first'], aiResult: 'Recovered' },
  { id: 'C-4410', amount: 'Second chance to recover', simple: ['Second call blocked for 7 days'], simpleResult: 'Likely recovery lost', ai: ['Waits 72 hours', 'Second agent calls if the first fails'], aiResult: 'Recovered after delay' },
];
export const externalEvents = [
  { title: 'Diwali sale announced', detail: 'Your customers may respond differently during the sale.' },
  { title: 'Payday shopping spike', detail: 'Customer buying patterns may change this week.' },
  { title: 'Delivery delays reported', detail: 'Another recovery call may frustrate affected customers.' },
];
