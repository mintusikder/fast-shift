import React, { useState } from "react";
import { useLoaderData } from "react-router";
import BangladeshMap from "./BangladeshMap";

const Coverage = () => {
  const districts = useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);

    const match = districts.find((d) =>
      d.district?.toLowerCase().includes(val.toLowerCase())
    );

    if (match) {
      setSelectedDistrict(match); //  this will be used to zoom
    } else {
      setSelectedDistrict(null);
    }
  };

  return (
    <section className="p-8 bg-base-200">
      <h2 className="text-3xl font-bold text-center mb-6">
        We are available in 64 districts
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search district"
          className="input input-bordered w-full max-w-sm"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="text-2xl font-bold">
        We deliver almost all over Bangladesh
      </div>

      <div className="mt-10">
        <BangladeshMap
          districts={districts}
          selectedDistrict={selectedDistrict}
        />
      </div>
    </section>
  );
};

export default Coverage;
