import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ScanSearch } from 'lucide-react';
import { merchant, rupees } from '../data';
import { validGoal } from '../state';
import { Badge, Button, Card, Heading, type ScreenProps } from '../shared';
export function GoalScreen({ state, dispatch }: ScreenProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const update = (key: keyof typeof state.goal, value: number) => { if (timer.current) clearTimeout(timer.current); setAnalyzing(false); dispatch({ type: 'goal', goal: { ...state.goal, [key]: value } }); };
  const analyze = (event: React.FormEvent) => { event.preventDefault(); if (!validGoal(state.goal)) return; setAnalyzing(true); timer.current = setTimeout(() => { dispatch({ type: 'diagnosed' }); setAnalyzing(false); }, 1200); };
  return <><Heading eyebrow="02 / YOUR GOAL" title="How much more do you want to recover?">Choose a target and a spending limit.</Heading>
    {!state.diagnosed && <Card><form className="ro-form" onSubmit={analyze}>
      <label className="ro-field">Extra recovery each month (Rs)<input type="number" min="1" required value={state.goal.amount || ''} onChange={e => update('amount', Number(e.target.value))} /></label>
      <label className="ro-field">Reach it within (days)<input type="number" min="1" step="1" required value={state.goal.days || ''} onChange={e => update('days', Number(e.target.value))} /></label>
      <label className="ro-field">Maximum monthly spend (Rs)<input type="number" min="1" required value={state.goal.spend || ''} onChange={e => update('spend', Number(e.target.value))} /></label>
      <label className="ro-field">Stop if opt-outs exceed (%)<input type="number" min="0.1" max="100" step="0.1" required value={state.goal.risk || ''} onChange={e => update('risk', Number(e.target.value))} /></label>
      <div className="ro-form-footer ro-actions"><span>Only customers who already agreed to outreach.</span><Button type="submit" disabled={analyzing || !validGoal(state.goal)}>{analyzing ? 'Checking…' : 'Find my recovery opportunity'} <ScanSearch /></Button></div>
    </form></Card>}
    {analyzing && <div className="ro-test-loading" role="status"><span className="ro-spinner" />Checking payment history and agent calls…</div>}
    {state.diagnosed && <><Card><div className="ro-goal-summary"><div><strong>+{rupees(state.goal.amount)} / month</strong><p>{state.goal.days} days · {rupees(state.goal.spend)} spending cap</p></div><Button secondary onClick={() => dispatch({ type: 'editGoal' })}>Edit goal</Button></div></Card><Card className="ro-diagnosis"><div className="ro-card-title"><h3>There’s an overlap worth testing.</h3><Badge tone="amber">Demo finding</Badge></div><div className="ro-stats"><div><span className="ro-stat-label">Eligible recovery</span><strong>{rupees(merchant.eligible)}</strong></div><div><span className="ro-stat-label">Customers in both workflows</span><strong>10%</strong></div><div><span className="ro-stat-label">Revenue exposed</span><strong>{rupees(merchant.exposure)}</strong></div></div><p style={{ marginTop: 16 }}>Avoid the duplicate call. Test whether that recovers more money.</p><div className="ro-actions"><span>A test opportunity, not guaranteed revenue.</span><Button onClick={() => dispatch({ type: 'step', step: 2 })}>Choose my rules <ArrowRight /></Button></div></Card></>}
  </>;
}
