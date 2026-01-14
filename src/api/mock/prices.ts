import type { PricePoint } from "../types";
import { delay } from "./utils";
import {
  DEFAULT_PORTFOLIO_AS_OF,
  DEFAULT_HISTORY_FROM,
} from "../../constants/dates";

const BASE_PRICES: Record<string, number> = {
  USD: 1,
  AAPL: 150,
  TSLA: 200,
  BTC: 20000,
  ETH: 1500,
};

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function generatePrice(asset: string, dateStr: string): number {
  if (asset === "USD") return 1;

  const base = BASE_PRICES[asset] ?? 100;
  const date = parseDate(dateStr);
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));

  const trendSlope =
    asset === "BTC"
      ? 0.002
      : asset === "ETH"
      ? 0.0015
      : asset === "TSLA"
      ? 0.001
      : asset === "AAPL"
      ? 0.0008
      : 0.0;

  const daysFromStart = daysSinceEpoch - 19000; // arbitrary reference
  const trend = 1 + trendSlope * daysFromStart;

  const noise = 1 + Math.sin(daysSinceEpoch / 14) * 0.08;

  return Math.max(0.1, base * trend * noise);
}

export async function getPrices(params: {
  assets: string;
  asOf?: string;
  from?: string;
  to?: string;
}): Promise<PricePoint[]> {
  await delay(1000);

  const symbols = params.assets.split(",").filter(Boolean);

  if (params.asOf && !params.from && !params.to) {
    return symbols.map((symbol) => ({
      asset: symbol,
      asOf: params.asOf!,
      priceUsd: generatePrice(symbol, params.asOf!),
    }));
  }

  const from = params.from ?? DEFAULT_HISTORY_FROM;
  const to = params.to ?? DEFAULT_PORTFOLIO_AS_OF;

  const start = parseDate(from);
  const end = parseDate(to);

  const result: PricePoint[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    for (const symbol of symbols) {
      result.push({
        asset: symbol,
        asOf: dateStr,
        priceUsd: generatePrice(symbol, dateStr),
      });
    }
  }

  return result;
}
