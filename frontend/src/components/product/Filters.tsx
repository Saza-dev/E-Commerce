"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (min) params.set("min", min);
    else params.delete("min");

    if (max) params.set("max", max);
    else params.delete("max");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4 p-4 border rounded-lg bg-gray-50">
      <input
        type="number"
        placeholder="Min Price"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="w-24 rounded border p-2"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="w-24 rounded border p-2"
      />

      <select
        value={sort || ""}
        onChange={(e) => setSort(e.target.value)}
        className="rounded border p-2"
      >
        <option value="">Default</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
      </select>

      <button
        onClick={applyFilters}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
}
