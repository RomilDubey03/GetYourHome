import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import OwnerListings from "../components/profile-component/OwnerListings";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { AiOutlineMenu } from "react-icons/ai";
import SideBarContent from "../components/profile-component/SideBarContent";
import SavedListings from "../components/profile-component/SavedListings";


function ProfileDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("profile");
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Button onClick={() => setIsOpen(true)} className="m-4 mb-0">
        <AiOutlineMenu className="h-6 w-6" />
      </Button>
      <SideBarContent isOpen={isOpen} handleClose={handleClose} />

      {/* Profile Tab */}
      {tab === "profile" && <Profile />}
      {/* Your Listings Tab */}
      {tab === "your-listings" && <OwnerListings />}
      {/* Saved Listings Tab */}
      {tab === 'saved' && <SavedListings />}

    </div>
  );
}

export default ProfileDashboard;
