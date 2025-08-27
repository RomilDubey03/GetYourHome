import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { BsFillBookmarksFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addSavedListing , removeSavedListing} from "../redux/user/userSlice";
import axios from "axios";



export default function ListingItem({ listing }) {

  const {currentUser} = useSelector(state => state.user)
  const dispatch = useDispatch()

  async function addToBookMarkHandler(listingId) {

    if(currentUser){
      try {
        dispatch(addSavedListing(listingId))
        const {data} = await axios.post(`/api/listing/save/${listingId}`)
      } catch (error) {
        if(error.response){
          alert(error.response.data.message);
        }
        else{
          alert(error.message);
        }
      }
    }
    else{
      alert('You must be logged in first')
    }
  } 

  async function removeFromBookMarkHandler(listingId) {
    if(currentUser){
      try {
        dispatch(removeSavedListing(listingId))
        const {data} = await axios.post(`/api/listing/save/${listingId}?type=unsave`)
      } catch (error) {
        if(error.response){
          alert(error.response.data.message);
        }
        else{
          alert(error.message);
        }
      }
    }
    else{
      alert('You must be logged in first')
    }    
  }

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        </Link>
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-slate-700 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </div>
              <div className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </div>
            </div>

            {currentUser && currentUser.saved && currentUser.saved.length>0 &&  currentUser.saved.includes(listing._id)==true ? (
              <BsFillBookmarksFill onClick={()=>  removeFromBookMarkHandler(listing._id)} size={35} className="self-end hover:scale-125 transition-transform duration-200 hover:text-blue-500" />
            ) : (
              <MdOutlineBookmarkAdd onClick={()=>  addToBookMarkHandler(listing._id)} size={35} className="self-end hover:scale-125 transition-transform duration-200 hover:text-blue-500" />
            ) }

          </div>
        </div>
      
    </div>
  );
}
