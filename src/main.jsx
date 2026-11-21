import {useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {demo,fmt} from './chain.js';
import {expiryBand,reference} from './model.js';
import Guide from './Guide.jsx';
import Prediction from './Prediction.jsx';
import Scenario from './Scenario.jsx';
import ImportDialog from './ImportDialog.jsx';
import {Metrics,Chart,StrikeTable} from './Snapshot.jsx';

const sample={label:'NIFTY 50 · Sample expiry',rows:demo};

function Desk({rows}) {
  const middle=rows[Math.floor(rows.length/2)];
  const [row,setRow]=useState(middle), [put,setPut]=useState(false);
  const [premium,setPremium]=useState(middle[3]??''), [expiry,setExpiry]=useState(rows===demo?24150:middle[0]);
  const band=useMemo(()=>expiryBand(rows),[rows]), ref=useMemo(()=>reference(rows),[rows]);
  function onContract(next,isPut) {setRow(next);setPut(isPut);setPremium(next[isPut?4:3]??'')}
  function testPrice(price) {setExpiry(price);document.getElementById('expiry').focus()}
  return <>
    <Prediction {...{band,row,put}} onTest={()=>{setPremium(row[put?4:3]);testPrice(band.target)}}/>
    <Metrics rows={rows}/>
    <div className="grid"><Chart rows={rows}/><Scenario {...{rows,row,put,onContract,premium,setPremium,expiry,setExpiry}}/></div>
    <section className="card block"><div className="eyebrow">03 / Chain-implied scenario</div><h2>What price is the chain implying?</h2>
    <p>{ref?`Strike + call − put = ₹${fmt(ref.pair[0])} + ₹${fmt(ref.pair[3])} − ₹${fmt(ref.pair[4])} = ₹${fmt(ref.price)}.`:'No usable call and put price pair.'}</p>
    <button className="block" disabled={!ref} onClick={()=>testPrice(ref.price)}>Test this expiry price</button>
    <p><small>This reference assumes European options, negligible interest and matching quote times. It is not a prediction of settlement.</small></p></section>
    <StrikeTable rows={rows}/></>;
}

function App() {
  const [snapshot,setSnapshot]=useState(sample),[revision,setRevision]=useState(0);
  function change(next){setSnapshot(next);setRevision(v=>v+1)}
  return <><header><div className="wrap"><div className="brand"><span className="mark">≋</span>Strikebook</div>
    <nav><a href="#desk">Analysis desk</a><a href="#prediction">Prediction</a><a href="#learn">Learn options</a><a href="#how-it-works">How it works</a></nav></div></header>
    <main className="wrap" id="desk"><section className="hero"><div className="eyebrow">Derivatives workspace / India</div><h1>Option chain desk</h1><p>Read the positioning. Test a price view. Understand the risk.</p></section>
    <div className="row split"><div className="row"><strong>{snapshot.label}</strong><span className="pill">{snapshot===sample?'Illustrative data':'Imported · not live'}</span></div>
    <div className="row">{snapshot!==sample && <button onClick={()=>change(sample)}>Restore demo</button>}<ImportDialog onImport={change}/></div></div>
    <Desk key={revision} rows={snapshot.rows}/><Guide/><footer>Educational simulator · No orders, live prices or validated trading signals.</footer></main></>;
}

createRoot(document.getElementById('root')).render(<App/>);
