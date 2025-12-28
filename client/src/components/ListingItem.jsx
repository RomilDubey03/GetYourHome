import { Link } from "react-router-dom";
import { MdLocationOn, MdOutlineBookmarkAdd } from "react-icons/md";
import { BsFillBookmarksFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addSavedListing, removeSavedListing } from "../authSlice.js";
import axiosClient from "../utils/axiosClient.js";

export default function ListingItem({ listing }) {
  const { currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  async function addToBookMarkHandler(listingId) {
    if (currentUser) {
      try {
        dispatch(addSavedListing(listingId));
        await axiosClient.post(`/api/v1/listings/save/${listingId}`);
      } catch (error) {
        alert(error.message || 'Failed to save listing');
      }
    } else {
      alert('You must be logged in first');
    }
  }

  async function removeFromBookMarkHandler(listingId) {
    if (currentUser) {
      try {
        dispatch(removeSavedListing(listingId));
        await axiosClient.post(`/api/v1/listings/save/${listingId}?type=unsave`);
      } catch (error) {
        alert(error.message || 'Failed to unsave listing');
      }
    } else {
      alert('You must be logged in first');
    }
  }

  return (
    <div className="card group flex flex-col h-full overflow-hidden">
      <Link to={`/listing/${listing._id}`} className="relative block h-48 overflow-hidden">
        <img
          src={listing.imageUrls[0] || "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"}
          alt="listing cover"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {listing.offer && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
            Offer
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 truncate mb-1 group-hover:text-primary-600 transition-colors">
          {listing.name}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
          <MdLocationOn className="text-primary-500 shrink-0" />
          <p className="truncate">{listing.address}</p>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-grow">
          {listing.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <p className="text-primary-600 font-bold">
            ${listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && <span className="text-xs font-normal text-slate-500">/mo</span>}
          </p>

          {currentUser && currentUser.saved?.includes(listing._id) ? (
            <button onClick={() => removeFromBookMarkHandler(listing._id)} className="text-primary-500 hover:scale-110 transition-transform">
              <BsFillBookmarksFill size={18} />
            </button>
          ) : (
            <button onClick={() => addToBookMarkHandler(listing._id)} className="text-slate-400 hover:text-primary-500 transition-colors">
              <MdOutlineBookmarkAdd size={20} />
            </button>
          )}
        </div>

        <div className="flex gap-3 mt-2 text-xs text-slate-500">
          <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
          <span>•</span>
          <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
        </div>
      </div>
    </div>
  );
}
