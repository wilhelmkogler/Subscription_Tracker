import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
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

const SubscriptionTableRow = ({ sub, onEdit }) => {
  const nextPayment = getNextPaymentDate(sub.startDate, sub.billingCycle);
  const daysLeft = nextPayment ? daysUntil(nextPayment) : null;

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

  return (
    <tr className="border-b text-xs xl:text-md">
      <td className="px-4 font-bold">{sub.name}</td>
      <td className="py-6">{sub.category}</td>

      <td className="p-2">{sub.startDate}</td>
      <td className="p-2">
        {nextPayment ? `${formatDate(nextPayment, sub.billingCycle)}` : "—"}
      </td>

      <td className="p-2">{sub.billingCycle}</td>

      <td className="p-2">
        {sub.price?.toLocaleString("de-DE")} {sub.currency}
      </td>

      <td className="p-2">{daysLeft} days</td>
      <td className="py-6 pr-4 flex gap-2 text-md">
        <button
          onClick={() => onEdit(sub)}
          className="bg-secondary text-white w-1/2 px-2 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-primary text-white w-1/2 px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default SubscriptionTableRow;
