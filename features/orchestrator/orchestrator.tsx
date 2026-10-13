'use client';
import { useEffect, useReducer } from 'react';
import { initialState, reducer, currentResult, selectedPlan } from './state';
import { demoModel, externalEvents, signedRupees } from './data';
import { Badge, Button, Stepper, Toggle } from './shared';
import { Problem } from './screens/problem';
import { GoalScreen } from './screens/goal';
import { FrameworkScreen } from './screens/framework';
import { ExperimentScreen } from './screens/experiment';
import { RoadmapScreen } from './screens/roadmap';
import { ExecuteScreen } from './screens/execute';
import { MemoryScreen } from './screens/memory';
import NextLink from 'next/link';
import './orchestrator.css';
export function Orchestrator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"], [role="slider"]')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); dispatch({ type: 'step', step: state.step + (event.key === 'ArrowRight' ? 1 : -1) }); }
    };
    window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle);
  }, [state.step]);
  useEffect(() => {
    if (!state.experimentRunning) return;
    const timer = setTimeout(() => dispatch({ type: 'experimentComplete' }), demoModel.testDurationMs);
    return () => clearTimeout(timer);
  }, [state.experimentRunning]);
  useEffect(() => {
    if (state.step !== 0 || state.eventSeen) return;
    const timer = setTimeout(() => dispatch({ type: 'showEvent', index: Math.floor(Math.random() * externalEvents.length) }), 8000 + Math.random() * 10000);
    return () => clearTimeout(timer);
  }, [state.step, state.eventSeen]);
  useEffect(() => { if (state.step === 0 || state.step === 3 || state.step === 4) window.scrollTo({ top: 0, behavior: 'auto' }); }, [state.step]);
  const outcome = currentResult(state);
  const shownExtra = state.step === 4 ? selectedPlan(state).extra : outcome.increment;
  return <div className="ro-feature"><div className="ro-title-row"><div><h1>Revenue Orchestrator</h1><p>Recover more without duplicate calls.</p></div><div className="ro-labels"><Badge tone="amber">Illustrative data</Badge><Badge>Proposed layer on Agent Studio</Badge></div></div>
    <Stepper step={state.step} go={step => dispatch({ type: 'step', step })} />
    {state.notice && state.step !== 3 && state.step !== 4 && <div className="ro-notice" role="status">{state.notice}</div>}
    <NextLink className="ro-mobile-back" href="/">← Transactions</NextLink>
    <div key={state.step} className="ro-screen" data-screen={state.step}>
      {state.step === 0 && <Problem state={state} dispatch={dispatch} />}
      {state.step === 1 && <GoalScreen state={state} dispatch={dispatch} />}
      {state.step === 2 && <FrameworkScreen state={state} dispatch={dispatch} />}
      {state.step === 3 && <ExperimentScreen state={state} dispatch={dispatch} />}
      {state.step === 4 && <RoadmapScreen state={state} dispatch={dispatch} />}
      {state.step === 5 && <ExecuteScreen state={state} dispatch={dispatch} />}
      {state.step === 6 && <MemoryScreen state={state} dispatch={dispatch} />}
    </div>
    {state.step === 0 && state.eventIndex !== null && <aside className="ro-event-toast" role="alertdialog" aria-label="Demo external event"><button className="ro-event-dismiss" aria-label="Dismiss event" onClick={() => dispatch({ type: 'dismissEvent' })}>×</button><Badge tone="amber">Demo external event</Badge><h3>{externalEvents[state.eventIndex]?.title}</h3><p>{externalEvents[state.eventIndex]?.detail} Review your coordination plan?</p><div><Button secondary onClick={() => dispatch({ type: 'dismissEvent' })}>Later</Button><Button onClick={() => dispatch({ type: 'reviewEvent' })}>Review coordination</Button></div></aside>}
    <p className="ro-scenario-help">{state.experimentRunning ? 'Demo test running…' : state.lowTraffic ? 'Demo: not enough data. Keep testing.' : state.underperformance ? `Demo: ${signedRupees(shownExtra)} / month. Running coordination switches back.` : `Demo: ${signedRupees(shownExtra)} / month. ${outcome.winner ? 'Coordination wins.' : 'Keep agents independent.'}`}</p>
    <div className="ro-demo-bar" aria-label="Demo scenarios"><strong>Demo only</strong><button className="ro-reset-demo" onClick={() => dispatch({ type: 'resetDemo' })}>Reset winning demo</button><Toggle label="Not enough data" checked={state.lowTraffic} onChange={value => dispatch({ type: 'lowTraffic', value })} /><Toggle label="Recovery drops" checked={state.underperformance} onChange={value => dispatch({ type: 'underperformance', value })} /></div>
  </div>;
}
