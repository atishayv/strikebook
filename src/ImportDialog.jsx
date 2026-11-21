import {useRef,useState} from 'react';
import {parseChain} from './chain.js';
import InfoTip from './InfoTip.jsx';

export default function ImportDialog({onImport}) {
  const dialog=useRef(null), [error,setError]=useState('');
  const sampleCsv='CALLS,,,,PUTS\nOI,LTP,STRIKE,LTP,OI\n8600,240,24000,95,9200\n11000,201,24050,74,11700\n';
  async function load(e) {
    e.preventDefault();
    const form=new FormData(e.currentTarget), symbol=form.get('symbol').trim(), expiry=form.get('expiry').trim(), file=form.get('csv');
    try {
      if (!symbol || !expiry || !file.size) throw Error('Enter a symbol and expiry date, then choose a nonempty CSV.');
      if (file.size>4e6) throw Error('File exceeds the 4 MB limit.');
      const data=parseChain(await file.text());
      if (!dialog.current?.open) return;
      onImport({label:`${symbol} · ${expiry}`,rows:data}); dialog.current.close();
    } catch(err) {setError(err.message)}
  }
  return <><button className="primary" onClick={()=>{setError('');dialog.current.showModal()}}>Import NSE snapshot</button>
    <dialog ref={dialog} aria-labelledby="import-title"><form onSubmit={load}><h2 id="import-title">Import a snapshot</h2>
    <p>Use the <a href="https://www.nseindia.com/option-chain" target="_blank" rel="noreferrer">NSE option chain</a> to download your data. Follow these steps:</p>
    <ol className="import-steps">
      <li>On NSE, choose a symbol (for example, NIFTY) and one expiry date. Expiry is the day that option contract ends. Download the option-chain CSV for that choice.</li>
      <li>Enter the same symbol and expiry date below. They become a name for your snapshot, such as <strong>NIFTY · 26 Nov 2026</strong>; they do not change the analysis.</li>
      <li>Choose the CSV you downloaded. It must show one symbol and one expiry, with strike, OI, and LTP columns for calls and puts.</li>
    </ol>
    <p><a download="strikebook-sample.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv)}`}>Download a sample CSV</a> to see exactly how the columns should look.</p>
    <div className="fields">
      <div className="field"><div className="field-title"><label htmlFor="snapshot-symbol">Symbol</label><InfoTip title="Symbol">This is the name of the thing the option is based on: for example, NIFTY is an index and RELIANCE is a company share. Enter the same symbol you selected on NSE.</InfoTip></div><input id="snapshot-symbol" name="symbol" placeholder="e.g. NIFTY" maxLength="40" required/></div>
      <div className="field"><div className="field-title"><label htmlFor="snapshot-expiry">Expiry date</label><InfoTip title="Expiry date">This is the date the option contract ends. Select one date on NSE and use that same date's CSV. For example, enter “26 Nov 2026”. This field labels the snapshot; the option data itself comes from the CSV.</InfoTip></div><input id="snapshot-expiry" name="expiry" placeholder="e.g. 26 Nov 2026" maxLength="40" required/></div>
      <div className="field"><div className="field-title"><label htmlFor="snapshot-csv">Option-chain CSV file</label><InfoTip title="CSV, OI, and LTP">A CSV is a simple spreadsheet file. Each data row is one strike. For example, “8600,240,24000,95,9200” means at strike ₹24,000: 8,600 call contracts are open, the call last traded at ₹240, the put at ₹95, and 9,200 put contracts are open. OI means contracts still open; LTP means the option's most recent traded price.</InfoTip></div><input id="snapshot-csv" name="csv" type="file" accept=".csv,text/csv" required/></div>
    </div>
    <p className="import-note">This is a saved snapshot, not live data. Your CSV stays in your browser and is not uploaded.</p>
    <p id="error" role="alert">{error}</p><div className="row"><button className="primary">Analyze file</button><button type="button" onClick={()=>dialog.current.close()}>Cancel</button></div></form></dialog></>;
}
