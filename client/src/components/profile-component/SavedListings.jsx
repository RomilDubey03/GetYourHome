import { useState, useEffect } from "react";
import { removeSavedListing } from "../../authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react";
import axiosClient from "../../utils/axiosClient.js";

export default function SavedListings() {
  const { currentUser } = useSelector((state) => state.auth);
  const [savedListings, setSavedListings] = useState([]);
  const dispatch = useDispatch();

  async function removeSavedListingHandler(listingId) {
    try {
      await axiosClient.post(`/api/v1/listings/save/${listingId}?type=unsave`);
      dispatch(removeSavedListing(listingId));
      const updatedListings = savedListings.filter(listing => listing._id !== listingId);
      setSavedListings(updatedListings);
    } catch (error) {
      alert(error.message || "Failed to remove listing");
    }
  }

  useEffect(() => {
    async function getSavedListings() {
      try {
        const response = await axiosClient.get(`/api/v1/users/saved/listings`);
        const data = response.data.data || response.data;
        setSavedListings(data);
      } catch (error) {
        alert(error.message || "Failed to fetch saved listings");
      }
    }
    getSavedListings();
  }, []);

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
          {savedListings && savedListings.length > 0
            ? savedListings.map((listing) => (
              <Table.Row key={listing._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell><Link to={`/listing/${listing._id}`}> <img className="h-10" src={listing.imageUrls[0]} alt="" /> </Link></Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {listing.name}
                </Table.Cell>
                <Table.Cell>{listing.type}</Table.Cell>
                <Table.Cell>{listing.offer.toString()}</Table.Cell>
                <Table.Cell>{listing.regularPrice}</Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => removeSavedListingHandler(listing._id)}
                    className="text-red-700 uppercase ml-4"
                  >
                    remove
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
