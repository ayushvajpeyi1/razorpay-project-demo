import { ArrowLeft, ArrowRight } from 'lucide-react';
import { rupees, steps, scenarioFor } from './data';
import type { Action, State } from './state';
export type ScreenProps = { state: State; dispatch: React.Dispatch<Action> };
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`ro-card ${className}`}>{children}</section>; }
export function Badge({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' | 'amber' | 'neutral' | 'red' }) { return <span className={`ro-badge ro-${tone}`}>{children}</span>; }
export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="ro-toggle"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /><span className="ro-switch" aria-hidden="true" /><span>{label}</span></label>; }
export function Button({ children, onClick, secondary = false, disabled = false, type = 'button' }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean; disabled?: boolean; type?: 'button' | 'submit' }) { return <button type={type} className={`ro-button ${secondary ? 'ro-secondary' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>; }
export function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) { return <div className="ro-heading"><div className="ro-eyebrow">{eyebrow}</div><h2>{title}</h2>{children && <p>{children}</p>}</div>; }
export function Stepper({ step, go }: { step: number; go: (step: number) => void }) { return <><nav className="ro-stepper" aria-label="Revenue Orchestrator steps">{steps.map((label, i) => <button key={label} aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}><span>{i + 1}</span>{label}</button>)}</nav><div className="ro-navigation"><span>Step {step + 1} of 7 <span className="ro-muted">· Use ← → to explore</span></span><div><button disabled={step === 0} onClick={() => go(step - 1)}><ArrowLeft /> Back</button><button disabled={step === 6} onClick={() => go(step + 1)}>Next <ArrowRight /></button></div></div></>; }
export function Details({ title, children }: { title: string; children: React.ReactNode }) { return <details className="ro-details"><summary>{title}</summary><div>{children}</div></details>; }
export function NorthStar() { return <Details title="How we measure success"><p><strong>Extra revenue after all costs.</strong></p><p>Incremental net recovered revenue = (Revenue with coordination − Cost with coordination) − (Revenue with independent agents − Cost with independent agents).</p><small>Costs include agent execution, communication and existing discounts; coordination also includes orchestration. No new discounts are created.</small></Details>; }
export function BarChart({ lowTraffic, result }: { lowTraffic: boolean; result: ReturnType<typeof scenarioFor> }) {
  const nets = [result.independent.net, result.coordinated.net];
  const bands = nets.map(net => [Math.max(0, net - (lowTraffic ? 80000 : 12000 * result.coverage)), Math.min(300000, net + (lowTraffic ? 80000 : 12000 * result.coverage))]);
  const x = (value: number) => 165 + Math.max(0, value) / 300000 * 425;
  return <div className="ro-chart"><svg viewBox="0 0 640 195" role="img" aria-label={lowTraffic ? 'Not enough data: no point estimate' : `Monthly net recovery: independent ${rupees(nets[0])}, coordinated ${rupees(nets[1])}. Illustrative demo.`}>
    {[0, 100000, 200000, 300000].map(v => <g key={v}><line x1={x(v)} x2={x(v)} y1="12" y2="142" stroke="#e8edf2" /><text x={x(v)} y="170" textAnchor="middle">{rupees(v)}</text></g>)}
    {['Agents separately', 'Agents coordinated'].map((label, i) => { const y = 45 + i * 65; const net = nets[i]; return <g key={label}><text x="0" y={y + 5}>{label}</text>{!lowTraffic && <rect key={net} className="ro-chart-bar" x={x(0)} y={y - 16} width={Math.max(0, x(net) - x(0))} height="32" rx="5" fill={i === 0 ? '#bcc9d9' : result.winner ? '#0863f7' : '#dd514a'} />}{lowTraffic && <rect x={x(bands[i][0])} y={y - 16} width={x(bands[i][1]) - x(bands[i][0])} height="32" rx="5" fill="#e5edf7" />}<line x1={x(bands[i][0])} x2={x(bands[i][1])} y1={y} y2={y} stroke="#263e5a" strokeWidth="2" />{bands[i].map((v, j) => <line key={j} x1={x(v)} x2={x(v)} y1={y - 8} y2={y + 8} stroke="#263e5a" strokeWidth="2" />)}{!lowTraffic && <text x={x(net) + 8} y={y - 23} fontWeight="bold">{rupees(net)}</text>}</g>; })}
  </svg><small>Money recovered after costs · Illustrative comparison</small></div>;
}
export function DemoExamples({ state, dispatch }: ScreenProps) { return <div className="ro-demo-examples" aria-label="Winning demo examples"><span>Demo example</span><button aria-pressed={state.scenario === 'goal-beating'} onClick={() => { if (state.scenario !== 'goal-beating') dispatch({ type: 'scenario', value: 'goal-beating' }); }}>Beat my goal by 20%</button><button aria-pressed={state.scenario === '19k-example'} onClick={() => { if (state.scenario !== '19k-example') dispatch({ type: 'scenario', value: '19k-example' }); }}>Rs 19k · lower goal</button></div>; }
export function OptionsChart({ extra, low, high, simpleExtra }: { extra: number; low: number; high: number; simpleExtra: number }) {
  const max = Math.max(Math.abs(extra), Math.abs(simpleExtra), 1000);
  const items = [
    { label: 'Run agents separately', value: 0, range: 'Rs 0 to Rs 0 · baseline', tone: 'baseline' },
    { label: 'Simple rule: no second call for 7 days', value: simpleExtra, range: '−Rs 5k to +Rs 1k · No real gain', tone: 'simple' },
    { label: 'AI coordination', value: extra, range: `${rupees(low)} to ${rupees(high)}`, tone: extra > 0 ? 'ai' : 'simple' },
  ];
  return <div className="ro-options-chart" role="img" aria-label={`Extra money vs agents separately: baseline Rs 0; simple rule ${rupees(simpleExtra)}; AI coordination ${rupees(extra)}`}>
    {items.map(item => { const width = item.value === 0 ? 0.5 : Math.max(0.8, Math.abs(item.value) / max * (item.value < 0 ? 21 : 73)); return <div className="ro-option-row" key={item.label}><strong>{item.label}</strong><div className="ro-option-track"><span className={`ro-option-bar ro-option-${item.tone}`} data-option-bar={item.tone} style={{ width: `${width}%`, left: `${item.value < 0 ? 23 - width : 23}%` }} /><span className="ro-option-zero" /></div><div className="ro-option-value"><strong>{item.value > 0 ? '+' : ''}{rupees(item.value)}</strong><small>{item.range}</small></div></div>; })}
  </div>;
}
