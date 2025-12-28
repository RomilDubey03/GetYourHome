import React, { useEffect, useState } from "react";
import ReceivedRequestCard from "./ReceivedRequestCard";
import axiosClient from "../../utils/axiosClient.js";

function ReceivedBooking() {
  const [receivedBooking, setReceivedBooking] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axiosClient.get("/api/v1/bookings/received-bookings");
        const data = response.data.data || response.data;
        setReceivedBooking(data);
      } catch (error) {
        alert(error.message || "Failed to fetch bookings");
      }
    }
    fetchBookings();
  }, []);

  return (
    <div>
      <div>
        <h1 className="font-bold text-3xl text-center">Bookings On Your Listings</h1>
      </div>

      <div className=" h-[80vh] overflow-y-scroll">
        {receivedBooking && receivedBooking.length > 0 ? (
          receivedBooking.map((booking) => (
            <div key={booking._id}>
              <ReceivedRequestCard request={booking} />
            </div>
          ))
        ) : (
          <>
            <div className="h-full flex justify-center items-center ">
              <h1 className="font-bold text-5xl">
                NO BOOKINGS ON YOUR LISTINGS
              </h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReceivedBooking;
