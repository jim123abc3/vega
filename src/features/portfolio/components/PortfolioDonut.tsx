import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import type { DonutSlice } from "../utils/aggregation";
import { formatCurrency } from "../utils/format";

const COLORS = ["#0ea5e9", "#22c55e", "#6366f1", "#f97316", "#e11d48"];

interface PortfolioDonutProps {
  data: DonutSlice[];
  onSliceClick?: (label: string | null) => void;
}

export function PortfolioDonut({ data, onSliceClick }: PortfolioDonutProps) {
  return (
    <div className="w-full h-64 cursor-pointer">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="60%"
            outerRadius="90%"
            onClick={(entry) => onSliceClick?.(entry.label)}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              fontSize: 12,
            }}
            itemStyle={{ color: "var(--color-text)" }}
            formatter={(value, name) => [formatCurrency(value as number), name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
