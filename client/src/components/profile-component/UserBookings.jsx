import React, { useEffect, useState } from "react";
import UserBookRequestCard from "./UserBookRequestCard";
import axios from "axios";
function UserBookings() {
  const [userBookings, setUserBookings] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await axios.get("/api/booking/user-bookings");
        setUserBookings(data);
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
                NO BOOKINGS ON YOU LISTINGS
              </h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserBookings;
