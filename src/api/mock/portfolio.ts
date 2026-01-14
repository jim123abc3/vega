import type { PortfolioSnapshot } from "../types";
import { delay } from "./utils";
import { DEFAULT_PORTFOLIO_AS_OF } from "../../constants/dates";

const BASE_SNAPSHOT: PortfolioSnapshot = {
  asOf: DEFAULT_PORTFOLIO_AS_OF,
  positions: [
    { asset: "USD", quantity: 20000 },
    { asset: "AAPL", quantity: 50 },
    { asset: "TSLA", quantity: 30 },
    { asset: "BTC", quantity: 0.8 },
    { asset: "ETH", quantity: 4 },
  ],
};

export async function getPortfolio(params: {
  asOf?: string;
}): Promise<PortfolioSnapshot> {
  await delay(1000);

  if (!params.asOf) {
    return { ...BASE_SNAPSHOT, asOf: BASE_SNAPSHOT.asOf };
  }

  const target = params.asOf;
  const base = BASE_SNAPSHOT.asOf;
  const diffMs = new Date(target).getTime() - new Date(base).getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const factor = 1 + diffDays * 0.001;

  return {
    asOf: target,
    positions: BASE_SNAPSHOT.positions.map((p) => ({
      ...p,
      quantity: Math.max(0, p.quantity * factor),
    })),
  };
}
