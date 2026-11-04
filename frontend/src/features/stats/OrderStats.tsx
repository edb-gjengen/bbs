import { useQuery } from "@apollo/client/react";
import { Bar, BarChart, CartesianGrid, Rectangle, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "./ChartTooltip";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { axisLabelStyle, axisProps, chartColor, chartStyle, gridStroke, tooltipCursor } from "./chartTheme";
import { OrderStatsDocument, SchemaOrderStatsByTime } from "../../types";

const days = { 1: "Mandag", 2: "Tirsdag", 3: "Onsdag", 4: "Torsdag", 5: "Fredag", 6: "Lørdag", 7: "Søndag" };

const months = {
  1: "Januar",
  2: "Februar",
  3: "Mars",
  4: "April",
  5: "Mai",
  6: "Juni",
  7: "Juli",
  8: "August",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
};

type OrderDatum = {
  id: string | number;
  label: number;
  value: number;
};

const OrderBar = ({ data }: { data: OrderDatum[] }) => (
  <div className={styles.chart}>
    <BarChart
      responsive
      style={chartStyle}
      data={data}
      barCategoryGap="5%"
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <CartesianGrid stroke={gridStroke} vertical={false} />
      <XAxis {...axisProps} dataKey="id" interval={0} angle={-35} textAnchor="end" height={60} />
      <YAxis
        {...axisProps}
        allowDecimals={false}
        label={{ value: "Ordre", angle: -90, position: "insideLeft", style: axisLabelStyle }}
      />
      <Tooltip
        cursor={tooltipCursor}
        content={({ active, payload }) => {
          const entry = payload[0];
          if (!active || !entry) return null;
          const index = data.findIndex((datum) => datum.id === entry.payload.id);
          return <ChartTooltip rows={[{ name: entry.payload.id, value: entry.value, color: chartColor(index) }]} />;
        }}
      />
      <Bar dataKey="value" shape={(props) => <Rectangle {...props} fill={chartColor(props.index)} />} />
    </BarChart>
  </div>
);

const OrderStats = () => {
  const { data, loading } = useQuery(OrderStatsDocument);

  return (
    <StatsView loading={loading}>
      <h3>Ordre per time</h3>
      <OrderBar
        data={(data?.orderStats?.hourly || []).map((stat: SchemaOrderStatsByTime) => ({
          id: `${stat.period.toString().padStart(2, "0")}:00`,
          label: stat.period,
          value: Number(stat.count),
        }))}
      />
      <h3>Ordre per ukedag</h3>
      <OrderBar
        data={(data?.orderStats?.daily || []).map((stat: SchemaOrderStatsByTime) => ({
          /* @ts-expect-error Here, stat.period can only be a key in days range. */
          id: days[stat.period],
          label: stat.period,
          value: Number(stat.count),
        }))}
      />
      <h3>Ordre per måned</h3>
      <OrderBar
        data={(data?.orderStats?.monthly || []).map((stat: SchemaOrderStatsByTime) => ({
          /* @ts-expect-error Here, stat.period can only be a key in months range. */
          id: months[stat.period],
          label: stat.period,
          value: Number(stat.count),
        }))}
      />
      <h3>Ordre per år</h3>
      <OrderBar
        data={(data?.orderStats?.yearly || []).map((stat: SchemaOrderStatsByTime) => ({
          id: stat.period,
          label: stat.period,
          value: Number(stat.count),
        }))}
      />
    </StatsView>
  );
};
export default OrderStats;
