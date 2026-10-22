import { useQuery } from "@apollo/client";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";

import { GQLError } from "../../components/GQLError";
import { UserStatsDocument } from "../../types";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { chartTheme } from "./chartTheme";

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

  return (
    <StatsView loading={loading}>
      <h3>Topp 10 etter total kjøpesum</h3>
      {users.length ? (
        <div className={styles.chart} style={{ height: Math.max(320, users.length * 44) }}>
          <ResponsiveBar
            data={users}
            keys={["total"]}
            indexBy="name"
            layout="horizontal"
            theme={chartTheme}
            margin={{ top: 10, right: 35, bottom: 40, left: 100 }}
            padding={0.3}
            enableLabel={false}
            axisBottom={{
              legend: "Kjøp totalt (kr)",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={null}
            valueFormat={(value) => `${Number(value).toLocaleString("no")} kr`}
          />
        </div>
      ) : (
        <p>Ingen kjøp å vise ennå.</p>
      )}
    </StatsView>
  );
};

export default UserStats;
