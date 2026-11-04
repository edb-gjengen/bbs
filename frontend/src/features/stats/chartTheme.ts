import type { CSSProperties } from "react";

export const chartTextColor = "#f7effa";
const axisColor = "#b9a3c5";

// nivo's default categorical scheme, kept so the charts look the same after moving to Recharts
export const chartColors = ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"];
export const chartColor = (index: number) => chartColors[index % chartColors.length];

// Recharts draws plain SVG; give it the app font and fill its container
export const chartStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 13,
};

export const axisProps = {
  stroke: axisColor,
  tick: { fill: chartTextColor, fontSize: 12 },
  tickLine: { stroke: axisColor },
};

export const axisLabelStyle = { fill: chartTextColor, fontSize: 13 };

export const gridStroke = "rgba(221, 81, 127, 0.24)";

export const tooltipCursor = { fill: "rgba(255, 255, 255, 0.08)" };

export const chartTooltipStyle: CSSProperties = {
  background: "#2b1733",
  color: "#ffffff",
  padding: "9px 12px",
  border: "1px solid #dd517f",
  borderRadius: 4,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.45)",
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 13,
  textShadow: "none",
};
