import {fmt} from './chain.js';
import {signal} from './model.js';
import InfoTip from './InfoTip.jsx';

export default function Prediction({band,row,put,onTest}) {
  const {action,reason,pnls}=signal(band,row,put);
  const result=value=>value>0?`profit ₹${fmt(value)}`:value<0?`loss ₹${fmt(Math.abs(value))}`:'break-even';
  return <section className="card block" id="prediction">
    <div className="eyebrow">Practice example · not a forecast</div>
    <div className="heading-info"><h2>Paper scenario: {action} · ₹{fmt(row[0])} {put?'put':'call'}</h2><InfoTip title="What does BUY, SELL, or WAIT mean?">These words describe a simple practice check, not a recommendation. BUY means this example's option buyer would make money at all three prices tested below. SELL means the option seller would make money at all three. WAIT means the result changes across those prices. For example, a buyer who pays ₹5 for a right worth ₹3 loses ₹2 before costs.</InfoTip></div>
    <p>This uses the option price saved in your CSV, not the editable price in the practice section. <a href="#simulator">Change the example ↓</a></p>
    {reason ? <p className="result">{reason}</p> : <>
      <div className="result"><strong>Example price to test: ₹{fmt(band.target)}</strong><InfoTip title="Why show this price?">The app adds up how much all the listed options would be worth if the market ended at each listed price. This shows the price with the smallest total in that calculation. Traders sometimes call this “max pain.” Example: if the smallest total is at ₹24,000, this panel shows ₹24,000. It does not mean the market is likely to end there.</InfoTip>
        <p>To show how the result changes, the app also tests ₹{fmt(band.low)} and ₹{fmt(band.high)}. At the saved option price of ₹{fmt(row[put?4:3])}, the buyer's example is: {result(pnls[0])} at ₹{fmt(band.low)}, {result(pnls[1])} at ₹{fmt(band.target)}, and {result(pnls[2])} at ₹{fmt(band.high)}. The seller's result is the opposite, before costs.</p>
        <InfoTip title="Example profit or loss">The buyer's result is the option's value at the end minus what they paid. For example, a ₹100 call bought for ₹5 is worth ₹3 if the share ends at ₹103, so the buyer is down ₹2 per unit before fees. “Per unit” means for one share/index unit, not a whole contract bundle.</InfoTip></div>
      <button onClick={onTest}>Try this example in the simulator</button></>}
    <details className="block"><summary>Why this signal?</summary>
      <p>The app imagines the market ending at each listed price, then estimates the total value of the open options. It marks the price with the smallest estimated total. This is only a way to explore the CSV, not a prediction: the real market can end anywhere.</p>
      <p>It then checks the selected option at that price and the nearby listed prices. BUY means the example buyer is ahead at all three; SELL means the example seller is ahead at all three; otherwise it says WAIT. The nearby prices are examples, not probabilities.</p></details>
    <small>This simple rule has not been tested to show that it works. Real prices can be very different. Selling options can bring large losses. Use this as a learning example only.</small>
  </section>;
}
