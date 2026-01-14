import type { Asset, PortfolioSnapshot, PricePoint } from "../../../api/types";
import { formatCurrency } from "../utils/format";

interface PositionsTableProps {
  assets: Asset[];
  snapshot: PortfolioSnapshot;
  prices: PricePoint[];
  highlightLabel: string | null;
}

export function PositionsTable({
  assets,
  snapshot,
  prices,
  highlightLabel,
}: PositionsTableProps) {
  const priceMap = new Map<string, number>();
  prices.forEach((p) => {
    priceMap.set(`${p.asset}-${p.asOf}`, p.priceUsd);
  });

  const assetMeta = new Map<string, Asset>();
  assets.forEach((a) => assetMeta.set(a.symbol, a));

  const rows = snapshot.positions.map((pos) => {
    const meta = assetMeta.get(pos.asset);
    const price = priceMap.get(`${pos.asset}-${snapshot.asOf}`) ?? 0;
    const value = pos.quantity * price;

    const isHighlighted =
      highlightLabel != null &&
      (highlightLabel === pos.asset || highlightLabel === meta?.class);

    return {
      symbol: pos.asset,
      name: meta?.name ?? pos.asset,
      class: meta?.class ?? "other",
      quantity: pos.quantity,
      price,
      value,
      isHighlighted,
    };
  });

  const totalValue = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead className="bg-(--color-surface-alt)">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Asset</th>
            <th className="px-3 py-2 text-left font-medium">Class</th>
            <th className="px-3 py-2 text-right font-medium">Quantity</th>
            <th className="px-3 py-2 text-right font-medium">Price</th>
            <th className="px-3 py-2 text-right font-medium">Value</th>
            <th className="px-3 py-2 text-right font-medium">% of total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pct = totalValue > 0 ? (row.value / totalValue) * 100 : 0;
            return (
              <tr
                key={row.symbol}
                className={
                  row.isHighlighted
                    ? "bg-(--color-surface-alt)"
                    : "border-t border-(--color-border)"
                }
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.symbol}{" "}
                  <span className="text-(--color-text-muted)">
                    ({row.name})
                  </span>
                </td>
                <td className="px-3 py-2">{row.class}</td>
                <td className="px-3 py-2 text-right">
                  {row.quantity.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCurrency(row.price)}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCurrency(row.price)}
                </td>
                <td className="px-3 py-2 text-right">{pct.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-(--color-border)">
            <td className="px-3 py-2 font-medium" colSpan={4}>
              Total
            </td>
            <td className="px-3 py-2 text-right font-medium">
              {formatCurrency(totalValue)}
            </td>
            <td className="px-3 py-2" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
