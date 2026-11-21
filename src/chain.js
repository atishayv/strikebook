const demo=[[23800,8600,23500,240,32],[23850,11000,31200,201,43],[23900,14700,48100,163,55],[23950,18900,34500,129,72],[24000,32700,42100,99,92],[24050,29400,21900,74,117],[24100,45200,18700,54,147],[24150,28700,12900,39,182],[24200,32100,9900,28,221]];
function csvRows(text){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else quoted=!quoted}
  else if(!quoted&&c===','){row.push(field.trim());field=''}
  else if(!quoted&&c==='\n'){row.push(field.trim());rows.push(row);row=[];field=''}
  else field+=c;
 }if(quoted)throw Error('The CSV has a quote mark that was not closed. Download it again or compare it with the sample file.');
 row.push(field.trim());rows.push(row);return rows;
}
function parseChain(text){
 const all=csvRows(text),h=all.findIndex(row=>row.some(c=>/^strike( price)?$/i.test(c)));
 if(h<0)throw Error('Could not find the STRIKE column (the fixed price for each option). Check the CSV or use the sample file.');
 const hdr=all[h].map(c=>c.toUpperCase()),k=hdr.findIndex(c=>/^STRIKE( PRICE)?$/.test(c));
 const indices=[k,...['OI','OI','LTP','LTP'].map((name,j)=>hdr.findIndex((c,i)=>c===name&&(j%2?i>k:i<k)))];
 if(indices.includes(-1))throw Error('Could not find the OI and LTP columns for both calls and puts. Check the sample CSV for the required columns.');
 const data=[],seen=new Set();
 for(let i=h+1;i<all.length;i++){const r=all[i];if(!r.some(Boolean)||r.some(c=>/^totals?:?$/i.test(c)))continue;
 const values=indices.map((n,j)=>{const s=r[n];if(j&&['','-','—'].includes(s))return null;
 if(!s||!/^(\d+|\d{1,3}(?:,\d{2,3})+)(\.\d+)?$/.test(s))throw Error(`Row ${i+1} has a number we do not recognize. Check it against the sample CSV.`);
 const v=Number(s.replaceAll(',',''));if(!Number.isFinite(v)||((j===1||j===2)&&!Number.isSafeInteger(v)))throw Error(`Row ${i+1} has a value we cannot use. Check it against the sample CSV.`);return v});
 if(values[0]<=0||seen.has(values[0]))throw Error('Each price must be greater than zero and appear only once. Use one symbol and one expiry per file.');
 seen.add(values[0]);data.push(values);
 }if(!data.length||data.length>5000)throw Error('The CSV must contain between 1 and 5,000 rows of option prices.');
 return data.sort((a,b)=>a[0]-b[0]);
}
function payoff(k,p,s,put){return Math.max(0,put?k-s:s-k)-p}

export {demo, parseChain, payoff};
export const fmt=n=>n==null?"—":n.toLocaleString("en-IN",{maximumFractionDigits:2});
