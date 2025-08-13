// src/components/CategoryDistributionChart.jsx
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA46BE",
  "#FF6699",
];

const RADIAN = Math.PI / 180;
// Egyedi label a szelet belsejébe
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${(percent * 1).toFixed(1)} %`}
    </text>
  );
};

const CategoryDistributionChart = ({ subscriptions }) => {
  const data = useMemo(() => {
    const counts = {};
    subscriptions.forEach((s) => {
      const cat = s.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = Object.values(counts).reduce((sum, v) => sum + v, 0);

    return Object.keys(counts).map((cat) => ({
      name: cat,
      value: counts[cat],
      percent: ((counts[cat] / total) * 100).toFixed(1),
    }));
  }, [subscriptions]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="text-xs xl:text-md">
      <h2 className="text-sm xl:text-lg font-semibold mb-3">Category Distribution</h2>
      <div className="w-full h-70">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} (${props.payload.percent}%)`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
