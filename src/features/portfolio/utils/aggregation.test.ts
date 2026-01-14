import {
  buildDonutByAsset,
  buildDonutByClass,
  buildHistoricalSeries,
} from "./aggregation";
import type { Asset, PortfolioSnapshot, PricePoint } from "../../../api/types";

const snapshot: PortfolioSnapshot = {
  asOf: "2023-01-01",
  positions: [
    { asset: "USD", quantity: 1000 },
    { asset: "AAPL", quantity: 2 },
  ],
};

const prices: PricePoint[] = [
  { asset: "USD", asOf: "2023-01-01", priceUsd: 1 },
  { asset: "AAPL", asOf: "2023-01-01", priceUsd: 10 },
];

const assets: Asset[] = [
  { symbol: "USD", name: "US Dollar", class: "cash" },
  { symbol: "AAPL", name: "Apple Inc.", class: "stock" },
];

test("buildDonutByAsset computes value per asset", () => {
  const result = buildDonutByAsset(snapshot, prices);

  expect(result).toEqual([
    { label: "USD", value: 1000 },
    { label: "AAPL", value: 20 },
  ]);
});

test("buildDonutByClass aggregates by asset class", () => {
  const result = buildDonutByClass(assets, snapshot, prices);

  expect(result).toEqual(
    expect.arrayContaining([
      { label: "cash", value: 1000 },
      { label: "stock", value: 20 },
    ])
  );
});

test("buildHistoricalSeries computes total value per date", () => {
  const historicalPrices: PricePoint[] = [
    { asset: "USD", asOf: "2022-12-31", priceUsd: 1 },
    { asset: "AAPL", asOf: "2022-12-31", priceUsd: 8 },
    { asset: "USD", asOf: "2023-01-01", priceUsd: 1 },
    { asset: "AAPL", asOf: "2023-01-01", priceUsd: 10 },
  ];

  const series = buildHistoricalSeries(snapshot, historicalPrices);

  expect(series).toEqual([
    { date: "2022-12-31", valueUsd: 1000 + 2 * 8 },
    { date: "2023-01-01", valueUsd: 1000 + 2 * 10 },
  ]);
});
