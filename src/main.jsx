import {useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {demo,fmt} from './chain.js';
import {expiryBand,reference} from './model.js';
import Guide from './Guide.jsx';
import Prediction from './Prediction.jsx';
import Scenario from './Scenario.jsx';
import ImportDialog from './ImportDialog.jsx';
import {Metrics,Chart,StrikeTable} from './Snapshot.jsx';
import InfoTip from './InfoTip.jsx';

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
    <section className="card block"><div className="eyebrow">03 / Compare option prices</div><div className="heading-info"><h2>A rough price comparison</h2><InfoTip title="How this comparison is worked out">For options with the same fixed price and end date, start with the fixed price, add the call's price, then subtract the put's price. Example: ₹100 + ₹5 − ₹3 = ₹102. This is a rough comparison from option prices, not a forecast of where the market will end. It only makes sense when the call and put are from the same time and contract.</InfoTip></div>
    <p>{ref?`For strike ₹${fmt(ref.pair[0])}: ₹${fmt(ref.pair[0])} + call price ₹${fmt(ref.pair[3])} − put price ₹${fmt(ref.pair[4])} = comparison price ₹${fmt(ref.price)}.`:'The file needs a call and put price at the same fixed price before this comparison can be shown.'}</p>
    <button className="block" disabled={!ref} onClick={()=>testPrice(ref.price)}>Try this price in the practice section</button>
    <p><small>This is only a comparison based on the saved file. It is not a prediction or a promise about the final price.</small></p></section>
    <StrikeTable rows={rows}/></>;
}

function App() {
  const [snapshot,setSnapshot]=useState(sample),[revision,setRevision]=useState(0);
  function change(next){setSnapshot(next);setRevision(v=>v+1)}
  return <><header><div className="wrap"><div className="brand"><span className="mark">≋</span>Strikebook</div>
    <nav><a href="#desk">Analysis desk</a><a href="#prediction">Prediction</a><a href="#learn">Learn options</a><a href="#how-it-works">How it works</a></nav></div></header>
    <main className="wrap" id="desk"><section className="hero"><div className="eyebrow">Practice with options · India</div><div className="heading-info"><h1>Option chain desk</h1><InfoTip title="Option chain desk">An option chain is a list of choices to buy or sell at different fixed prices. This desk lets you explore those choices with made-up or saved prices. Example: see how a ₹100 call might work if the share ended at ₹103. It does not place trades or show live prices.</InfoTip></div><p>Explore option prices, try a possible ending price, and see how the results change.</p></section>
    <div className="row split"><div className="row"><strong>{snapshot.label}</strong><span className="pill">{snapshot===sample?'Illustrative data':'Imported · not live'}</span></div>
    <div className="row">{snapshot!==sample && <button onClick={()=>change(sample)}>Restore demo</button>}<ImportDialog onImport={change}/></div></div>
    <Desk key={revision} rows={snapshot.rows}/><Guide/><footer>For learning only · No trades, live prices, or reliable predictions.</footer></main></>;
}

createRoot(document.getElementById('root')).render(<App/>);
