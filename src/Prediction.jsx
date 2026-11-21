import {fmt} from './chain.js';
import {signal} from './model.js';

export default function Prediction({band,row,put,onTest}) {
  const {action,reason,pnls}=signal(band,row,put);
  return <section className="card block" id="prediction">
    <div className="eyebrow">Experimental prediction / at expiry</div>
    <h2>Paper signal: {action} · ₹{fmt(row[0])} {put?'put':'call'}</h2>
    <p>Based on the selected contract’s snapshot LTP, not your simulator edits. <a href="#simulator">Change contract ↓</a></p>
    {reason ? <p className="result">{reason}</p> : <>
      <div className="result"><strong>Model target: ₹{fmt(band.target)}</strong>
        <p>Test expiry at ₹{fmt(band.low)}, ₹{fmt(band.target)} and ₹{fmt(band.high)}. At the last premium of ₹{fmt(row[put?4:3])}, buyer P/L per unit is ₹{fmt(pnls[0])}, ₹{fmt(pnls[1])} and ₹{fmt(pnls[2])}, respectively. The seller gets the opposite before costs.</p></div>
      <button onClick={onTest}>Test prediction in simulator</button></>}
    <details className="block"><summary>Why this signal?</summary>
      <p>At each listed strike S, add up what all outstanding options would pay at expiry: Σ [call OI × max(S − strike, 0) + put OI × max(strike − S, 0)]. The strike with the smallest payout is the “max pain” target. This assumes prices may finish near that strike; nothing forces them to do so.</p>
      <p>The rule also tests one listed strike on either side. BUY means the buyer profits at all three prices. SELL means the seller profits at all three. Otherwise it says WAIT. This range is a sensitivity check, not a probability interval.</p></details>
    <small>Not backtested. Prices can settle far outside the range; uncovered call sellers can lose an unlimited amount. Paper exercise only.</small>
  </section>;
}
