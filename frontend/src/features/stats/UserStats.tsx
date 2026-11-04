import { useQuery } from "@apollo/client/react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "./ChartTooltip";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { axisLabelStyle, axisProps, chartColor, chartStyle, gridStroke, tooltipCursor } from "./chartTheme";
import { GQLError } from "../../components/GQLError";
import { UserStatsDocument } from "../../types";

const UserStats = () => {
  const { data, loading, error } = useQuery(UserStatsDocument);

  if (error) return <GQLError error={error} />;

  const users = (data?.allUsers || [])
    .filter((user) => Number(user.profile?.orderSumTotal || 0) > 0)
    .map((user) => ({
      name: `${user.firstName}${user.lastName ? ` ${user.lastName[0]}.` : ""}`,
      total: Number(user.profile?.orderSumTotal || 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const formatKroner = (value: number) => `${value.toLocaleString("no")} kr`;

  return (
    <StatsView loading={loading}>
      <h3>Topp 10 etter total kjøpesum</h3>
      {users.length ? (
        <div className={styles.chart} style={{ height: Math.max(320, users.length * 44) }}>
          <BarChart
            responsive
            style={chartStyle}
            data={users}
            layout="vertical"
            barCategoryGap="15%"
            margin={{ top: 10, right: 35, bottom: 30, left: 10 }}
          >
            <CartesianGrid stroke={gridStroke} horizontal={false} />
            <XAxis
              {...axisProps}
              type="number"
              label={{ value: "Kjøp totalt (kr)", position: "bottom", offset: 10, style: axisLabelStyle }}
            />
            <YAxis {...axisProps} type="category" dataKey="name" width={100} tickLine={false} />
            <Tooltip
              cursor={tooltipCursor}
              content={({ active, payload }) => {
                const entry = payload[0];
                if (!active || !entry) return null;
                return (
                  <ChartTooltip
                    rows={[
                      { name: entry.payload.name, value: formatKroner(entry.payload.total), color: chartColor(0) },
                    ]}
                  />
                );
              }}
            />
            <Bar dataKey="total" fill={chartColor(0)} />
          </BarChart>
        </div>
      ) : (
        <p>Ingen kjøp å vise ennå.</p>
      )}
    </StatsView>
  );
};

export default UserStats;
