import React, { useMemo } from "react";

const AllTimeTotalCostCard = ({ subscriptions }) => {
  const { totalCost, currency } = useMemo(() => {
    const now = new Date();
    let total = 0;
    let curr = subscriptions[0]?.currency || "EUR";

    subscriptions.forEach((sub) => {
      if (!sub.startDate || !sub.price) return;

      const start = new Date(sub.startDate);
      const months =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth()) +
        (now.getDate() >= start.getDate() ? 0 : -1);

      // ha éves előfizetés
      const totalSubCost =
        sub.billingCycle === "Yearly"
          ? (months / 12) * sub.price
          : months * sub.price;

      total += totalSubCost;
    });

    return { totalCost: total, currency: curr };
  }, [subscriptions]);

  const formatNumber = (num) => {
    return Number(num).toLocaleString("en").replace(/,/g, ".");
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-sm xl:text-lg font-semibold mb-2">All-Time Total Cost</h2>
      <p className="text-xl xl:text-3xl font-bold text-primary">
        {formatNumber(totalCost.toFixed(0))} {currency}
      </p>
      <p className="text-[0.6rem] xl:text-sm text-gray-500 mt-1">
        Total spent since all subscriptions started
      </p>
    </div>
  );
};

export default AllTimeTotalCostCard;
