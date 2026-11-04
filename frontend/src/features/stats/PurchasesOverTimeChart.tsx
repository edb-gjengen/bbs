import { addMonths, format, parseISO, startOfMonth } from "date-fns";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "./ChartTooltip";
import { axisLabelStyle, axisProps, chartColor, chartStyle, chartTextColor, gridStroke } from "./chartTheme";

type ProductOrderStat = {
  productName: string;
  data: { x: string; y: number }[];
};

type Row = {
  date: number;
  // Keyed by product name; a product has no value before its first purchase
  totals: Record<string, number>;
};

// One row per day with each product's running total. Products without purchases that day are left
// out of the row, and connectNulls draws their line straight to the next day they have one.
const toRows = (stats: ProductOrderStat[]): Row[] => {
  const rows = new Map<number, Row>();
  for (const { productName, data } of stats) {
    let total = 0;
    for (const point of data) {
      total += point.y;
      const date = parseISO(point.x).getTime();
      const row = rows.get(date) ?? { date, totals: {} };
      row.totals[productName] = total;
      rows.set(date, row);
    }
  }
  return [...rows.values()].sort((a, b) => a.date - b.date);
};

// A tick on the first of each month, so each month is labelled once. Spans too short to have
// two of them get Recharts' own ticks, labelled with the full date.
const monthTicks = (rows: Row[]): number[] | undefined => {
  if (!rows.length) return undefined;
  const ticks = [];
  for (
    let month = startOfMonth(addMonths(rows[0].date, 1));
    month.getTime() <= rows[rows.length - 1].date;
    month = addMonths(month, 1)
  ) {
    ticks.push(month.getTime());
  }
  return ticks.length >= 2 ? ticks : undefined;
};

export const PurchasesOverTimeChart = ({ stats }: { stats: ProductOrderStat[] }) => {
  const rows = toRows(stats);
  const ticks = monthTicks(rows);
  return (
    <LineChart responsive style={chartStyle} data={rows} margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
      <CartesianGrid stroke={gridStroke} />
      <XAxis
        {...axisProps}
        dataKey="date"
        type="number"
        scale="time"
        domain={["dataMin", "dataMax"]}
        ticks={ticks}
        tickFormatter={(date: number) => format(date, ticks ? "MMM yyyy" : "yyyy-MM-dd")}
        label={{ value: "Date", position: "bottom", offset: 10, style: axisLabelStyle }}
      />
      <YAxis
        {...axisProps}
        allowDecimals={false}
        label={{ value: "Purchases", angle: -90, position: "insideLeft", style: axisLabelStyle }}
      />
      <Tooltip
        cursor={{ stroke: chartTextColor, strokeOpacity: 0.4 }}
        content={({ active, payload, label }) =>
          active && payload.length ? (
            <ChartTooltip
              title={format(Number(label), "yyyy-MM-dd")}
              rows={payload
                .filter((entry) => entry.value !== undefined)
                .map((entry) => ({ name: entry.name, value: entry.value, color: String(entry.color) }))}
            />
          ) : null
        }
      />
      <Legend
        verticalAlign="top"
        formatter={(value) => <span style={{ color: chartTextColor }}>{value}</span>}
        wrapperStyle={{ paddingBottom: 8 }}
      />
      {stats.map(({ productName }, index) => (
        <Line
          key={productName}
          name={productName}
          dataKey={(row: Row) => row.totals[productName]}
          stroke={chartColor(index)}
          strokeWidth={2}
          dot={{ r: 3, fill: chartColor(index) }}
          connectNulls
        />
      ))}
    </LineChart>
  );
};
