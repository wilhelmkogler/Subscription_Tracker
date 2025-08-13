import React, { useMemo } from "react";
import { getNextPaymentDate, daysUntil } from "../utils/subscriptions";

const UpcomingPaymentsList = ({ subscriptions }) => {
  const upcoming = useMemo(() => {
    return subscriptions
      .map((s) => {
        const next = getNextPaymentDate(s.startDate, s.billingCycle);
        const days = daysUntil(next);
        return { ...s, nextPayment: next, daysLeft: days };
      })
      .filter((s) => s.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [subscriptions]);

  const formatNumber = (num) => {
    return Number(num).toLocaleString("en").replace(/,/g, ".");
  };

  if (upcoming.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-sm xl:text-lg font-semibold mb-3">
        Upcoming Payments
      </h2>
      <ul className="divide-y">
        {upcoming.map((sub) => (
          <li
            key={sub.id}
            className="py-2 flex justify-between items-center text-sm xl:text-md"
          >
            <div>
              <p className="font-medium">{sub.name}</p>
              <p className="text-[0.7rem] xl:text-sm text-third">
                Payment in {sub.daysLeft} days —{" "}
                {sub.nextPayment.toLocaleDateString("en-de")}
              </p>
            </div>
            <p className="font-semibold">
              {formatNumber(sub.price)} {sub.currency}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingPaymentsList;
