import { useRef } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import type { Framework } from '../state';
import { validFramework } from '../state';
import { Badge, Button, Card, Details, Heading, Toggle, type ScreenProps } from '../shared';
export function FrameworkScreen({ state, dispatch }: ScreenProps) {
  const firstField = useRef<HTMLInputElement>(null);
  const f = state.framework;
  function change<K extends keyof Framework>(key: K, value: Framework[K]) { dispatch({ type: 'framework', framework: { ...f, [key]: value } }); }
  return <><Heading eyebrow="03 / YOUR RULES" title="Set the rules. Stay in control.">Choose who can be contacted and how much to spend.</Heading>
    <div className="ro-grid ro-framework-grid"><Card><h3>Recovery agents</h3><div className="ro-setting-group"><Toggle label="Cart Recovery" checked={f.cart} onChange={v => change('cart', v)} /><Toggle label="Subscription Recovery" checked={f.subscription} onChange={v => change('subscription', v)} /></div><h3>Customers already eligible for outreach</h3><div className="ro-setting-group"><Toggle label="Subscribers" checked={f.subscribers} onChange={v => change('subscribers', v)} /><Toggle label="Non-subscribers" checked={f.nonSubscribers} onChange={v => change('nonSubscribers', v)} /></div><hr className="ro-divider" /><div className="ro-form">
      <label className="ro-field">Monthly spending cap (Rs)<input ref={firstField} type="number" min="1" value={f.spend || ''} onChange={e => change('spend', Number(e.target.value))} /></label><label className="ro-field">Test with {f.exposure}% of traffic<input className="ro-range" type="range" min="1" max="100" value={f.exposure} onChange={e => change('exposure', Number(e.target.value))} /></label>
      <label className="ro-field">Stop at complaints (%)<input type="number" min="0.1" max="100" step="0.1" value={f.complaintLimit || ''} onChange={e => change('complaintLimit', Number(e.target.value))} /></label><label className="ro-field">Stop at opt-outs (%)<input type="number" min="0.1" max="100" step="0.1" value={f.optOutLimit || ''} onChange={e => change('optOutLimit', Number(e.target.value))} /></label>
    </div></Card><Card className="ro-policy-panel"><div className="ro-card-title"><ShieldCheck /><h3>Your protections</h3></div><Badge tone="green">You stay in control</Badge><ul className="ro-simple-list"><li>Only existing consent and offers.</li><li>No new contacts, prices or discounts.</li><li>Stop at your limits.</li><li>Switch back if recovery gets worse.</li></ul><p>We can sequence, delay or suppress existing calls. Nothing more.</p><Details title="How the test stays fair"><p>Exposed traffic is randomly split 50:50 between independent and coordinated agents. The independent arm stays as the required holdout.</p><p>You can pause or revoke coordination at any time. Approval runs a local demo only.</p></Details></Card></div>
    {!validFramework(f) && <div role="alert" className="ro-callout ro-danger">Choose an agent and customer group. Spend must be positive; stop limits must be between 0 and 100%.</div>}
    <div className="ro-actions"><span>The next screen tests your approved setup.</span><div><Button secondary onClick={() => firstField.current?.focus()}>Edit</Button><Button disabled={!validFramework(f)} onClick={() => dispatch({ type: 'approveFramework' })}>Approve rules & test <ArrowRight /></Button></div></div>
  </>;
}
