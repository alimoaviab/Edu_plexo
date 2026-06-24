import React from "react";

export interface CompactLineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  color?: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
}

export function CompactLineChart({
  data,
  color = "var(--primary)",
  height = 120,
  className = "",
  showGrid = true,
}: CompactLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-500" style={{ height }}>
        No data available
      </div>
    );
  }

  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = 100; // Will use 100% width via viewBox

  const maxValue = Math.max(1, ...data.map((d) => d.value));

  // Generate SVG path
  const pointSpacing = chartWidth / Math.max(1, data.length - 1);
  const points = data.map((d, i) => {
    const x = i * pointSpacing;
    const y = chartHeight - (d.value / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  // For the area under the line
  const areaD = `M 0,${chartHeight} L ${points.join(" L ")} L ${chartWidth},${chartHeight} Z`;

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` }}>
        
        {/* SVG Chart */}
        <div className="relative w-full h-full">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* Grid */}
            {showGrid && (
              <g className="text-gray-200" stroke="currentColor" strokeWidth="1" opacity="0.5">
                <line x1="0" y1="0" x2="100" y2="0" />
                <line x1="0" y1={chartHeight / 2} x2="100" y2={chartHeight / 2} />
                <line x1="0" y1={chartHeight} x2="100" y2={chartHeight} />
              </g>
            )}

            {/* Gradient for area */}
            <defs>
              <linearGradient id="lineChartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path
              d={areaD}
              fill="url(#lineChartGradient)"
              className="transition-all duration-500 ease-in-out"
            />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
            />

            {/* Points (optional hover targets) */}
            {data.map((d, i) => {
              const x = i * pointSpacing;
              const y = chartHeight - (d.value / maxValue) * chartHeight;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="white"
                  stroke={color}
                  strokeWidth="2"
                  className="transition-transform duration-300 hover:r-4 cursor-pointer"
                >
                  <title>{`${d.label}: ${d.value}`}</title>
                </circle>
              );
            })}
          </svg>

          {/* X-Axis Labels */}
          <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] text-gray-500">
            {data.map((item, index) => (
              <div key={index} className="flex-1 text-center truncate px-1">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
