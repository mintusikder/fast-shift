import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // ✅ correct import

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure(); // ✅ call the hook here
  const districtData = useLoaderData();


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  // Extract unique regions
  const regions = [...new Set(districtData.map((d) => d.region))];

  // Get districts for selected region
  const districts = districtData
    .filter((d) => d.region === selectedRegion)
    .map((d) => d.district);

  // Get service centers for selected district
  const getServiceCenters = (districtName) => {
    const found = districtData.find((d) => d.district === districtName);
    return found?.covered_area || [];
  };

  const onSubmit = (data) => {
    Swal.fire({
      title: "Confirm Application",
      html: `
        <div style="text-align: left">
          <p><strong>Name:</strong> ${user?.displayName}</p>
          <p><strong>Email:</strong> ${user?.email}</p>
          <p><strong>Age:</strong> ${data.age}</p>
          <p><strong>Region:</strong> ${data.region}</p>
          <p><strong>District:</strong> ${data.district}</p>
          <p><strong>Service Center:</strong> ${data.serviceCenter}</p>
          <p><strong>Bike:</strong> ${data.bikeBrand} (${data.bikeNumber})</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmSubmit(data);
      }
    });
  };

  const handleConfirmSubmit = async (data) => {
    const payload = {
      ...data,
      name: user?.displayName,
      email: user?.email,
      status: "pending",
      applied_at: new Date().toISOString(),
    };

    try {
      await axiosSecure.post("/riders", payload);
      Swal.fire("Success!", "Your application has been submitted.", "success");
      reset();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit your application.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Apply to Be a Rider</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* === Basic Info === */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Basic Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                readOnly
                value={user?.displayName || ""}
                className="input input-bordered w-full"
                placeholder="Name"
              />
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              <div>
                <input
                  {...register("age", { required: "Age is required" })}
                  type="number"
                  placeholder="Age"
                  className="input input-bordered w-full"
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
              </div>
              <div>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  type="tel"
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
              <div>
                <input
                  {...register("nid", { required: "NID is required" })}
                  type="text"
                  placeholder="National ID"
                  className="input input-bordered w-full"
                />
                {errors.nid && <p className="text-red-500 text-sm">{errors.nid.message}</p>}
              </div>
              <div>
                <input
                  {...register("resume", { required: "Resume link is required" })}
                  type="url"
                  placeholder="Resume Link (e.g. Google Drive)"
                  className="input input-bordered w-full"
                />
                {errors.resume && <p className="text-red-500 text-sm">{errors.resume.message}</p>}
              </div>
            </div>
          </fieldset>

          {/* === Location Info === */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Location Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <select
                  {...register("region", { required: "Region is required" })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
              </div>

              <div>
                <select
                  {...register("district", { required: "District is required" })}
                  className="select select-bordered w-full"
                  disabled={!selectedRegion}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
              </div>

              <div>
                <select
                  {...register("serviceCenter", { required: "Service Center is required" })}
                  className="select select-bordered w-full"
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Service Center</option>
                  {getServiceCenters(selectedDistrict).map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                {errors.serviceCenter && (
                  <p className="text-red-500 text-sm">{errors.serviceCenter.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("address", { required: "Address is required" })}
                  placeholder="Your Address"
                  className="input input-bordered w-full"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>
            </div>
          </fieldset>

          {/* === Bike Info === */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Bike Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  {...register("bikeBrand", { required: "Bike brand is required" })}
                  placeholder="Bike Brand"
                  className="input input-bordered w-full"
                />
                {errors.bikeBrand && (
                  <p className="text-red-500 text-sm">{errors.bikeBrand.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register("bikeNumber", { required: "Registration number is required" })}
                  placeholder="Bike Registration Number"
                  className="input input-bordered w-full"
                />
                {errors.bikeNumber && (
                  <p className="text-red-500 text-sm">{errors.bikeNumber.message}</p>
                )}
              </div>
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary w-full">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default BeARider;
