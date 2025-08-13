import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

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

// 🔹 Ezres tagolás szóközzel
const formatNumber = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";

const SubscriptionCard = ({ sub, onEdit }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `Are you sure you want to cancel your ${sub.name} subscription?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "subscriptions", sub.id));
      Swal.fire("Success!", `${sub.name} has been deleted.`, "success");
    }
  };

  const nextPayment = getNextPaymentDate(sub.startDate, sub.billingCycle);
  const daysLeft = nextPayment ? daysUntil(nextPayment) : null;

  return (
    <div className="bg-white shadow p-4 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="border-l-4 border-primary pl-2">
          <h3 className="text-sm xl:text-xl font-bold">{sub.name}</h3>
          <p className="text-[0.5rem] xl:text-xs">{sub.category || "Uncategorized"}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(sub)}
            className="hover:scale-125 transition duration-150 hover:cursor-pointer"
          >
            <Pencil className="w-3 xl:w-5 h-3 xl:h-5 text-secondary" />
          </button>
          <button
            onClick={handleDelete}
            className="hover:scale-125 transition duration-150 hover:cursor-pointer"
          >
            <Trash2 className="w-3 xl:w-5 h-3 xl:h-5 text-primary" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-[0.6rem] xl:text-sm">
        <p>Since</p>
        <p>{sub.startDate}</p>
      </div>

      <div className="flex justify-between items-center text-[0.6rem] xl:text-sm">
        <p>Next</p>
        <p>{nextPayment && formatDate(nextPayment, sub.billingCycle)}</p>
      </div>

      <div className="border-b-1 my-4 flex justify-between items-center text-[0.8rem] xl:text-sm font-semibold">
        <p>{sub.billingCycle}</p>
        <p>
          {formatNumber(sub.price)} {sub.currency}
        </p>
      </div>

      <div className="bg-secondary text-white rounded-xl p-1 flex justify-center text-center text-[0.6rem] xl:text-sm font-semibold mt-4">
        <p>{formatNumber(daysLeft)} Days Until Next Payment</p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
