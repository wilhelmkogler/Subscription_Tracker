import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const addMonths = (date, n) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
};

const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

const ActiveSubsLineChart = ({ subscriptions }) => {
  if (!subscriptions || subscriptions.length === 0) {
    return null;
  }

  const data = useMemo(() => {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), 1);
    const points = [];

    for (let i = 10; i >= 0; i--) {
      const monthDate = addMonths(base, -(i * 6));
      const eom = endOfMonth(monthDate);

      const label = `${monthDate.toLocaleString(undefined, {
        month: "short",
      })} ${monthDate.getFullYear()}`;

      const activeCount = subscriptions.reduce((acc, s) => {
        const start = new Date(s.startDate);
        return acc + (start <= eom ? 1 : 0);
      }, 0);

      points.push({ label, value: activeCount });
    }

    return points;
  }, [subscriptions]);

  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim();

  return (
    <div className="rounded-2xl bg-white p-4 shadow text-xs xl:text-md">
      <h3 className="text-sm xl:text-lg font-semibold mb-3">
        Active Subscriptions In The Last 5 Years
      </h3>
      <div className="w-full h-72">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={primary}
              strokeWidth={5}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveSubsLineChart;
