// // src/components/chart/PieChart.jsx
// import React from "react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";

// // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#AA99FF"];
// const COLORS = ["#A4B465", "#c2d381", "#F0BB78", "#FFE99A",  "#eae0c6", "#7f915c"];


// export default function DynamicPieChart({ data, width, height }) {
//   return (
//     <div style={{ width: '100%', height: '100%' }}>
//       <PieChart width={width} height={height}>
//         <Pie
//           data={data}
//           dataKey="value"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           outerRadius={Math.min(width, height) / 2.5}
//           fill="#8884d8"
//           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//         >
//           {data.map((_, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>
//     </div>
//   );
// }


// src/components/chart/PieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#AA99FF"];
const COLORS = ["#A4B465", "#c2d381", "#F0BB78", "#FFE99A",  "#eae0c6", "#7f915c"];


export default function DynamicPieChart({ data, width, height }) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={Math.min(width, height) / 2.5}
          fill="#8884d8"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
