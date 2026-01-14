export type AssetClass = "cash" | "stock" | "crypto";

export interface Asset {
  symbol: string;
  name: string;
  class: AssetClass;
}

export interface Position {
  asset: string;
  quantity: number;
}

export interface PortfolioSnapshot {
  asOf: string;
  positions: Position[];
}

export interface PricePoint {
  asset: string;
  asOf: string;
  priceUsd: number;
}
