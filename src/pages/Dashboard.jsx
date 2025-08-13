import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AddSubscriptionForm from "../components/AddSubscriptionForm";
import SubscriptionCard from "../components/SubscriptionCard";
import FilterSortBar from "../components/FilterSortBar";
import SubscriptionTableRow from "../components/SubscriptionTableRow";
import Navbar from "../components/Navbar";
import UpcomingPaymentsList from "../components/UpcomingPaymentsList";
import CategoryDistributionChart from "../components/CategoryDistributionChart";
import TopExpensiveList from "../components/TopExpensiveList";
import AverageCostCard from "../components/AverageCostCard";
import ActiveSubsLineChart from "../components/ActiveSubsLineChart";
import AllTimeCostList from "../components/AllTimeCostList";
import TopCategoryMonthlyBar from "../components/TopCategoryMonthlyBar";
import AllTimeTotalCostCard from "../components/AllTimeTotalCostCard";

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
    <div className="p-4 md:p-6">
      <Navbar name={name} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full xl:w-[70%]">
          {filtered.length === 0 ? (
            <div className="bg-white flex justify-center items-center p-4 h-full rounded-2xl">
              <p className="text-red-500 text-3xl font-bold">No Active Subscriptions</p>
            </div>
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

                  <div className="min-h-[170px] xl:min-h-[200px] flex justify-center items-center bg-white font-semibold rounded-2xl hover:bg-gray-300 transition duration-200">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setEditing(null);
                      }}
                      className="w-full h-full flex flex-col justify-center gap-2 text-black hover:cursor-pointer"
                    >
                      <p className="text-3xl">+</p>
                      <p className="text-xs xl:text-lg">New Subscription</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow rounded-2xl overflow-hidden text-left">
                    <thead className="bg-gray-200 text-xs xl:text-lg italic">
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

          <div className="mt-6 rounded-2xl">
            <TopExpensiveList subscriptions={filtered} />

            <div className="flex flex-col xl:flex-row gap-6 mt-6">
              <div className="w-full xl:w-2/3">
                <TopCategoryMonthlyBar subscriptions={filtered} />
              </div>
              <div className="w-full xl:w-1/3">
                <AllTimeCostList subscriptions={filtered} />
              </div>
            </div>

            <div className="mt-6">
              <ActiveSubsLineChart subscriptions={filtered} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl w-full lg:w-[30%]">
          <div className="flex flex-col gap-2 mb-4">
            <div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditing(null);
                }}
                className="bg-secondary w-full text-white text-sm xl:text-lg p-3 xl:p-4 rounded-2xl hover:cursor-pointer hover:bg-green-600"
              >
                Add New Subscription
              </button>
            </div>

            {filtered.length === 0 ? (
              <div></div>
            ) : (
              <div className="flex">
                <button
                  onClick={() => setViewMode("card")}
                  className={`w-1/2 px-4 py-2 text-xs xl:text-md rounded-l-xl hover:cursor-pointer ${
                    viewMode === "card"
                      ? "bg-primary text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Card View
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-1/2 px-4 py-2 text-xs xl:text-md rounded-r-xl hover:cursor-pointer ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-gray-300"
                  }`}
                >
                  List View
                </button>
              </div>
            )}
          </div>

          <div>
            <FilterSortBar
              filters={filters}
              setFilters={setFilters}
              onFilterChange={setFilters}
              availableCategories={availableCategories}
            />
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <AverageCostCard subscriptions={filtered} />
          </div>

          {/* Például két oszlopos elrendezésben */}
          <div className="mt-10">
            <CategoryDistributionChart subscriptions={filtered} />
          </div>
          <div className="mt-10">
            <UpcomingPaymentsList subscriptions={filtered} />
          </div>
          <div className="mt-10">
            <AllTimeTotalCostCard subscriptions={filtered} />
          </div>
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
