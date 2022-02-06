import { useQuery } from "@apollo/client";
import { Bar } from "@nivo/bar";
import { Pie } from "@nivo/pie";
import React from "react";

import { OrderStatsDocument, ProductStatsDocument, OrderStatsByTime } from "../../types";
import styles from "./Stats.module.css";

type UserCount = {
  name: string;
  count: number;
};

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
export const Stats = () => {
  const { data: productData, loading: productLoading } = useQuery(ProductStatsDocument);
  const { data: orderData, loading: orderLoading } = useQuery(OrderStatsDocument);

  const loading = orderLoading || productLoading;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.stats}>
      <h2>Stats</h2>
      <h3>Produkter</h3>
      <div className={styles.products}>
        {(productData?.allProducts || []).map((product) => (
          <div key={product.id}>
            {product.name}
            <Pie
              margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
              data={product.userCounts.map((uc: UserCount) => ({
                id: uc.name,
                label: uc.name,
                value: uc.count,
              }))}
              width={400}
              height={300}
            />
          </div>
        ))}
      </div>
      <h3>Ordre per time</h3>
      <Bar
        data={(orderData?.orderStats?.hourly || []).map((stat: OrderStatsByTime) => ({
          id: `${stat.period.toString().padStart(2, "0")}:00`,
          label: stat.period,
          value: stat.count,
        }))}
        margin={{ left: 60, bottom: 40 }}
        width={1200}
        height={400}
        colorBy="indexValue"
        enableLabel={false}
        tooltipLabel={(d) => d.id.toString()}
        axisLeft={{ legend: "Ordre", legendPosition: "middle", legendOffset: -50 }}
      />
      <h3>Ordre per ukedag</h3>
      <Bar
        data={(orderData?.orderStats?.dayly || []).map((stat: OrderStatsByTime) => ({
          /* @ts-expect-error Here, stat.period can only be a key in days range. */
          id: days[stat.period],
          label: stat.period,
          value: stat.count,
        }))}
        margin={{ left: 60, bottom: 40 }}
        width={1200}
        height={400}
        colorBy="indexValue"
        enableLabel={false}
        tooltipLabel={(d) => d.id.toString()}
        axisLeft={{ legend: "Ordre", legendPosition: "middle", legendOffset: -50 }}
      />
      <h3>Ordre per måned</h3>
      <Bar
        data={(orderData?.orderStats?.monthly || []).map((stat: OrderStatsByTime) => ({
          /* @ts-expect-error Here, stat.period can only be a key in months range. */
          id: months[stat.period],
          label: stat.period,
          value: stat.count,
        }))}
        margin={{ left: 60, bottom: 40 }}
        width={1200}
        height={400}
        colorBy="indexValue"
        enableLabel={false}
        tooltipLabel={(d) => d.id.toString()}
        axisLeft={{ legend: "Ordre", legendPosition: "middle", legendOffset: -50 }}
      />
      <h3>Ordre per år</h3>
      <Bar
        data={(orderData?.orderStats?.yearly || []).map((stat: OrderStatsByTime) => ({
          id: stat.period,
          label: stat.period,
          value: stat.count,
        }))}
        margin={{ left: 60, bottom: 40 }}
        width={1200}
        height={400}
        colorBy="indexValue"
        enableLabel={false}
        tooltipLabel={(d) => d.id.toString()}
        axisLeft={{ legend: "Ordre", legendPosition: "middle", legendOffset: -50 }}
      />
    </div>
  );
};
