import React from "react";

import { chartTooltipStyle } from "./chartTheme";

type TooltipRow = {
  name: React.ReactNode;
  value: React.ReactNode;
  color: string;
};

export const ChartTooltip = ({ title, rows }: { title?: React.ReactNode; rows: TooltipRow[] }) => (
  <div style={chartTooltipStyle}>
    {title !== undefined && (
      <div>
        <strong>{title}</strong>
      </div>
    )}
    {rows.map((row, index) => (
      <div key={index}>
        <span style={{ background: row.color, width: 13, height: 13, display: "inline-block" }} />{" "}
        <strong>{row.value}</strong> {row.name}
      </div>
    ))}
  </div>
);
