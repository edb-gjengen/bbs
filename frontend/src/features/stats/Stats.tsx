import { useQuery } from "@apollo/client";
import { Pie } from "@nivo/pie";
import React from "react";

import { ProductStatsDocument } from "../../types";
import styles from "./Stats.module.css";

export const Stats = () => {
  const { data, loading } = useQuery(ProductStatsDocument, { variables: { active: true } });
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.stats}>
      <h2>Stats</h2>
      <h3>Produkter</h3>
      <div className={styles.products}>
        {data.allProducts.map((product) => {
          return (
            <div key={product.id}>
              {product.name}
              <Pie
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                data={product.userCounts.map((uc) => ({
                  id: uc.name,
                  label: uc.name,
                  value: uc.count,
                }))}
                width={400}
                height={400}
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
