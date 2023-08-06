import processTicker from './processTicker.js';

const TIME_BETWEEN_REQUESTS = 60000; // in milliseconds
const tickers = [
  'AAPL',
  'TSLA',
  'MSFT',
  'UNH',
  'JNJ',
  'AVGO',
  'JPM',
  'CVX',
  'PG',
  'HD',
  'PEP',
  'COST',
  'MCD',
  'DE',
  'LMT',
  'NOC',
  'V',
  'WM',
  'GIS',
  'HSY'
];

async function process(symbols: string[]) {
  for (const symbol of symbols) {
    await processTicker(symbol, true);

    console.log(`processed ${symbol}, waiting ${TIME_BETWEEN_REQUESTS / 1000} seconds...`);

    await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
  }
}

export default process(tickers);
