import React from "react";

export interface CompactBarChartProps {
  data: Array<{
    label: string;
    value1: number;
    value2?: number; // Optional secondary value (e.g. absent)
  }>;
  color1?: string;
  color2?: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
}

export function CompactBarChart({
  data,
  color1 = "var(--primary)",
  color2 = "var(--danger)",
  height = 120,
  className = "",
  showGrid = true,
}: CompactBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-500" style={{ height }}>
        No data available
      </div>
    );
  }

  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = Math.max(
    1,
    ...data.map((d) => (d.value2 ? d.value1 + d.value2 : d.value1))
  );

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <div className="absolute inset-0 flex items-end justify-between" style={{ padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` }}>
        {/* Grid Lines */}
        {showGrid && (
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-20" style={{ paddingBottom: padding.bottom }}>
            <div className="border-b border-gray-300 w-full" />
            <div className="border-b border-gray-300 w-full" />
            <div className="border-b border-gray-300 w-full" />
          </div>
        )}

        {/* Bars */}
        {data.map((item, index) => {
          const v1Height = (item.value1 / maxValue) * chartHeight;
          const v2Height = item.value2 ? (item.value2 / maxValue) * chartHeight : 0;
          
          return (
            <div key={index} className="relative flex flex-col items-center justify-end group flex-1 px-1 sm:px-2 z-10" style={{ height: chartHeight }}>
              {/* Tooltip */}
              <div className="absolute -top-10 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                <div className="font-medium">{item.label}</div>
                <div>{item.value1} {item.value2 !== undefined && ` / ${item.value2}`}</div>
              </div>
              
              {/* Stacked Bar */}
              <div className="w-full max-w-[24px] flex flex-col justify-end overflow-hidden rounded-t-sm" style={{ height: chartHeight }}>
                {item.value2 !== undefined && (
                  <div
                    className="w-full transition-all duration-500 ease-in-out hover:brightness-110"
                    style={{ height: `${v2Height}px`, backgroundColor: color2 }}
                  />
                )}
                <div
                  className="w-full transition-all duration-500 ease-in-out hover:brightness-110"
                  style={{ height: `${v1Height}px`, backgroundColor: color1, borderTopLeftRadius: item.value2 ? 0 : 2, borderTopRightRadius: item.value2 ? 0 : 2 }}
                />
              </div>

              {/* X-Axis Label */}
              <div className="absolute -bottom-5 text-[10px] text-gray-500 truncate w-full text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
