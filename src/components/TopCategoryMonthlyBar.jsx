import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { monthlyValue } from "../utils/subscriptions";

const TopCategoryMonthlyBar = ({ subscriptions, topN = 8 }) => {
  const data = useMemo(() => {
    const map = {};
    subscriptions.forEach((s) => {
      const cat = s.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + monthlyValue(s);
    });
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, topN);
  }, [subscriptions, topN]);

  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim();

  const curr = subscriptions[0]?.currency || "EUR";
  const fmt = (n) => Number(n || 0).toLocaleString("de-DE");

  if (data.length === 0) {
    return <div></div>;
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow text-sm xl:text-md">
      <h3 className="font-semibold text-sm xl:text-lg mb-3">
        Top Categories By Monthly Cost
      </h3>
      <div className="w-full h-60 xl:h-[350px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => [`${fmt(v)} ${curr}`, "Total"]} />
            <Bar dataKey="total" fill={primary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCategoryMonthlyBar;
