import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useLoaderData } from "react-router";

// const districtData = [
//   {
//     region: "Dhaka",
//     district: "Dhaka",
//     city: "Dhaka",
//     covered_area: ["Uttara", "Dhanmondi", "Mirpur", "Mohammadpur"],
//     status: "active",
//     flowchart: "https://example.com/dhaka-flowchart.png",
//     longitude: 90.4125,
//     latitude: 23.8103,
//   },
//   {
//     region: "Chittagong",
//     district: "Chittagong",
//     city: "Chittagong",
//     covered_area: ["Agrabad", "Pahartali", "Halishahar"],
//     status: "active",
//     flowchart: "",
//     longitude: 91.8350,
//     latitude: 22.3569,
//   },
//   {
//     region: "Sylhet",
//     district: "Sylhet",
//     city: "Sylhet",
//     covered_area: ["Zindabazar", "Amberkhana", "Shibgonj"],
//     status: "active",
//     flowchart: "",
//     longitude: 91.8771,
//     latitude: 24.8949,
//   },
// ];

const SendParcel = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const districtData = useLoaderData();
  const [confirmData, setConfirmData] = useState(null);

  const parcelType = watch("type");
  const senderDistrict = watch("senderRegion");
  const receiverDistrict = watch("receiverRegion");

  const getServiceCenters = (districtName) => {
    const found = districtData.find((d) => d.district === districtName);
    return found?.covered_area || [];
  };

  const calculateCost = (data) => {
    let cost = data.type === "document" ? 50 : 100;
    if (data.type === "non-document" && data.weight) {
      cost += parseFloat(data.weight) * 20;
    }
    return cost;
  };

  const onSubmit = (data) => {
    const cost = calculateCost(data);
    setConfirmData({ ...data, cost });

    toast(
      (t) => (
        <div className="space-y-2">
          <p className="font-bold">Delivery Cost: ৳{cost}</p>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              handleConfirmSubmit({ ...data, cost });
              toast.dismiss(t.id);
            }}
          >
            Confirm
          </button>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleConfirmSubmit = async (finalData) => {
    const payload = {
      ...finalData,
      creation_date: new Date().toISOString(),
    };
    console.log(payload); // remove in production

    try {
      await axios.post("https://your-api-url.com/parcels", payload); // replace with your real endpoint
      toast.success("Parcel info submitted successfully!");
      reset();
      setConfirmData(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit parcel info.");
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Toaster />
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Send a Parcel</h2>
          <p className="text-gray-600">
            Fill in the details to send your parcel.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parcel Info */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Parcel Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <select
                {...register("type", { required: "Parcel type is required" })}
                className="select select-bordered w-full"
              >
                <option value="">Select Type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-document</option>
              </select>

              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                placeholder="Parcel Title"
                className="input input-bordered w-full"
              />

              {parcelType === "non-document" && (
                <input
                  {...register("weight")}
                  type="number"
                  placeholder="Weight (kg)"
                  className="input input-bordered w-full"
                />
              )}
            </div>
          </fieldset>

          {/* Sender Info */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Sender Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                {...register("senderName", { required: true })}
                defaultValue={user?.displayName || ""}
                readOnly
                className="input input-bordered w-full"
                placeholder="Sender Name"
              />

              <input
                {...register("senderContact", { required: true })}
                type="tel"
                className="input input-bordered w-full"
                placeholder="Contact Number"
              />

              <select
                {...register("senderRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select District</option>
                {districtData.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district}
                  </option>
                ))}
              </select>

              <select
                {...register("senderCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getServiceCenters(senderDistrict).map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>

              <input
                {...register("senderAddress", { required: true })}
                className="input input-bordered w-full col-span-2"
                placeholder="Sender Address"
              />

              <textarea
                {...register("deliveryInstruction", { required: true })}
                className="textarea textarea-bordered w-full col-span-2"
                placeholder="Delivery Instructions"
                rows={3}
              />
            </div>
          </fieldset>

          {/* Receiver Info */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Receiver Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                {...register("receiverName", { required: true })}
                className="input input-bordered w-full"
                placeholder="Receiver Name"
              />

              <input
                {...register("receiverContact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Contact Number"
              />

              <select
                {...register("receiverRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select District</option>
                {districtData.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district}
                  </option>
                ))}
              </select>

              <select
                {...register("receiverCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getServiceCenters(receiverDistrict).map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>

              <input
                {...register("receiverAddress", { required: true })}
                className="input input-bordered w-full col-span-2"
                placeholder="Receiver Address"
              />
              <textarea
                {...register("deliveryInstruction", { required: true })}
                className="textarea textarea-bordered w-full col-span-2"
                placeholder="Delivery Instructions"
                rows={3}
              />
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendParcel;
