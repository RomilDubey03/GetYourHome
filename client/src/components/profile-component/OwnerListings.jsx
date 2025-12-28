import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react";
import axiosClient from "../../utils/axiosClient.js";

export default function OwnerListings() {
  const { currentUser, loading, error } = useSelector((state) => state.auth);

  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    handleShowListings();
  }, []);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const response = await axiosClient.get(`/api/v1/users/listings/${currentUser._id}`);
      const data = response.data.data || response.data;
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      await axiosClient.delete(`/api/v1/listings/delete/${listingId}`);
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
              <Table.Row key={listing._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell><Link to={`/listing/${listing._id}`}> <img className="h-10" src={listing.imageUrls[0]} alt="" /> </Link></Table.Cell>
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
            ))
            : null}
        </Table.Body>
      </Table>
    </div>
  );
}
