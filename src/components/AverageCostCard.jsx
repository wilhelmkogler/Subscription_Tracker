// src/components/AverageCostCard.jsx
import React, { useMemo } from "react";
import { monthlyValue } from "../utils/subscriptions";

const AverageCostCard = ({ subscriptions }) => {
  const { avgMonthlyPerSub, totalMonthly, count } = useMemo(() => {
    const count = subscriptions.length || 0;
    const totalMonthly = subscriptions.reduce(
      (sum, s) => sum + monthlyValue(s),
      0
    );
    const avgMonthlyPerSub = count ? totalMonthly / count : 0;
    return { avgMonthlyPerSub, totalMonthly, count };
  }, [subscriptions]);

  const curr = subscriptions[0]?.currency || "EUR";

  // 🔹 Szám formázása szóközzel ezres tagolással
  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-[0.8rem] xl:text-sm text-gray-500 mb-2">
          Total Subscriptions
        </p>
        <p className="text-xl xl:text-2xl text-primary font-bold">
          {formatNumber(count)}
        </p>
      </div>
      <div>
        <p className="text-[0.8rem] xl:text-sm text-gray-500 mb-2">
          Average Subscription
        </p>
        <p className="text-xl xl:text-2xl text-primary font-bold">
          {formatNumber(Math.round(avgMonthlyPerSub))} {curr}
        </p>
      </div>

      <div>
        <p className="text-[0.8rem] xl:text-sm text-gray-500 mb-2">Monthly Expenses</p>
        <p className="text-xl xl:text-2xl text-primary font-bold">
          {formatNumber(Math.round(totalMonthly))} {curr}
        </p>
      </div>
      <div>
        <p className="text-[0.8rem] xl:text-sm text-gray-500 mb-2">Yearly Expenses</p>
        <p className="text-xl xl:text-2xl text-primary font-bold">
          {formatNumber(Math.round(totalMonthly * 12))} {curr}
        </p>
      </div>
    </div>
  );
};

export default AverageCostCard;
