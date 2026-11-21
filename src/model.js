import {payoff} from './chain.js';

export function reference(rows) {
  const pair = rows.filter(([k,,,c,p]) => c > 0 && p > 0 && k+c-p > 0)
    .sort((a,b) => Math.abs(a[3]-a[4])-Math.abs(b[3]-b[4]))[0];
  return pair ? {pair, price: Math.round((pair[0]+pair[3]-pair[4])*100)/100} : null;
}

// Between adjacent strikes the total payout slope is active call OI minus active put OI.
export function expiryBand(rows) {
  if (rows.length < 3 || rows.some(r => r[1] == null || r[2] == null))
    return {reason:'Need at least three strikes with both OI columns reported.'};
  let slope = -rows.reduce((n,r) => n+r[2],0);
  if (!slope || !rows.some(r => r[1]>0)) return {reason:'Need open contracts on both sides.'};
  for (let i=0; i<rows.length; i++) {
    slope += rows[i][1]+rows[i][2];
    if (slope >= 0) {
      if (!slope) return {reason:'Several strikes tie for minimum payout; no unique target.'};
      if (!i || i===rows.length-1) return {reason:'Target is on the edge of this snapshot; import more strikes.'};
      return {target:rows[i][0], low:rows[i-1][0], high:rows[i+1][0]};
    }
  }
  return {reason:'No usable payout minimum.'};
}

export function signal(band,row,put) {
  const premium=row[put?4:3];
  if (band.reason || !(premium>0)) return {action:'WAIT',reason:band.reason || 'No positive last price for this contract.'};
  const pnls=[band.low,band.target,band.high].map(s=>payoff(row[0],premium,s,put));
  return {action:pnls.every(x=>x>0)?'BUY':pnls.every(x=>x<0)?'SELL':'WAIT',pnls};
}
