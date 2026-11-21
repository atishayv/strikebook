import {useRef,useState} from 'react';
import {parseChain} from './chain.js';

export default function ImportDialog({onImport}) {
  const dialog=useRef(null), [error,setError]=useState('');
  async function load(e) {
    e.preventDefault();
    const form=new FormData(e.currentTarget), label=form.get('label').trim(), file=form.get('csv');
    try {
      if (!label || !file.size) throw Error('Enter a symbol and expiry and choose a nonempty CSV.');
      if (file.size>4e6) throw Error('File exceeds the 4 MB limit.');
      const data=parseChain(await file.text());
      if (!dialog.current?.open) return;
      onImport({label,rows:data}); dialog.current.close();
    } catch(err) {setError(err.message)}
  }
  return <><button className="primary" onClick={()=>{setError('');dialog.current.showModal()}}>Import NSE snapshot</button>
    <dialog ref={dialog} aria-labelledby="import-title"><form onSubmit={load}><h2 id="import-title">Import a snapshot</h2>
    <p>Choose a side-by-side <a href="https://www.nseindia.com/option-chain" target="_blank" rel="noreferrer">NSE option chain</a> CSV for one symbol and expiry, with OI and LTP on both sides of STRIKE. Files stay in your browser.</p>
    <div className="fields"><label>Symbol and expiry<input name="label" maxLength="80" required/></label><label>Snapshot CSV<input name="csv" type="file" accept=".csv,text/csv" required/></label></div>
    <p id="error" role="alert">{error}</p><div className="row"><button className="primary">Analyze file</button><button type="button" onClick={()=>dialog.current.close()}>Cancel</button></div></form></dialog></>;
}
