import type { Asset } from "../types";
import { delay } from "./utils";

const ASSETS: Asset[] = [
  { symbol: "USD", name: "US Dollar", class: "cash" },
  { symbol: "AAPL", name: "Apple Inc.", class: "stock" },
  { symbol: "TSLA", name: "Tesla Inc.", class: "stock" },
  { symbol: "BTC", name: "Bitcoin", class: "crypto" },
  { symbol: "ETH", name: "Ethereum", class: "crypto" },
];

export async function getAssets(): Promise<Asset[]> {
  await delay(1000);
  return ASSETS;
}

export { ASSETS };
