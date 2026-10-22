import { useQuery } from "@apollo/client";
import { Line } from "@nivo/line";
import React from "react";

import { ProductStatsDocument } from "../../types";
import { StatsView } from "./StatsView";

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
      <Line
        data={series}
        width={1000}
        height={400}
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
          legendOffset: -40,
        }}
        useMesh
        pointLabelYOffset={0}
        tooltip={({ point }) => (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
            }}
          >
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
    </StatsView>
  );
};
export default Stats;
