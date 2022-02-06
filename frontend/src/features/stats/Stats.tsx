import { useQuery } from "@apollo/client";
import { Pie } from "@nivo/pie";
import React from "react";

import { ProductStatsDocument } from "../../types";
import styles from "./Stats.module.css";

type UserCount = {
  name: string;
  count: number;
};

export const Stats = () => {
  const { data, loading } = useQuery(ProductStatsDocument);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.stats}>
      <h2>Stats</h2>
      <h3>Produkter</h3>
      <div className={styles.products}>
        {(data?.allProducts || []).map((product) => {
          return (
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
          );
        })}
      </div>
      <h3>Hourly</h3>
      <h3>Daily</h3>
      <h3>Monthly</h3>
      <h3>Yearly</h3>
    </div>
  );
};
