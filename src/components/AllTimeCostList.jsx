import React, { useMemo } from "react";

const AllTimeCostList = ({ subscriptions }) => {
  const items = useMemo(() => {
    return subscriptions.map((sub) => {
      if (!sub.startDate || !sub.price) return { ...sub, totalCost: 0 };

      const start = new Date(sub.startDate);
      const today = new Date();

      let months =
        (today.getFullYear() - start.getFullYear()) * 12 +
        (today.getMonth() - start.getMonth());

      if (today.getDate() < start.getDate()) {
        months -= 1;
      }
      if (months < 0) months = 0;

      const monthlyPrice =
        sub.billingCycle === "Yearly" ? sub.price / 12 : sub.price;

      const totalCost = monthlyPrice * months;
      return { ...sub, totalCost };
    });
  }, [subscriptions]);

  const curr = subscriptions[0]?.currency || "EUR";
  const formatNumber = (num) => Number(num || 0).toLocaleString("de-DE");

  if (!subscriptions || subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white h-full xl:h-[418px] p-4 rounded-2xl shadow">
      <h2 className="text-sm xl:text-lg font-semibold mb-3">
        All-Time Subscription Costs
      </h2>
      <ul className="divide-y">
        {items.map((s) => (
          <li key={s.id} className="py-2 flex justify-between items-center">
            <div>
              <p className="text-sm xl:text-lg font-medium">{s.name}</p>
              <p className="text-[0.7rem] xl:text-xs text-gray-500">
                {s.category || "Uncategorized"} · {s.billingCycle}
              </p>
            </div>
            <p className="font-semibold bg-primary text-white py-1 px-2 rounded-xl">
              {formatNumber(s.totalCost)} {s.currency || curr}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllTimeCostList;
