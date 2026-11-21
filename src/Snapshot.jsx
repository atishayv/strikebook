import {fmt} from './chain.js';
import InfoTip from './InfoTip.jsx';

export function Metrics({rows}) {
  const total=i=>rows.reduce((a,r)=>a+(r[i]??0),0), calls=total(1), puts=total(2);
  const complete=rows.every(r=>r[1]!=null && r[2]!=null);
  return <div className="stats">{[
    ['Put / call OI ratio',calls && complete?(puts/calls).toFixed(2):'—','Across displayed strikes','Divide open put contracts by open call contracts. For example, 120 puts ÷ 100 calls = 1.20. That says more put contracts are open in this snapshot; it does not say whether traders expect prices to rise or fall.'],
    ['Total call open interest',fmt(calls),'Contracts open in this file','How many call contracts are still open across the strikes shown. For example, 1,000 means 1,000 contracts remain open, not that 1,000 were traded today.'],
    ['Total put open interest',fmt(puts),'Contracts open in this file','How many put contracts are still open across the strikes shown. Open interest counts contracts that have not been closed; trading volume counts trades made during a period.']
  ].map(([title,value,note,description])=><div className="card" key={title}><div className="metric-label"><small>{title}</small><InfoTip title={title}>{description}</InfoTip></div><div className="metric">{value}</div><small>{note}</small></div>)}</div>;
}

export function Chart({rows}) {
  const max=Math.max(1,...rows.flatMap(r=>[r[1]??0,r[2]??0]));
  return <section className="card"><div className="eyebrow">01 / Positioning</div><div className="heading-info"><h2>Open contracts at each price</h2><InfoTip title="How to read this chart">Each row is one fixed price in an option deal. The left bar counts open calls; the right bar counts open puts. For example, a bar for 120 contracts is longer than one for 100. A longer bar means more deals remain open there; it does not show whether prices will rise or fall.</InfoTip></div>
    <div className="legend"><b className="accent">■ Calls</b> ← Strike → ■ Puts <InfoTip title="Call, put, and strike">A call is like paying for the right to buy something later at a fixed price. A put is the right to sell at a fixed price. That fixed price is the strike. Example: with a ₹100 strike call, the buyer may buy at ₹100 even if the market price becomes ₹110.</InfoTip></div>
    <div className="bars">{rows.map(([k,c,p])=><div key={k} className="barrow" title={`Call OI ${fmt(c)} · Put OI ${fmt(p)}`}><i style={{width:`${100*c/max}%`}}/><b>{fmt(k)}</b><i style={{width:`${100*p/max}%`}}/></div>)}</div>
    <small>Every open contract has a buyer and a seller. These counts do not tell you which side they expect to win. Missing values are left out of totals.</small></section>;
}

export function StrikeTable({rows}) {
  const columns=[
    'Call OI','Call LTP (₹)','Strike (₹)','Put LTP (₹)','Put OI'
  ];
  return <section className="card block"><div className="eyebrow">04 / Snapshot</div><div className="heading-info"><h2>Imported option prices</h2><InfoTip title="How to read this table">These are the values saved in your CSV; they do not update. OI (open interest) is how many contracts are still open. LTP (last traded price) is the last price someone paid for one unit of that option; it may not be the price now. Strike is the fixed price in the contract. For example, at a ₹100 strike, “Call LTP ₹5” means the last buyer paid ₹5 for one call unit.</InfoTip></div><div className="scroll"><table>
    <thead><tr>{columns.map(x=><th key={x}>{x}</th>)}</tr></thead>
    <tbody>{rows.map(r=><tr key={r[0]}>{[1,3,0,4,2].map(i=><td key={i}>{fmt(r[i])}</td>)}</tr>)}</tbody></table></div></section>;
}
