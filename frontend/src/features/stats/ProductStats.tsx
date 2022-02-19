import { useQuery } from "@apollo/client";
import { Pie } from "@nivo/pie";
import React from "react";

import { AllProductStatsDocument } from "../../types";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";

type UserCount = {
  name: string;
  count: number;
};

export const ProductStats = () => {
  const { data, loading } = useQuery(AllProductStatsDocument, {
    variables: { active: true },
  });

  return (
    <StatsView loading={loading}>
      <div className={styles.products}>
        {(data?.allProducts || []).map((product) => (
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
    </StatsView>
  );
};
