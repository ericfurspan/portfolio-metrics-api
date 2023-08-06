import fetch from 'node-fetch';
import 'dotenv/config';
import appendToGoogleSheet from './appendGoogleSheet.js';
import { GlobalQuoteResult, OverviewResult, QueryFunction, QueryResult } from '../types.js';

const BASE_QUERY = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

const buildSheetRow = (overviewResult: OverviewResult, globalQuoteResult: GlobalQuoteResult) => [
  overviewResult.Name,
  globalQuoteResult['Global Quote']?.['05. price'],
  overviewResult.MarketCapitalization,
  overviewResult['52WeekLow'],
  overviewResult['52WeekHigh'],
  overviewResult.PERatio,
  overviewResult.TrailingPE,
  overviewResult.ForwardPE,
  overviewResult.PEGRatio,
  overviewResult.EPS,
  overviewResult.DividendYield,
  overviewResult.AnalystTargetPrice,
  overviewResult.Sector
];

const queryAlphaVantage = async (symbol: string, queryFn: QueryFunction) => {
  const query = `${BASE_QUERY}&symbol=${symbol}&function=${queryFn}`;
  const response = await fetch(query);

  if (response.ok) {
    const data = await response.json();

    return data as QueryResult;
  }

  console.log(`${response.status} - ${response.statusText}`, query);
  throw new Error(`queryAlphaVantage error`);
};

const processTicker = async (symbol: string, updateGoogleSheet = false) => {
  const quoteResult = (await queryAlphaVantage(symbol, 'GLOBAL_QUOTE')) as GlobalQuoteResult;
  const overviewResult = (await queryAlphaVantage(symbol, 'OVERVIEW')) as OverviewResult;

  const data = { ...quoteResult, ...overviewResult };

  if (updateGoogleSheet) {
    const row = buildSheetRow(overviewResult, quoteResult);
    await appendToGoogleSheet(row);
  }

  return data;
};

export default processTicker;
