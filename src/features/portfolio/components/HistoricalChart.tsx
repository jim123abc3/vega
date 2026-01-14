import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HistoricalPoint } from "../utils/aggregation";
import { formatCurrency, formatShortDate } from "../utils/format";

export function HistoricalChart({ data }: { data: HistoricalPoint[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            tickMargin={8}
            tickFormatter={(value: string) => formatShortDate(value)}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            tickFormatter={(v) => `${formatCurrency(v, 0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              fontSize: 12,
            }}
            itemStyle={{ color: "var(--color-text)" }}
            labelStyle={{ color: "var(--color-text-muted)" }}
            formatter={(value) => [formatCurrency(value as number), "Value"]}
            labelFormatter={(label) => String(label)}
          />
          <Line
            type="monotone"
            dataKey="valueUsd"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
