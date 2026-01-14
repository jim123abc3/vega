import { useState } from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import {
  useHistoricalData,
  type HistoryRange,
} from "../hooks/useHistoricalData";
import { buildDonutByAsset, buildDonutByClass } from "../utils/aggregation";
import { PortfolioDonut } from "../components/PortfolioDonut";
import { HistoricalChart } from "../components/HistoricalChart";
import { PositionsTable } from "../components/PositionsTable";
import { Spinner } from "../../../components/ui/Spinner";
import { DEFAULT_PORTFOLIO_AS_OF } from "../../../constants/dates";

export function PortfolioDashboard() {
  const [viewMode, setViewMode] = useState<"asset" | "class">("asset");
  const [selected, setSelected] = useState<string | null>(null);
  const [historyRange, setHistoryRange] = useState<HistoryRange>("6M");

  const HISTORY_RANGES: HistoryRange[] = ["1M", "6M", "1Y"];

  const { assets, snapshot, prices, isLoading, isError } = usePortfolioData(
    DEFAULT_PORTFOLIO_AS_OF
  );

  const {
    data: historicalSeries,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useHistoricalData(snapshot, historyRange);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !assets || !snapshot || !prices) {
    return (
      <div className="text-sm text-red-400 flex items-center gap-2">
        Failed to load portfolio data.
      </div>
    );
  }

  const donutData =
    viewMode === "asset"
      ? buildDonutByAsset(snapshot, prices)
      : buildDonutByClass(assets, snapshot, prices);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <section className="flex-1 min-h-64 bg-(--color-surface) rounded-lg p-4 border border-(--color-border)">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Portfolio balance</h2>
            <div className="inline-flex rounded bg-(--color-surface-alt) border border-(--color-border) text-xs">
              <button
                className={`px-3 py-1 rounded-l cursor-pointer transition-colors ${
                  viewMode === "asset"
                    ? "bg-(--color-primary) text-(--color-bg)"
                    : "hover:bg-(--color-border)"
                }`}
                onClick={() => setViewMode("asset")}
              >
                By asset
              </button>
              <button
                className={`px-3 py-1 rounded-r cursor-pointer transition-colors ${
                  viewMode === "class"
                    ? "bg-(--color-primary) text-(--color-bg)"
                    : "hover:bg-(--color-border)"
                }`}
                onClick={() => setViewMode("class")}
              >
                By class
              </button>
            </div>
          </div>
          <PortfolioDonut
            data={donutData}
            onSliceClick={(label) => setSelected(label)}
          />
        </section>

        <section className="flex-1 min-h-64 bg-(--color-surface) rounded-lg p-4 border border-(--color-border)">
          <h2 className="text-sm font-semibold mb-2">Positions</h2>
          <PositionsTable
            assets={assets}
            snapshot={snapshot}
            prices={prices}
            highlightLabel={selected}
            viewMode={viewMode}
          />
        </section>
      </div>

      <section className="bg-(--color-surface) rounded-lg p-4 border border-(--color-border)">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Historical portfolio value</h2>
          <div className="inline-flex rounded bg-(--color-surface-alt) border border-(--color-border) text-xs">
            {HISTORY_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setHistoryRange(range)}
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  historyRange === range
                    ? "bg-(--color-primary) text-(--color-bg)"
                    : "hover:bg-(--color-border)"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {isHistoryLoading && <Spinner />}

        {isHistoryError && (
          <div className="text-xs text-red-400 flex items-center gap-2">
            Failed to load historical data.
          </div>
        )}

        {!isHistoryLoading && !isHistoryError && historicalSeries && (
          <HistoricalChart data={historicalSeries} />
        )}
      </section>
    </div>
  );
}
