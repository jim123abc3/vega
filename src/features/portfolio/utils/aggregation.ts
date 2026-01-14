import type { Asset, PortfolioSnapshot, PricePoint } from "../../../api/types";

export interface DonutSlice {
  label: string;
  value: number;
  [key: string]: string | number;
}

export interface HistoricalPoint {
  date: string;
  valueUsd: number;
}

function buildPriceMap(prices: PricePoint[]) {
  const map = new Map<string, number>();

  prices.forEach((p) => {
    map.set(`${p.asset}-${p.asOf}`, p.priceUsd);
  });
  return map;
}

export function buildDonutByAsset(
  snapshot: PortfolioSnapshot,
  prices: PricePoint[]
): DonutSlice[] {
  const priceMap = buildPriceMap(prices);
  const asOf = snapshot.asOf;

  return snapshot.positions.map((pos) => {
    const price = priceMap.get(`${pos.asset}-${asOf}`) ?? 0;

    return {
      label: pos.asset,
      value: pos.quantity * price,
    };
  });
}

export function buildDonutByClass(
  assets: Asset[],
  snapshot: PortfolioSnapshot,
  prices: PricePoint[]
): DonutSlice[] {
  const byAsset = buildDonutByAsset(snapshot, prices);
  const classBySymbol = new Map(assets.map((a) => [a.symbol, a.class]));
  const map = new Map<string, number>();

  byAsset.forEach((row) => {
    const cls = classBySymbol.get(row.label) ?? "other";
    map.set(cls, (map.get(cls) ?? 0) + row.value);
  });

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

export function buildHistoricalSeries(
  snapshot: PortfolioSnapshot,
  prices: PricePoint[]
): HistoricalPoint[] {
  const byDate = new Map<string, PricePoint[]>();

  prices.forEach((p) => {
    const arr = byDate.get(p.asOf) ?? [];
    arr.push(p);
    byDate.set(p.asOf, arr);
  });

  const points: HistoricalPoint[] = [];

  for (const [date, dailyPrices] of byDate.entries()) {
    const priceMap = new Map(dailyPrices.map((p) => [p.asset, p.priceUsd]));
    let total = 0;

    snapshot.positions.forEach((pos) => {
      const price = priceMap.get(pos.asset) ?? 0;
      total += pos.quantity * price;
    });
    points.push({ date, valueUsd: total });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}
