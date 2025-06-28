import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";
import { axiosSecure } from "../../hooks/useAxiosSecure";

const SendParcel = () => {
  const { user } = useAuth();
  const districtData = useLoaderData();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

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

    Swal.fire({
      title: "Confirm Parcel Submission",
      html: `
        <div style="text-align: left">
          <p><strong>Parcel Type:</strong> ${data.type}</p>
          <p><strong>Title:</strong> ${data.title}</p>
          <p><strong>Sender:</strong> ${data.senderName} (${data.senderContact})</p>
          <p><strong>Receiver:</strong> ${data.receiverName} (${data.receiverContact})</p>
          <p><strong>Delivery Cost:</strong> ৳${cost}</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmSubmit({ ...data, cost });
      }
    });
  };

  const handleConfirmSubmit = async (finalData) => {
    const generateTrackingId = () => {
      return `TRK-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;
    };

    const payload = {
      ...finalData,
      tracking_id: generateTrackingId(),
      created_by: user?.email || "unknown",
      payment_status: "unpaid",
      delivery_status: "not_collected",
      creation_date: new Date().toISOString(),
    };

    try {
      await axiosSecure.post(`/parcels`, payload);
      Swal.fire("Success!", `Parcel submitted! Tracking ID: ${payload.tracking_id}`, "success");
      reset();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to submit parcel info.", "error");
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Send a Parcel</h2>
          <p className="text-gray-600">Fill in the details to send your parcel.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parcel Info */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Parcel Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <select
                  {...register("type", { required: "Parcel type is required" })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Type</option>
                  <option value="document">Document</option>
                  <option value="non-document">Non-document</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>

              <div>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="Parcel Title"
                  className="input input-bordered w-full"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              {parcelType === "non-document" && (
                <div>
                  <input
                    {...register("weight")}
                    type="number"
                    placeholder="Weight (kg)"
                    className="input input-bordered w-full"
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* Sender Info */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Sender Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  {...register("senderName", { required: true })}
                  defaultValue={user?.displayName || ""}
                  readOnly
                  className="input input-bordered w-full"
                  placeholder="Sender Name"
                />
              </div>

              <div>
                <input
                  {...register("senderContact", { required: true })}
                  type="tel"
                  className="input input-bordered w-full"
                  placeholder="Contact Number"
                />
                {errors.senderContact && (
                  <p className="text-red-500 text-sm">Sender contact is required</p>
                )}
              </div>

              <div>
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
                {errors.senderRegion && (
                  <p className="text-red-500 text-sm">Sender region is required</p>
                )}
              </div>

              <div>
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
                {errors.senderCenter && (
                  <p className="text-red-500 text-sm">Sender service center is required</p>
                )}
              </div>

              <div className="md:col-span-2">
                <input
                  {...register("senderAddress", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Sender Address"
                />
                {errors.senderAddress && (
                  <p className="text-red-500 text-sm">Sender address is required</p>
                )}
              </div>

              <div className="md:col-span-2">
                <textarea
                  {...register("pickupInstruction", { required: true })}
                  className="textarea textarea-bordered w-full"
                  placeholder="Pickup Instructions"
                  rows={3}
                />
                {errors.pickupInstruction && (
                  <p className="text-red-500 text-sm">Pickup instructions required</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Receiver Info */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="font-semibold">Receiver Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  {...register("receiverName", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Receiver Name"
                />
                {errors.receiverName && (
                  <p className="text-red-500 text-sm">Receiver name is required</p>
                )}
              </div>

              <div>
                <input
                  {...register("receiverContact", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Contact Number"
                />
                {errors.receiverContact && (
                  <p className="text-red-500 text-sm">Receiver contact is required</p>
                )}
              </div>

              <div>
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
                {errors.receiverRegion && (
                  <p className="text-red-500 text-sm">Receiver region is required</p>
                )}
              </div>

              <div>
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
                {errors.receiverCenter && (
                  <p className="text-red-500 text-sm">Receiver center is required</p>
                )}
              </div>

              <div className="md:col-span-2">
                <input
                  {...register("receiverAddress", { required: true })}
                  className="input input-bordered w-full"
                  placeholder="Receiver Address"
                />
                {errors.receiverAddress && (
                  <p className="text-red-500 text-sm">Receiver address is required</p>
                )}
              </div>

              <div className="md:col-span-2">
                <textarea
                  {...register("deliveryInstruction", { required: true })}
                  className="textarea textarea-bordered w-full"
                  placeholder="Delivery Instructions"
                  rows={3}
                />
                {errors.deliveryInstruction && (
                  <p className="text-red-500 text-sm">Delivery instruction is required</p>
                )}
              </div>
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
