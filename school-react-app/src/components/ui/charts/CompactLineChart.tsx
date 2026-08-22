import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, Area, AreaChart } from "recharts";

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

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)', fontSize: '11px', fontWeight: 'bold' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          <XAxis dataKey="label" hide />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] text-text-muted font-medium">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center truncate px-1">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
