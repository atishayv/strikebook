import test from 'node:test';
import assert from 'node:assert/strict';
import {demo,parseChain} from '../src/chain.js';
import {expiryBand,signal,reference} from '../src/model.js';

test('target minimizes aggregate payout on the entire demo chain',()=>{
  const payout=s=>demo.reduce((v,[k,c,p])=>v+c*Math.max(0,s-k)+p*Math.max(0,k-s),0);
  const best=demo.map(([k])=>k).sort((a,b)=>payout(a)-payout(b))[0];
  assert.equal(expiryBand(demo).target,best);
  assert.equal(reference(demo).price,24007);
});
test('buy/sell/wait use all three expiry scenarios and handle breakeven',()=>{
  const band={low:90,target:100,high:110};
  assert.equal(signal(band,[80,1,1,5,3],false).action,'BUY');
  assert.equal(signal(band,[100,1,1,15,15],true).action,'SELL');
  assert.equal(signal(band,[100,1,1,10,10],false).action,'WAIT');
  assert.equal(signal(band,[100,1,1,null,0],true).action,'WAIT');
});
test('missing data, tied targets and edge targets abstain',()=>{
  for(const rows of [[[1,null,2],[2,2,2],[3,4,4]],[[1,1,1],[2,1,1],[3,1,0]],[[1,5,1],[2,1,1],[3,1,1]]]) {
    assert.ok(expiryBand(rows).reason);
  }
});
test('accepts NSE-style rows and rejects duplicate strikes',()=>{
  const header='CALLS,,,,PUTS\nOI,LTP,STRIKE,LTP,OI\n';
  assert.deepEqual(parseChain(header+'"1,200",5,100,4,-'),[[100,1200,null,5,4]]);
  assert.throws(()=>parseChain(header+'1,5,100,4,2\n2,5,100,4,2'));
});
