import { useQuery } from "@apollo/client";
import { ResponsiveLine } from "@nivo/line";
import React from "react";

import { ProductStatsDocument } from "../../types";
import styles from "./Stats.module.css";
import { StatsView } from "./StatsView";
import { chartTheme, chartTooltipStyle } from "./chartTheme";

const Stats = () => {
  const { data, loading } = useQuery(ProductStatsDocument);

  const series = (data?.productStats || []).map(({ productName: id, data }) => ({
    id,
    data: data.map((point, index, points) => ({
      x: point.x,
      y: point.y + (points[index - 1]?.y || 0),
    })),
  }));

  return (
    <StatsView loading={loading}>
      <h2>Kjøp over tid</h2>
      <div className={styles.chart}>
        <ResponsiveLine
          data={series}
          theme={chartTheme}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "day",
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: "linear",
            stacked: false,
          }}
          axisLeft={{
            legend: "Purchases",
            legendOffset: 12,
          }}
          axisBottom={{
            format: "%b %Y",
            legend: "Date",
            legendPosition: "middle",
            legendOffset: -20,
          }}
          useMesh
          pointLabelYOffset={0}
          tooltip={({ point }) => (
            <div style={chartTooltipStyle}>
              <div>
                <strong>{point.data.xFormatted}</strong>
              </div>
              <div>
                <span style={{ background: point.seriesColor, width: 13, height: 13, display: "inline-block" }} />{" "}
                <strong>{String(point.data.yFormatted)}</strong> {point.seriesId}
              </div>
            </div>
          )}
        />
      </div>
    </StatsView>
  );
};
export default Stats;
