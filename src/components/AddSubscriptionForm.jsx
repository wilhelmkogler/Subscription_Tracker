import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

const AddSubscriptionForm = ({ editSub, onClearEdit }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    currency: "EUR",
    category: "",
    billingCycle: "Monthly",
    startDate: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editSub) {
      setForm({
        name: editSub.name,
        price: editSub.price,
        currency: editSub.currency,
        category: editSub.category,
        billingCycle: editSub.billingCycle,
        startDate: editSub.startDate,
      });
    } else {
      setForm({
        name: "",
        price: "",
        currency: "EUR",
        category: "",
        billingCycle: "Monthly",
        startDate: "",
      });
    }
  }, [editSub]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (editSub) {
        const docRef = doc(db, "subscriptions", editSub.id);
        await updateDoc(docRef, {
          ...form,
          price: parseFloat(form.price),
        });
        if (onClearEdit) onClearEdit();
      } else {
        await addDoc(collection(db, "subscriptions"), {
          ...form,
          price: parseFloat(form.price),
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        if (onClearEdit) onClearEdit();
      }

      setForm({
        name: "",
        price: "",
        currency: "EUR",
        category: "",
        billingCycle: "Monthly",
        startDate: "",
      });
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded">
      <h3 className="text-2xl font-bold mb-8">
        {editSub ? "Edit Subscription" : "Add Subscription"}
      </h3>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="HUF">HUF</option>
        </select>
        <select
          name="billingCycle"
          value={form.billingCycle}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        />
      </div>

      <div className="flex flex-row-reverse justify-start items-center gap-4 mt-6">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600"
        >
          {editSub ? "Save Changes" : "Add Subscription"}
        </button>
        {editSub && (
          <button
            type="button"
            onClick={onClearEdit}
            className="bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-800"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default AddSubscriptionForm;
