"use client";

import {
  buildChartSeries,
  getChartAxisLabels,
  type DashboardCurrency,
} from "@/lib/features/dashboard/utils";
import type { ChartDataPoint } from "@/lib/features/dashboard/types";

type VolumeChartProps = {
  title: string;
  chartData: ChartDataPoint[];
  currency: DashboardCurrency;
};

export default function VolumeChart({
  title,
  chartData,
  currency,
}: VolumeChartProps) {
  const series = buildChartSeries(chartData);
  const maxValue = Math.max(...series, 1);
  const yLabels = getChartAxisLabels(maxValue);
  const yMax = yLabels[yLabels.length - 1] ?? maxValue;

  const width = 640;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 48, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = series.map((value, index) => {
    const x =
      padding.left +
      (series.length <= 1 ? chartWidth / 2 : (index / (series.length - 1)) * chartWidth);
    const y = padding.top + chartHeight - (value / yMax) * chartHeight;
    return { x, y, value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding.left} ${
    padding.top + chartHeight
  } L ${points[0]?.x ?? padding.left} ${padding.top + chartHeight} Z`;

  const highlightIndex = Math.max(points.length - 2, 0);
  const highlightPoint = points[highlightIndex];

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-[16px] border border-divider-color bg-background p-[24px]">
      <h3 className="text-base font-semibold">{title}</h3>

      <div className="relative mt-[16px] flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          role="img"
          aria-label={`${title} chart`}
        >
          {yLabels.map((label) => {
            const y = padding.top + chartHeight - (label / yMax) * chartHeight;

            return (
              <g key={label}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--divider-color)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--hint-text-color)"
                  fontSize="11"
                >
                  {label.toLocaleString()}
                </text>
              </g>
            );
          })}

          {series.map((_, index) => {
            const x =
              padding.left +
              (series.length <= 1
                ? chartWidth / 2
                : (index / (series.length - 1)) * chartWidth);

            return (
              <text
                key={index}
                x={x}
                y={height - 16}
                textAnchor="middle"
                fill="var(--hint-text-color)"
                fontSize="11"
              >
                {(index + 1) * 2}
              </text>
            );
          })}

          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#volumeGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {highlightPoint && (
            <>
              <line
                x1={highlightPoint.x}
                y1={padding.top}
                x2={highlightPoint.x}
                y2={padding.top + chartHeight}
                stroke="var(--divider-color)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx={highlightPoint.x}
                cy={highlightPoint.y}
                r="5"
                fill="var(--primary)"
              />
            </>
          )}
        </svg>

        <p className="absolute bottom-0 right-0 text-xs text-hint-text-color">
          Trade Volume VS Time ({currency})
        </p>
      </div>
    </div>
  );
}
