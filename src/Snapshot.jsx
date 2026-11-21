import {fmt} from './chain.js';

export function Metrics({rows}) {
  const total=i=>rows.reduce((a,r)=>a+(r[i]??0),0), calls=total(1), puts=total(2);
  const complete=rows.every(r=>r[1]!=null && r[2]!=null);
  return <div className="stats">{[
    ['Put / call OI ratio',calls && complete?(puts/calls).toFixed(2):'—','Across displayed strikes'],
    ['Total call open interest',fmt(calls),'Reported contracts'],['Total put open interest',fmt(puts),'Reported contracts']
  ].map(([title,value,note])=><div className="card" key={title}><small>{title}</small><div className="metric">{value}</div><small>{note}</small></div>)}</div>;
}

export function Chart({rows}) {
  const max=Math.max(1,...rows.flatMap(r=>[r[1]??0,r[2]??0]));
  return <section className="card"><div className="eyebrow">01 / Positioning</div><h2>Open interest by strike</h2>
    <div className="legend"><b className="accent">■ Calls</b> ← Strike → ■ Puts</div>
    <div className="bars">{rows.map(([k,c,p])=><div key={k} className="barrow" title={`Call OI ${fmt(c)} · Put OI ${fmt(p)}`}><i style={{width:`${100*c/max}%`}}/><b>{fmt(k)}</b><i style={{width:`${100*p/max}%`}}/></div>)}</div>
    <small>Every open contract has a buyer and a seller. OI alone does not tell you direction. Missing values are omitted from totals.</small></section>;
}

export function StrikeTable({rows}) {
  return <section className="card block"><div className="eyebrow">04 / Snapshot</div><h2>Strike data</h2><div className="scroll"><table>
    <thead><tr>{['Call OI','Call LTP (₹)','Strike (₹)','Put LTP (₹)','Put OI'].map(x=><th key={x}>{x}</th>)}</tr></thead>
    <tbody>{rows.map(r=><tr key={r[0]}>{[1,3,0,4,2].map(i=><td key={i}>{fmt(r[i])}</td>)}</tr>)}</tbody></table></div></section>;
}
