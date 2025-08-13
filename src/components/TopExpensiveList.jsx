import React, { useMemo } from "react";
import { Crown } from "lucide-react";

const TopExpensiveList = ({ subscriptions, limit = 5 }) => {
  const items = useMemo(() => {
    return [...subscriptions]
      .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
      .slice(0, limit);
  }, [subscriptions, limit]);

  if (items.length === 0) {
    return <div></div>;
  }

  const curr = items[0]?.currency || "EUR";
  const formatNumber = (num) => Number(num || 0).toLocaleString("de-DE");

  const COLORS = [
    "from-pink-400 to-pink-600",
    "from-amber-400 to-amber-600",
    "from-emerald-400 to-emerald-600",
    "from-sky-400 to-sky-600",
    "from-violet-400 to-violet-600",
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-sm xl:text-lg font-semibold mb-3">
        Top {limit} Most Expensive Subscriptions
      </h2>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 overflow-x-auto pb-1">
        {items.map((s, i) => (
          <div
            key={s.id}
            className={`
              relative 
              rounded-2xl p-4 text-white shadow-md
              bg-gradient-to-br ${COLORS[i % COLORS.length]}
              transition-transform 
            `}
          >
            <div className="relative flex flex-col justify-between">
              <div className="flex justify-between">
                <h3 className="font-bold text-md xl:text-lg leading-tight">
                  {s.name}
                </h3>
                <p className="text-sm xl:text-md"> #{i + 1}</p>
              </div>
              <div>
                <p className="mt-4 text-lg xl:text-2xl font-extrabold">
                  {formatNumber(s.price)}{" "}
                  <span className="text-base font-semibold">
                    {s.currency || curr}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopExpensiveList;
