import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaSignOutAlt, FaUserEdit } from "react-icons/fa";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center my-8 text-slate-800 font-heading">Profile Settings</h1>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <div className="self-center relative group cursor-pointer" onClick={() => fileRef.current.click()}>
              <img
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="rounded-full h-32 w-32 object-cover border-4 border-gray-100 shadow-sm group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change</span>
              </div>
            </div>

            <p className="text-sm self-center text-center -mt-2 min-h-[20px]">
              {fileUploadError ? (
                <span className="text-red-500 font-medium">
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-600 font-medium">{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className="text-green-600 font-medium">
                  Image successfully uploaded!
                </span>
              ) : (
                ""
              )}
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                defaultValue={currentUser.username}
                id="username"
                className="input-field"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                id="email"
                defaultValue={currentUser.email}
                className="input-field"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Pasword"
                onChange={handleChange}
                id="password"
                className="input-field"
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full shadow-soft"
            >
              {loading ? "Loading..." : "Update Profile"}
            </button>
            <Link
              className="bg-green-600 text-white p-3 rounded-xl uppercase text-center hover:bg-green-700 shadow-soft transition-all duration-300 font-medium w-full block"
              to={"/create-listing"}
            >
              Create Listing
            </Link>
          </form>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <span
              onClick={handleDeleteUser}
              className="text-red-600 cursor-pointer hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
            >
              <FaTrash className="text-sm" /> Delete Account
            </span>
            <span onClick={handleSignOut} className="text-slate-500 cursor-pointer hover:text-slate-700 font-medium flex items-center gap-2 transition-colors">
              <FaSignOutAlt className="text-sm" /> Sign Out
            </span>
          </div>

          <p className="text-red-500 mt-5 text-center font-medium bg-red-50 p-2 rounded-lg empty:hidden">{error ? error : ""}</p>
          <p className="text-green-600 mt-5 text-center font-medium bg-green-50 p-2 rounded-lg empty:hidden">
            {updateSuccess ? "User is updated successfully!" : ""}
          </p>
        </div>

        <div className="mt-8">
          <button onClick={handleShowListings} className="text-primary-600 w-full font-semibold hover:text-primary-700 transition-colors flex items-center justify-center gap-2">
            Show Your Listings
          </button>
          <p className="text-red-500 mt-3 text-center">
            {showListingsError ? "Error showing listings" : ""}
          </p>
        </div>

        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4 mt-8">
            <h1 className="text-center text-2xl font-bold text-slate-800 font-heading mb-4">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                </Link>
                <Link
                  className="text-slate-800 font-semibold hover:text-primary-600 truncate flex-1 transition-colors"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center gap-2">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-600 uppercase text-xs font-bold hover:text-red-800 border border-red-100 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-primary-600 uppercase text-xs font-bold hover:text-primary-800 border border-primary-100 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors w-full">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
