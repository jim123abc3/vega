import { useQuery } from "@tanstack/react-query";
import { request } from "../../../api/contracts";
import type { PortfolioSnapshot, PricePoint } from "../../../api/types";
import { buildHistoricalSeries } from "../utils/aggregation";

export type HistoryRange = "1M" | "6M" | "1Y";

function subtractMonths(baseIso: string, months: number): string {
  const d = new Date(baseIso + "T00:00:00Z");
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

export function useHistoricalData(
  snapshot: PortfolioSnapshot | undefined,
  range: HistoryRange
) {
  return useQuery({
    queryKey: ["prices-history", snapshot?.asOf, range],
    enabled: !!snapshot,
    queryFn: async () => {
      if (!snapshot) return [];
      const assets = snapshot.positions.map((p) => p.asset).join(",");

      const to = snapshot.asOf;
      const from =
        range === "1M"
          ? subtractMonths(to, 1)
          : range === "6M"
          ? subtractMonths(to, 6)
          : subtractMonths(to, 12);

      const prices = await request("/prices", { query: { assets, from, to } });
      return buildHistoricalSeries(snapshot, prices as PricePoint[]);
    },
  });
}
