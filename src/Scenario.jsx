import {fmt,payoff} from './chain.js';

export default function Scenario({rows,row,put,onContract,premium,setPremium,expiry,setExpiry}) {
  const valid=[premium,expiry].every(x=>x!=='' && Number.isFinite(+x) && +x>=0);
  const pnl=payoff(row[0],+premium,+expiry,put), be=row[0]+(put?-1:1)*Number(premium);
  return <section className="card" id="simulator"><div className="eyebrow">02 / Paper exercise</div><h2>Buy or sell scenario</h2>
    <p>Compare both sides at your assumed expiry price.</p>
    <div className="fields"><label>Strike<select id="strike" value={row[0]} onChange={e=>onContract(rows.find(r=>r[0]===+e.target.value),put)}>{rows.map(r=><option key={r[0]} value={r[0]}>{fmt(r[0])}</option>)}</select></label>
    <label>Option type<select id="side" value={put?'Put':'Call'} onChange={e=>onContract(row,e.target.value==='Put')}><option>Call</option><option>Put</option></select></label>
    <label>Expiry price (₹)<input id="expiry" type="number" min="0" step="any" value={expiry} onChange={e=>setExpiry(e.target.value)}/></label>
    <label>Premium per unit (₹)<input id="premium" type="number" min="0" step="any" value={premium} onChange={e=>setPremium(e.target.value)}/></label></div>
    <div className="result" id="outcome" aria-live="polite">{valid?`Buy: ₹${fmt(pnl)} · Sell: ₹${fmt(-pnl||0)} per unit. ${be<0?'No non-negative breakeven.':`Breakeven: ₹${fmt(be)}.`}`:'Enter a non-negative premium and expiry price to compare.'}</div>
    <small>Per unit, before costs. Last price is not an executable quote. Sellers may need margin; uncovered calls have unlimited loss potential.</small></section>;
}
