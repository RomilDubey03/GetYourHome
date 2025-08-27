import React, { useEffect, useState } from "react";
import ReceivedRequestCard from "./ReceivedRequestCard";
import axios from "axios";

function ReceivedBooking() {
  const [receivedBooking, setReceivedBooking] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await axios.get("/api/booking/received-bookings");
        setReceivedBooking(data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert(error.message);
        }
      }
    }
    fetchBookings();
  }, []);

  return (
    <div>
      <div>
        <h1 className="font-bold text-3xl text-center">Booking On You Listings</h1>
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
                NO BOOKINGS ON YOU LISTINGS
              </h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReceivedBooking;
