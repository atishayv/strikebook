const demo=[[23800,8600,23500,240,32],[23850,11000,31200,201,43],[23900,14700,48100,163,55],[23950,18900,34500,129,72],[24000,32700,42100,99,92],[24050,29400,21900,74,117],[24100,45200,18700,54,147],[24150,28700,12900,39,182],[24200,32100,9900,28,221]];
function csvRows(text){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else quoted=!quoted}
  else if(!quoted&&c===','){row.push(field.trim());field=''}
  else if(!quoted&&c==='\n'){row.push(field.trim());rows.push(row);row=[];field=''}
  else field+=c;
 }if(quoted)throw Error('Unclosed CSV quote. Re-export the snapshot.');
 row.push(field.trim());rows.push(row);return rows;
}
function parseChain(text){
 const all=csvRows(text),h=all.findIndex(row=>row.some(c=>/^strike( price)?$/i.test(c)));
 if(h<0)throw Error('No STRIKE column found.');
 const hdr=all[h].map(c=>c.toUpperCase()),k=hdr.findIndex(c=>/^STRIKE( PRICE)?$/.test(c));
 const indices=[k,...['OI','OI','LTP','LTP'].map((name,j)=>hdr.findIndex((c,i)=>c===name&&(j%2?i>k:i<k)))];
 if(indices.includes(-1))throw Error('Both call and put OI and LTP columns are required.');
 const data=[],seen=new Set();
 for(let i=h+1;i<all.length;i++){const r=all[i];if(!r.some(Boolean)||r.some(c=>/^totals?:?$/i.test(c)))continue;
 const values=indices.map((n,j)=>{const s=r[n];if(j&&['','-','—'].includes(s))return null;
 if(!s||!/^(\d+|\d{1,3}(?:,\d{2,3})+)(\.\d+)?$/.test(s))throw Error(`Invalid number on row ${i+1}.`);
 const v=Number(s.replaceAll(',',''));if(!Number.isFinite(v)||((j===1||j===2)&&!Number.isSafeInteger(v)))throw Error(`Invalid value on row ${i+1}.`);return v});
 if(values[0]<=0||seen.has(values[0]))throw Error('Expected unique positive strikes for one expiry.');
 seen.add(values[0]);data.push(values);
 }if(!data.length||data.length>5000)throw Error('Expected between 1 and 5,000 strike rows.');
 return data.sort((a,b)=>a[0]-b[0]);
}
function payoff(k,p,s,put){return Math.max(0,put?k-s:s-k)-p}

export {demo, parseChain, payoff};
export const fmt=n=>n==null?"—":n.toLocaleString("en-IN",{maximumFractionDigits:2});
