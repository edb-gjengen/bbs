export const chartTheme = {
  background: "transparent",
  text: {
    fill: "#f7effa",
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: 13,
    textShadow: "none",
  },
  axis: {
    domain: {
      line: { stroke: "#b9a3c5", strokeWidth: 1 },
    },
    ticks: {
      line: { stroke: "#b9a3c5", strokeWidth: 1 },
      text: { fill: "#f7effa", fontSize: 12, textShadow: "none" },
    },
    legend: {
      text: { fill: "#f7effa", fontSize: 13, textShadow: "none" },
    },
  },
  grid: {
    line: { stroke: "rgba(221, 81, 127, 0.24)", strokeWidth: 1 },
  },
  legends: {
    text: { fill: "#f7effa", fontSize: 12, textShadow: "none" },
    title: {
      text: { fill: "#f7effa", fontSize: 13, textShadow: "none" },
    },
  },
  labels: {
    text: {
      fill: "#ffffff",
      fontSize: 13,
      textShadow: "none",
    },
  },
  tooltip: {
    container: {
      background: "#2b1733",
      color: "#ffffff",
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 13,
      border: "1px solid #dd517f",
      borderRadius: 4,
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.45)",
    },
  },
};

export const chartTooltipStyle = {
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
