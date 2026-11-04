import { useQuery } from "@apollo/client/react";

import { PurchasesOverTimeChart } from "./PurchasesOverTimeChart";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { ProductStatsDocument } from "../../types";

const Stats = () => {
  const { data, loading } = useQuery(ProductStatsDocument);

  return (
    <StatsView loading={loading}>
      <h2>Kjøp over tid</h2>
      <div className={styles.chart}>
        <PurchasesOverTimeChart stats={data?.productStats || []} />
      </div>
    </StatsView>
  );
};
export default Stats;
