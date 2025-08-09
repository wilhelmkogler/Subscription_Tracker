import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AddSubscriptionForm from "../components/AddSubscriptionForm";
import SubscriptionCard from "../components/SubscriptionCard";
import FilterSortBar from "../components/FilterSortBar";
import SubscriptionTableRow from "../components/SubscriptionTableRow";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const user = auth.currentUser;
  const name = user?.displayName || "User";

  const [subscriptions, setSubscriptions] = useState([]);
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [viewMode, setViewMode] = useState("card");

  const getNextPaymentDate = (startDate, billingCycle) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const today = new Date();
    const next = new Date(start);
    while (next < today) {
      next.setMonth(next.getMonth() + (billingCycle === "Yearly" ? 12 : 1));
    }
    return next;
  };

  const daysUntil = (date) => {
    if (!date) return Infinity;
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "subscriptions"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscriptions(data);

      const cats = [...new Set(data.map((d) => d.category).filter(Boolean))];
      setAvailableCategories(cats);

      const prices = data
        .map((d) => d.price)
        .filter((p) => typeof p === "number");
      if (prices.length > 0) {
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
      }
    });

    return () => unsubscribe();
  }, [user]);

  const filtered = subscriptions
    .filter((sub) => {
      if (
        filters.categories?.length &&
        !filters.categories.includes(sub.category)
      )
        return false;
      if (filters.billingCycle && sub.billingCycle !== filters.billingCycle)
        return false;
      if (filters.currency && sub.currency !== filters.currency) return false;
      if (filters.priceRange?.length) {
        const [min, max] = filters.priceRange;
        if (sub.price < min || sub.price > max) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const [sortBy, sortOrder] = (filters.sort || "daysLeft-asc").split("-");
      let valA, valB;

      if (sortBy === "daysLeft") {
        // kiszámoljuk a daysLeft értékeket
        const nextA = getNextPaymentDate(a.startDate, a.billingCycle);
        const nextB = getNextPaymentDate(b.startDate, b.billingCycle);
        valA = daysUntil(nextA);
        valB = daysUntil(nextB);
      } else if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "startDate") {
        valA = new Date(a.startDate);
        valB = new Date(b.startDate);
      } else {
        valA = a[sortBy];
        valB = b[sortBy];
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-500 p-4 md:p-6">
      <Navbar name={name} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full xl:w-[70%]">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              No subscriptions found.
            </p>
          ) : (
            <div className="gap-4">
              {viewMode === "card" ? (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {filtered.map((sub) => (
                    <SubscriptionCard
                      key={sub.id}
                      sub={sub}
                      onEdit={(sub) => {
                        setEditing(sub);
                        setShowModal(true);
                      }}
                    />
                  ))}

                  <div className="min-h-[200px] flex justify-center items-center bg-white font-semibold rounded-2xl hover:bg-gray-300 transition duration-200">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setEditing(null);
                      }}
                      className="w-full h-full flex flex-col justify-center gap-2 text-black hover:cursor-pointer"
                    >
                      <p className="text-3xl">+</p>
                      <p>New Subscription</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow rounded-2xl overflow-hidden text-left">
                    <thead className="bg-gray-200 text-lg italic">
                      <tr>
                        <th className="px-4">Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Since</th>
                        <th className="p-2">Next</th>
                        <th className="p-2">Plan</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Due In</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((sub) => (
                        <SubscriptionTableRow
                          key={sub.id}
                          sub={sub}
                          onEdit={(sub) => {
                            setEditing(sub);
                            setShowModal(true);
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-2xl w-full lg:w-[30%]">
          <div className="flex flex-col gap-2 mb-4">
            <div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditing(null);
                }}
                className="bg-green-500 w-full text-white text-lg p-4 rounded-2xl hover:cursor-pointer hover:bg-green-600"
              >
                Add New Subscription
              </button>
            </div>

            <div className="flex">
              <button
                onClick={() => setViewMode("card")}
                className={`w-1/2 px-4 py-2 rounded-l-xl hover:cursor-pointer ${
                  viewMode === "card" ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-1/2 px-4 py-2 rounded-r-xl hover:cursor-pointer ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                List View
              </button>
            </div>
          </div>

          <FilterSortBar
            filters={filters}
            setFilters={setFilters}
            onFilterChange={setFilters}
            availableCategories={availableCategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-10">
          <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => {
                setShowModal(false);
                setEditing(null);
              }}
              className="absolute top-2 right-2 py-1 px-3 text-white bg-red-600 rounded-lg hover:bg-red-700 hover:cursor-pointer text-md"
            >
              Close
            </button>
            <AddSubscriptionForm
              editSub={editing}
              onClearEdit={() => {
                setShowModal(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
