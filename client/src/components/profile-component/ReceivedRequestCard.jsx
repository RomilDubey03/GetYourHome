import React, { useState } from "react";
import { Button } from "flowbite-react";
import { Badge } from "flowbite-react";
import { Accordion } from "flowbite-react";
import axios from "axios";

const statusPill = {
  pending: "warning",
  accepted: "success",
  rejected: "failure",
};

const ReceivedRequestCard = ({ request }) => {

    const [booking , setBooking ] = useState(request)

  const {
    status,
    createdAt,
    appliedFor,
    booker,
    bookerMessage,
    checkInDate,
    checkOutDate,
    resolvedAt,
    updatedAt,
    _id,
  } = booking;
  const bookerName = booker.username;

  async function resolveBooking(status) {
    try {
        const updatedBooking = {...booking};
        updatedBooking.resolvedAt =  Date.now()
        updatedBooking.status =  status
        updatedBooking.responseMessage =  ""

        setBooking(updatedBooking)
      const { data } = axios.post("/api/booking/resolve", {
        responseMessage: "",
        bookingId: _id,
        status,
        resolvedAt : Date.now()
      });
    } catch (error) {
        if(error.response){
            alert(error.response.data.message);
        }
        else{
            alert(error.message)
        }
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
              <span className="font-bold">Booker Name:</span> {bookerName}
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
          {status && status == "pending" ? (
            <>
              <Button
                onClick={() => resolveBooking("accepted")}
                color="success"
              >
                Accept
              </Button>
              <Button
                onClick={() => resolveBooking("rejected")}
                color="failure"
              >
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button className="mt-2">
                Booking responded at :{" "}
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

export default ReceivedRequestCard;
