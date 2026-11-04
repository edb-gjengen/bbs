import { useQuery } from "@apollo/client/react";
import { Pie, PieChart, PieLabelRenderProps, Sector, Tooltip } from "recharts";

import { ChartTooltip } from "./ChartTooltip";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { chartColor, chartStyle, chartTextColor, labelColorOn } from "./chartTheme";
import { AllProductStatsDocument } from "../../types";

type UserCount = {
  name: string;
  count: number;
};

const RADIAN = Math.PI / 180;
// Slices narrower than this are too small to hold their count
const MIN_VALUE_LABEL_ANGLE = 8;

// The user's name goes outside the slice, at the end of its label line, and the count inside it
const renderLabel = ({
  cx,
  cy,
  midAngle = 0,
  innerRadius,
  outerRadius,
  percent = 0,
  x,
  y,
  textAnchor,
  name,
  value,
  index,
}: PieLabelRenderProps) => {
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) / 2;
  return (
    <g>
      <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" fill={chartTextColor}>
        {name}
      </text>
      {percent * 360 >= MIN_VALUE_LABEL_ANGLE && (
        <text
          x={Number(cx) + radius * Math.cos(-midAngle * RADIAN)}
          y={Number(cy) + radius * Math.sin(-midAngle * RADIAN)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={labelColorOn(chartColor(index))}
        >
          {value}
        </text>
      )}
    </g>
  );
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
              <PieChart responsive style={chartStyle} margin={{ top: 30, right: 50, bottom: 30, left: 50 }}>
                <Pie
                  data={product.userCounts as UserCount[]}
                  dataKey="count"
                  nameKey="name"
                  outerRadius="80%"
                  label={renderLabel}
                  labelLine={{ stroke: "#b9a3c5" }}
                  shape={(props) => <Sector {...props} fill={chartColor(props.index)} />}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    const entry = payload[0];
                    if (!active || !entry) return null;
                    const index = (product.userCounts as UserCount[]).findIndex((uc) => uc.name === entry.name);
                    return <ChartTooltip rows={[{ name: entry.name, value: entry.value, color: chartColor(index) }]} />;
                  }}
                />
              </PieChart>
            </div>
          </div>
        ))}
      </div>
    </StatsView>
  );
};
export default ProductStats;
