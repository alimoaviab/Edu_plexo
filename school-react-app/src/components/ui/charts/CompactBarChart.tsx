import React from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from "recharts";

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

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
            itemStyle={{ color: '#0f172a' }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar dataKey="value1" stackId="a" fill={color1} radius={[data[0]?.value2 ? 0 : 4, data[0]?.value2 ? 0 : 4, 4, 4]} barSize={16} />
          {data.some(d => d.value2 !== undefined) && (
            <Bar dataKey="value2" stackId="a" fill={color2} radius={[4, 4, 0, 0]} barSize={16} />
          )}
          <XAxis dataKey="label" hide />
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] text-gray-500 font-medium">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center truncate px-1">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
