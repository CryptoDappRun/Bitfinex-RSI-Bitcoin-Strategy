
const ccxt = require('ccxt');

const exchange = new ccxt.bitfinex({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET',
});

const symbol = 'BTC/USD';
const timeframe = '1h';
const rsiPeriod = 14;
const oversoldThreshold = 30;
const overboughtThreshold = 70;
let lastRsiValue = null;
let lastVolumeValue = null;

async function main() {
  while (true) {
    const candles = await exchange.fetchOHLCV(symbol, timeframe);
    const closePrices = candles.map(candle => candle[4]);
    const volumes = candles.map(candle => candle[5]);
    const rsi = calculateRsi(closePrices, rsiPeriod);
    const volume = volumes[volumes.length - 1];

    if (lastRsiValue !== null && lastVolumeValue !== null) {
      const isOversold = rsi < oversoldThreshold && rsi > lastRsiValue && volume > lastVolumeValue;
      const isOverbought = rsi > overboughtThreshold && rsi < lastRsiValue && volume < lastVolumeValue;

      if (isOversold) {
        const order = await exchange.createOrder(symbol, 'limit', 'buy', 0.01, closePrices[closePrices.length - 1]);
        console.log('Buy order placed:', order);
      } else if (isOverbought) {
        const order = await exchange.createOrder(symbol, 'limit', 'sell', 0.01, closePrices[closePrices.length - 1]);
        console.log('Sell order placed:', order);
      }
    }

    lastRsiValue = rsi;
    lastVolumeValue = volume;

    await sleep(60 * 60 * 1000); // Wait for 1 hour before checking again
  }
}

function calculateRsi(prices, period) {
  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) {
      gainSum += diff;
    } else {
      lossSum += Math.abs(diff);
    }
  }

  const avgGain = gainSum / period;
  const avgLoss = lossSum / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();