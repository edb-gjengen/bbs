import { useQuery } from "@apollo/client";
import { ResponsivePie } from "@nivo/pie";
import React from "react";

import { AllProductStatsDocument } from "../../types";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { chartTheme } from "./chartTheme";

type UserCount = {
  name: string;
  count: number;
};

const ProductStats = () => {
  const { data, loading } = useQuery(AllProductStatsDocument, {
    variables: { active: true },
  });

  return (
    <StatsView loading={loading}>
      <div className={styles.products}>
        {(data?.allProducts || []).map((product) => (
          <div key={product.id}>
            {product.name}
            <div className={styles.productChart}>
              <ResponsivePie
                margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
                data={product.userCounts.map((uc: UserCount) => ({
                  id: uc.name,
                  label: uc.name,
                  value: uc.count,
                }))}
                theme={chartTheme}
                arcLabelsTextColor="#17121a"
                arcLabelsSkipAngle={8}
              />
            </div>
          </div>
        ))}
      </div>
    </StatsView>
  );
};
export default ProductStats;
