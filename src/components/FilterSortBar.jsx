import React, { useEffect } from "react";

const FilterSortBar = ({
  onFilterChange,
  filters,
  setFilters,
  availableCategories,
}) => {
  // ha nincs adat → ne rendereljen semmit
  if (!availableCategories || availableCategories.length === 0) {
    return null;
  }

  useEffect(() => {
    if (!filters.sort) {
      const updated = { ...filters, sort: "daysLeft-asc" };
      setFilters(updated);
      onFilterChange(updated);
    }
  }, []);

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleCategoryToggle = (category) => {
    const isActive = filters.categories?.includes(category);
    const updatedCategories = isActive
      ? filters.categories.filter((c) => c !== category)
      : [...(filters.categories || []), category];

    const updated = { ...filters, categories: updatedCategories };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* SORTING */}
      <select
        name="sort"
        value={filters.sort || ""}
        onChange={handleChange}
        className="border text-sm xl:text-md rounded-lg px-3 py-2"
      >
        <option value="daysLeft-asc">Order By Days Left (Closest)</option>
        <option value="daysLeft-desc">Order By Days Left (Furthest)</option>
        <option value="name-asc">Order By Name A–Z</option>
        <option value="name-desc">Order By Name Z–A</option>
        <option value="price-asc">Order By Price Low → High</option>
        <option value="price-desc">Order By Price High → Low</option>
        <option value="startDate-asc">Order By Start date ↑</option>
        <option value="startDate-desc">Order By Start date ↓</option>
      </select>

      {/* CATEGORIES AS TOGGLE CHIPS */}
      <div>
        <label className="block text-sm xl:text-lg font-semibold mt-4 mb-2">
          Select a Category:
        </label>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((cat) => {
            const active = filters.categories?.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-lg text-[0.7rem] xl:text-sm border transition hover:cursor-pointer
                  ${
                    active
                      ? "bg-primary text-white border-primary hover:bg-red-500"
                      : "bg-white text-black border-black hover:bg-primary hover:text-white"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        {/* BILLING CYCLE */}
        <select
          name="billingCycle"
          value={filters.billingCycle || ""}
          onChange={handleChange}
          className="border text-sm xl:text-md rounded-lg w-1/2 px-3 py-2"
        >
          <option value="">All Billing Plans</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>

        {/* CURRENCY */}
        <select
          name="currency"
          value={filters.currency || ""}
          onChange={handleChange}
          className="border text-sm xl:text-md rounded-lg w-1/2 px-3 py-2"
        >
          <option value="">All Currencies</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="HUF">HUF</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSortBar;
