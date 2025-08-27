import React from "react";

import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function SideBarContent({ isOpen, handleClose }) {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <div>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <form className="pb-3 md:hidden">
                  <TextInput
                    icon={HiSearch}
                    type="search"
                    placeholder="Search"
                    required
                    size={32}
                  />
                </form>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Link to="/profile?tab=profile">
                      <Sidebar.Item icon={HiChartPie}>Profile</Sidebar.Item>
                    </Link>
                    <Link to="/profile?tab=your-listings">
                      <Sidebar.Item icon={HiShoppingBag}>
                        Your Listings
                      </Sidebar.Item>
                    </Link>
                    <Link to="/profile?tab=saved">
                      <Sidebar.Item icon={HiUsers}>Saved Listings</Sidebar.Item>
                    </Link>
                    {/* <Sidebar.Item href="/authentication/sign-in" icon={HiLogin}>
                      Sign in
                    </Sidebar.Item>
                    <Sidebar.Item
                      href="/authentication/sign-up"
                      icon={HiPencil}
                    >
                      Sign up
                    </Sidebar.Item> */}
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Link to={`/profile?tab=my-bookings`}>
                      <Sidebar.Item icon={HiClipboard}>
                        My-Bookings
                      </Sidebar.Item>
                    </Link>
                    <Link to={`/profile?tab=received-bookings`}>
                    <Sidebar.Item
                      icon={HiCollection}
                    >
                      Receieved Bookings
                    </Sidebar.Item>
                    </Link>
                    <Button
                      onClick={handleSignOut}
                      className="w-full"
                      gradientMonochrome="failure"
                    >
                      {" "}
                      <HiOutlineArrowLeft className="mr-2 h-5 w-5" /> Log Out
                    </Button>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </div>
  );
}

export default SideBarContent;
