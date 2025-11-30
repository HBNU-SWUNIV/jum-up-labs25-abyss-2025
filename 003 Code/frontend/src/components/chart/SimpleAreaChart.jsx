// src/components/chart/AreaChart.jsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DynamicAreaChart({ data, width, height }) {
  if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;

  const keys = Object.keys(data[0]).filter((k) => k !== "name");

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {keys.map((key, idx) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke="#8884d8"
            fill="#8884d8"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
