import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  addSavedListing,
  removeSavedListing
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { AiOutlineMenu } from "react-icons/ai";
import { Table } from "flowbite-react";
import axios from 'axios'

export default function SavedListings() {

  const {currentUser } = useSelector((state)=> state.user)
  const [savedListings , setSavedListings] = useState([])
  const dispatch = useDispatch()
  // console.log(currentUser);

  async function removeSavedListingHandler(listingId) {
    
    try {
      const {data} = await axios.post(`/api/listing/save/${listingId}?type=unsave`)
      // console.log("This happened");
      dispatch(removeSavedListing(listingId))

      const updatedListings = savedListings.filter(listing=> listing._id != listingId)
      setSavedListings(updatedListings)
    } catch (error) {
      if(error.response){
        alert(error.response.data.message)
      }
      else{
        alert(error.message)
      }
    }
  }

  useEffect(()=>{
    async function getSavedListings() {
      try {
        const {data} = await axios.get(`/api/user/saved/listings` , {
          withCredentials : true
        })
        setSavedListings(prev=>data)        
      } catch (error) {
        if(error.response){
          alert(error.response.data.message)
        }
        else{
          alert(error.message)
        }
      }
    }
    getSavedListings()
  } , [])

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
                <>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell ><Link to={`/listing/${listing._id}`}> <img className="h-10" src={listing.imageUrls[0]} alt="" srcset="" /> </Link></Table.Cell>
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
                </>
              ))
            : null}
        </Table.Body>
      </Table>
    </div>
  );
}
