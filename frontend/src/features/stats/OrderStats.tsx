import { useQuery } from "@apollo/client";
import { Bar, BarDatum } from "@nivo/bar";
import React from "react";

import { OrderStatsDocument, OrderStatsByTime } from "../../types";
import { StatsView } from "./StatsView";

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

const OrderBar = ({ data }: { data: BarDatum[] }) => (
  <Bar
    data={data}
    margin={{ left: 60, bottom: 40 }}
    width={1200}
    height={400}
    colorBy="indexValue"
    enableLabel={false}
    tooltipLabel={(d) => d.id.toString()}
    axisLeft={{ legend: "Ordre", legendPosition: "middle", legendOffset: -50 }}
  />
);

const OrderStats = () => {
  const { data, loading } = useQuery(OrderStatsDocument);

  return (
    <StatsView loading={loading}>
      <h3>Ordre per time</h3>
      <OrderBar
        data={(data?.orderStats?.hourly || []).map((stat: OrderStatsByTime) => ({
          id: `${stat.period.toString().padStart(2, "0")}:00`,
          label: stat.period,
          value: stat.count,
        }))}
      />
      <h3>Ordre per ukedag</h3>
      <OrderBar
        data={(data?.orderStats?.daily || []).map((stat: OrderStatsByTime) => ({
          /* @ts-expect-error Here, stat.period can only be a key in days range. */
          id: days[stat.period],
          label: stat.period,
          value: stat.count,
        }))}
      />
      <h3>Ordre per måned</h3>
      <OrderBar
        data={(data?.orderStats?.monthly || []).map((stat: OrderStatsByTime) => ({
          /* @ts-expect-error Here, stat.period can only be a key in months range. */
          id: months[stat.period],
          label: stat.period,
          value: stat.count,
        }))}
      />
      <h3>Ordre per år</h3>
      <OrderBar
        data={(data?.orderStats?.yearly || []).map((stat: OrderStatsByTime) => ({
          id: stat.period,
          label: stat.period,
          value: stat.count,
        }))}
      />
    </StatsView>
  );
};
export default OrderStats;
