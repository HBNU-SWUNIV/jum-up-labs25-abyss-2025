// src/components/chart/SimpleBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

export default function DynamicBarChart({ data, width, height}) {
  const dataKeys = data[0] ? Object.keys(data[0]).filter((key) => key !== "name") : [];
  console.log("BarChart Data:", data);
  console.log("dataKeys",dataKeys)
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={index % 2 === 0 ? "#B3CDAD" : "#FF5F5E"}
            activeBar={<Rectangle fill="#959595" stroke="#676767" />}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  
}
