import type { CSSProperties } from "react";

export const chartTextColor = "#f7effa";
const darkLabelColor = "#17121a";

// sRGB relative luminance, as in WCAG's contrast ratio
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Dark or white, whichever reads better on text drawn over the given colour
export const labelColorOn = (fill: string) => {
  const background = luminance(fill);
  const contrastWith = (text: string) => {
    const [hi, lo] = [luminance(text), background].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  };
  return contrastWith(darkLabelColor) >= contrastWith("#ffffff") ? darkLabelColor : "#ffffff";
};
const axisColor = "#b9a3c5";

// Categorical colours for the dark background. The order matters: each colour stays easy to tell
// apart from the next one, also with colour blindness, so neighbouring bars, slices and bands work.
// Colours repeat past the eighth; where that would put two of the same side by side, fold the rest
// into one otherColor group instead.
export const chartColors = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];
export const chartColor = (index: number) => chartColors[index % chartColors.length];

// For a group of "the rest", e.g. "Andre"; distinct from the last colour it follows
export const otherColor = "#a89cae";

// The darkest background colour, used to separate touching bands
export const chartSurfaceColor = "#0e0610";

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
