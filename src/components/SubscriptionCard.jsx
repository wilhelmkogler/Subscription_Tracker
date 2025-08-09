import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Pencil, Trash2 } from "lucide-react";

const getNextPaymentDate = (startDate, billingCycle) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  const today = new Date();
  let next = new Date(start);
  while (next < today) {
    next.setMonth(next.getMonth() + (billingCycle === "Yearly" ? 12 : 1));
  }

  return next;
};

const daysUntil = (date) => {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (date, billingCycle) => {
  const options =
    billingCycle === "Monthly"
      ? { month: "short", day: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" };

  return date.toLocaleDateString(undefined, options);
};

const SubscriptionCard = ({ sub, onEdit }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${sub.name}?`)) {
      await deleteDoc(doc(db, "subscriptions", sub.id));
    }
  };

  const nextPayment = getNextPaymentDate(sub.startDate, sub.billingCycle);
  const daysLeft = nextPayment ? daysUntil(nextPayment) : null;

  return (
    <div className="bg-gray-200 shadow p-4 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="border-l-3 border-blue-800 pl-2">
          <h3 className="text-xl font-bold">{sub.name}</h3>
          <p className="text-xs">{sub.category || "Uncategorized"}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(sub)}
            className="hover:scale-125 transition duration-150 hover:cursor-pointer"
          >
            <Pencil className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleDelete}
            className="hover:scale-125 transition duration-150 hover:cursor-pointer"
          >
            <Trash2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <p>Since</p>

        <p>{sub.startDate}</p>
      </div>

      <div className="flex justify-between items-center text-sm">
        <p>Next</p>

        <p>
          {nextPayment && <p>{formatDate(nextPayment, sub.billingCycle)}</p>}{" "}
        </p>
      </div>

      <div className="border-b-1 my-4 flex justify-between items-center text-md font-semibold">
        <p>{sub.billingCycle}</p>
        <p>
          {sub.price} {sub.currency}
        </p>
      </div>

      <div className="bg-blue-500/30 rounded-xl p-2 flex justify-center text-center text-sm font-semibold mt-4">
        <p>{daysLeft} Days Until Next Payment</p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
