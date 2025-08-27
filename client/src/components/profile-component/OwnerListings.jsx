import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { AiOutlineMenu } from "react-icons/ai";

import { Table } from "flowbite-react";


export default function OwnerListings() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  
  useEffect(() => {
    handleShowListings();
  }, []);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      // console.log(data);
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-16">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>Listing name</Table.HeadCell>
          <Table.HeadCell>Type</Table.HeadCell>
          <Table.HeadCell>Offer</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span className="">Actions</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {userListings && userListings.length > 0
            ? userListings.map((listing) => (
                <>
                  <Table.Row key={listing._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell ><Link to={`/listing/${listing._id}`}> <img className="h-10" src={listing.imageUrls[0]} alt="" srcset="" /> </Link></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {listing.name}
                    </Table.Cell>
                    <Table.Cell>{listing.type}</Table.Cell>
                    <Table.Cell>{listing.offer.toString()}</Table.Cell>
                    <Table.Cell>{listing.regularPrice}</Table.Cell>
                    <Table.Cell>

                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="text-red-700 uppercase ml-4"
                      >
                        Delete
                      </button>
                    </Table.Cell>
                  </Table.Row>
                </>
              ))
            : null}
        </Table.Body>
      </Table>
    </div>
  );
}
