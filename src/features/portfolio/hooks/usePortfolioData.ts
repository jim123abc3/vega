import { useQuery } from "@tanstack/react-query";
import { request } from "../../../api/contracts";
import type { Asset, PortfolioSnapshot, PricePoint } from "../../../api/types";

interface Result {
  assets?: Asset[];
  snapshot?: PortfolioSnapshot;
  prices?: PricePoint[];
  isLoading: boolean;
  isError: boolean;
}

export function usePortfolioData(asOf?: string): Result {
  const assetsQuery = useQuery({
    queryKey: ["assets"],
    queryFn: () => request("/assets", { query: {} }),
  });

  const portfolioQuery = useQuery({
    queryKey: ["portfolio", asOf],
    queryFn: () => request("/portfolios", { query: { asOf } }),
  });

  const pricesQuery = useQuery({
    queryKey: ["prices", asOf],
    queryFn: async () => {
      if (!portfolioQuery.data) return [];
      const symbols = portfolioQuery.data.positions.map((p) => p.asset);
      return request("/prices", {
        query: { assets: symbols.join(","), asOf },
      });
    },
    enabled: !!portfolioQuery.data,
  });

  const isLoading =
    assetsQuery.isLoading || portfolioQuery.isLoading || pricesQuery.isLoading;
  const isError =
    assetsQuery.isError || portfolioQuery.isError || pricesQuery.isError;

  return {
    assets: assetsQuery.data,
    snapshot: portfolioQuery.data,
    prices: pricesQuery.data,
    isLoading,
    isError,
  };
}
