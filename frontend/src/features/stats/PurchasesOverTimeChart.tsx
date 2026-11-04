import { addMonths, format, parseISO, startOfMonth } from "date-fns";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "./ChartTooltip";
import {
  axisLabelStyle,
  axisProps,
  chartStyle,
  chartSurfaceColor,
  chartTextColor,
  gridStroke,
  chartColors,
  otherColor,
} from "./chartTheme";

type ProductOrderStat = {
  productName: string;
  data: { x: string; y: number }[];
};

// One band of the stack: a product, or all the remaining products together
type Band = {
  name: string;
  color: string;
};

type Row = {
  date: number;
  // Units sold up to and including this day, one entry per band, bottom band first
  values: number[];
  total: number;
};

// The best sellers each get a band, largest at the bottom. The rest are added up in one band on top,
// since the palette has no more colours that stay distinguishable next to each other.
const toChart = (stats: ProductOrderStat[]): { bands: Band[]; rows: Row[] } => {
  const products = stats
    .map(({ productName, data }) => {
      let total = 0;
      const totalByDate = new Map<number, number>();
      for (const point of data) {
        total += point.y;
        totalByDate.set(parseISO(point.x).getTime(), total);
      }
      return { productName, totalByDate, total };
    })
    .sort((a, b) => b.total - a.total);

  const shown = products.slice(0, chartColors.length);
  const others = products.slice(shown.length);
  const bands = shown.map(({ productName }, index) => ({ name: productName, color: chartColors[index] }));
  if (others.length) {
    bands.push({ name: `Andre (${others.length} ${others.length === 1 ? "vare" : "varer"})`, color: otherColor });
  }

  // A product's running total carries over to the days it sold nothing
  const dates = [...new Set(products.flatMap(({ totalByDate }) => [...totalByDate.keys()]))].sort((a, b) => a - b);
  const current = products.map(() => 0);
  const rows = dates.map((date) => {
    products.forEach(({ totalByDate }, index) => {
      current[index] = totalByDate.get(date) ?? current[index];
    });
    const values = current.slice(0, shown.length);
    if (others.length) values.push(current.slice(shown.length).reduce((sum, value) => sum + value, 0));
    return { date, values, total: values.reduce((sum, value) => sum + value, 0) };
  });

  return { bands, rows };
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

const percent = (value: number, total: number) => `${total ? Math.round((value / total) * 100) : 0} %`;

// Total units sold over time, stacked by product, so each band's thickness is that product's share
export const PurchasesOverTimeChart = ({ stats }: { stats: ProductOrderStat[] }) => {
  const { bands, rows } = toChart(stats);
  const ticks = monthTicks(rows);
  return (
    <AreaChart responsive style={chartStyle} data={rows} margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
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
        content={({ active, payload }) => {
          const row: Row | undefined = payload[0]?.payload;
          if (!active || !row) return null;
          // Top band first, as in the chart
          const bandRows = bands
            .map((band, index) => ({
              name: band.name,
              value: `${row.values[index]} (${percent(row.values[index], row.total)})`,
              color: band.color,
            }))
            .reverse();
          return (
            <ChartTooltip
              title={format(row.date, "yyyy-MM-dd")}
              rows={[{ name: "totalt", value: row.total }, ...bandRows]}
            />
          );
        }}
      />
      <Legend
        verticalAlign="top"
        wrapperStyle={{ paddingBottom: 8 }}
        content={() => (
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "4px 16px",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {bands.map((band) => (
              <li key={band.name} style={{ color: chartTextColor }}>
                <span style={{ background: band.color, width: 12, height: 12, display: "inline-block" }} /> {band.name}
              </li>
            ))}
          </ul>
        )}
      />
      {bands.map((band, index) => (
        <Area
          key={band.name}
          name={band.name}
          dataKey={(row: Row) => row.values[index]}
          stackId="units"
          type="linear"
          fill={band.color}
          fillOpacity={1}
          // A thin line in the background colour keeps touching bands apart
          stroke={chartSurfaceColor}
          strokeWidth={1}
          activeDot={false}
        />
      ))}
    </AreaChart>
  );
};
