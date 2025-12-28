import React, { useState } from "react";
import { Button } from "flowbite-react";
import { Badge } from "flowbite-react";
import axiosClient from "../../utils/axiosClient.js";

const statusPill = {
  pending: "warning",
  accepted: "success",
  rejected: "failure",
};

const UserBookRequestCard = ({ request }) => {
  const [booking, setBooking] = useState(request);

  const {
    status,
    createdAt,
    appliedFor,
    owner,
    bookerMessage,
    checkInDate,
    checkOutDate,
    resolvedAt,
    updatedAt,
    _id,
  } = booking;
  const ownerName = owner?.username || "Unknown";

  async function resolveBooking(newStatus) {
    try {
      const updatedBooking = { ...booking };
      updatedBooking.resolvedAt = Date.now();
      updatedBooking.status = newStatus;
      updatedBooking.responseMessage = "";

      setBooking(updatedBooking);
      await axiosClient.post("/api/v1/bookings/resolve", {
        responseMessage: "",
        bookingId: _id,
        status: newStatus,
        resolvedAt: Date.now()
      });
    } catch (error) {
      alert(error.message || "Failed to resolve booking");
    }
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 pb-2 bg-white rounded-lg shadow-md mt-5">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">
            Request Details
          </h2>
          <div className="mt-2">
            <div className="flex items-center">
              <span className="font-bold mr-2">Status:</span>
              <Badge color={statusPill[status]} className="inline-block w-auto">
                {status}
              </Badge>
            </div>
            <p>
              <span className="font-bold">Request date: </span>{" "}
              {new Date(createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-bold">Applied For:</span> {appliedFor}
            </p>
            <p>
              <span className="font-bold">Owner:</span> {ownerName}
            </p>
            <p>
              <span className="font-bold">Message:</span> {bookerMessage}
            </p>
            {appliedFor === "rent" && (
              <div>
                <p>
                  <span className="font-bold">Check In:</span>{" "}
                  {new Date(checkInDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-bold">Check Out:</span>{" "}
                  {new Date(checkOutDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-center space-x-4">
          {status && status === "pending" ? (
            <>
              <Button color="success">
                Awaiting Response
              </Button>
            </>
          ) : (
            <>
              <Button className="mt-2">
                Response Received at:{" "}
                {resolvedAt
                  ? new Date(resolvedAt).toLocaleDateString()
                  : new Date(updatedAt).toLocaleDateString()}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookRequestCard;
