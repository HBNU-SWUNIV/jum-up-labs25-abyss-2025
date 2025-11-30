// src/components/chart/SimpleLineChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DynamicLineChart({ data, width, height }) {
  if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;

  const keys = Object.keys(data[0]).filter((k) => k !== "name");

  return (
    <div className="chart">
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#5550bd" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke="#8884d8" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
