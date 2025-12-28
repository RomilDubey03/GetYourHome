import React, { useEffect, useState } from "react";
import UserBookRequestCard from "./UserBookRequestCard";
import axiosClient from "../../utils/axiosClient.js";

function UserBookings() {
  const [userBookings, setUserBookings] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axiosClient.get("/api/v1/bookings/user-bookings");
        const data = response.data.data || response.data;
        setUserBookings(data);
      } catch (error) {
        alert(error.message || "Failed to fetch bookings");
      }
    }
    fetchBookings();
  }, []);

  return (
    <div>
      <div>
        <h1 className="font-bold text-3xl text-center">Your Bookings</h1>
      </div>
      <div className=" h-[80vh] overflow-y-scroll">
        {userBookings && userBookings.length > 0 ? (
          userBookings.map((booking) => (
            <div key={booking._id}>
              <UserBookRequestCard request={booking} />
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

export default UserBookings;
