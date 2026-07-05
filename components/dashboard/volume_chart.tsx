"use client";

import {
  buildChartPoints,
  formatChartAxisLabel,
  formatCurrencyAmount,
  getChartAxisLabels,
  type DashboardCurrency,
} from "@/lib/features/dashboard/utils";
import type { ChartDataPoint } from "@/lib/features/dashboard/types";
import { useMemo, useState } from "react";

type VolumeChartProps = {
  title: string;
  chartData: ChartDataPoint[];
  currency: DashboardCurrency;
};

type PlotPoint = {
  x: number;
  y: number;
  volume: number;
  label: string;
  dateKey: string;
};

export default function VolumeChart({
  title,
  chartData,
  currency,
}: VolumeChartProps) {
  const points = useMemo(
    () => buildChartPoints(chartData, currency),
    [chartData, currency],
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activeIndex =
    selectedIndex ?? (points.length > 0 ? points.length - 1 : null);

  const maxValue = Math.max(...points.map((point) => point.volume), 1);
  const yLabels = getChartAxisLabels(maxValue);
  const yMax = yLabels[yLabels.length - 1] ?? maxValue;
  const hasData = points.length > 0;

  const width = 640;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 48, left: 72 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const plotPoints: PlotPoint[] = points.map((point, index) => {
    const x =
      padding.left +
      (points.length <= 1
        ? chartWidth / 2
        : (index / (points.length - 1)) * chartWidth);
    const y =
      padding.top + chartHeight - (point.volume / yMax) * chartHeight;

    return {
      x,
      y,
      volume: point.volume,
      label: point.label,
      dateKey: point.dateKey,
    };
  });

  const linePath = plotPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    plotPoints.length > 0
      ? `${linePath} L ${plotPoints[plotPoints.length - 1]?.x ?? padding.left} ${
          padding.top + chartHeight
        } L ${plotPoints[0]?.x ?? padding.left} ${padding.top + chartHeight} Z`
      : "";

  const activePoint =
    activeIndex !== null ? plotPoints[activeIndex] : undefined;

  const xLabelInterval = Math.max(1, Math.ceil(points.length / 6));

  const handlePointerMove = (event: React.PointerEvent<SVGRectElement>) => {
    if (plotPoints.length === 0) {
      return;
    }

    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) {
      return;
    }

    const bounds = svg.getBoundingClientRect();
    const scaleX = width / bounds.width;
    const pointerX = (event.clientX - bounds.left) * scaleX;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    plotPoints.forEach((point, index) => {
      const distance = Math.abs(point.x - pointerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setSelectedIndex(nearestIndex);
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-[16px] border border-divider-color bg-background p-[24px]">
      <div className="flex flex-row items-start justify-between gap-[12px]">
        <h3 className="text-base font-semibold">{title}</h3>
        {activePoint && (
          <div className="text-right">
            <p className="text-sm font-semibold text-text-color">
              {activePoint.label}
            </p>
            <p className="text-sm text-hint-text-color">
              {formatCurrencyAmount(activePoint.volume, currency)}
            </p>
          </div>
        )}
      </div>

      <div className="relative mt-[16px] flex-1">
        {!hasData && (
          <p className="absolute inset-0 z-10 flex items-center justify-center text-sm text-hint-text-color">
            No transaction data for this period
          </p>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full touch-none"
          role="img"
          aria-label={`${title} chart`}
          preserveAspectRatio="xMidYMid meet"
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
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--hint-text-color)"
                  fontSize="10"
                >
                  {formatChartAxisLabel(label, currency)}
                </text>
              </g>
            );
          })}

          {points.map((point, index) => {
            if (index % xLabelInterval !== 0 && index !== points.length - 1) {
              return null;
            }

            const x = plotPoints[index]?.x ?? padding.left;

            return (
              <text
                key={point.dateKey}
                x={x}
                y={height - 16}
                textAnchor="middle"
                fill="var(--hint-text-color)"
                fontSize="11"
              >
                {point.label}
              </text>
            );
          })}

          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {hasData && (
            <>
              <path d={areaPath} fill="url(#volumeGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {activePoint && (
                <>
                  <line
                    x1={activePoint.x}
                    y1={padding.top}
                    x2={activePoint.x}
                    y2={padding.top + chartHeight}
                    stroke="var(--divider-color)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="5"
                    fill="var(--primary)"
                  />
                </>
              )}

              {plotPoints.map((point, index) => (
                <circle
                  key={point.dateKey}
                  cx={point.x}
                  cy={point.y}
                  r={activeIndex === index ? 6 : 4}
                  fill={
                    activeIndex === index
                      ? "var(--primary)"
                      : "var(--background)"
                  }
                  stroke="var(--primary)"
                  strokeWidth="2"
                  className="pointer-events-none"
                />
              ))}

              <rect
                x={padding.left}
                y={padding.top}
                width={chartWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-crosshair"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerMove}
                onPointerLeave={() => setSelectedIndex(null)}
              />
            </>
          )}
        </svg>

        <p className="absolute bottom-0 right-0 text-xs text-hint-text-color">
          Trade volume vs time
        </p>
      </div>
    </div>
  );
}
