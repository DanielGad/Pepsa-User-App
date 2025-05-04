import {  FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AccountIcon from "../assets/images/account-icon-white.png"
import OrdersIcon from "../assets/images/list-icon.png"
import ChangePasswordIcon from "../assets/images/change-password.png"
import NGN from "../assets/images/NGN.png";
import Footer from "../components/Footer";
import { useState } from "react";
import ChangePasswordModal from "../components/ChangePassword";


const MyAccount = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="hidden lg:block">
        <div className="flex flex-row justify-center gap-10 mb-10">
          <div className="p-6 mb-10 w-[400px]">
            <div className="bg-red-50 p-6 rounded-xl space-y-6">
              {/* My Details */}
              <Link to="/account">
                <div className="flex text-gray-700 items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
                  <div className="flex items-center space-x-3">
                    <img src={AccountIcon} alt="Account Icon" className="w-7" />
                    <span className="text-sm">My details</span>
                  </div>
                  <span>&gt;</span>
                </div>
              </Link>

              <Link to="/order-history">
                <div className="flex text-gray-700 items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
                  <div className="flex items-center space-x-3">
                    <img src={OrdersIcon} alt="Orders Icon" className="w-6"/>
                    <span className="text-sm">Order history</span>
                  </div>
                  <span>&gt;</span>
                </div>
              </Link>


                <div className="flex text-gray-700 items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5" onClick={() => setOpenModal(true)}>
                  <div className="flex items-center space-x-3">
                    <img src={ChangePasswordIcon} alt="Change Password Icon" className="w-6"/>
                    <span className="text-sm">Change password</span>
                  </div>
                  <span>&gt;</span>
                </div>
                <ChangePasswordModal isOpen={openModal} onClose={() => setOpenModal(false)} />


              {/* Logout */}
              <div className="flex items-center space-x-3 text-[#a00000] font-semibold justify-center pt-4 cursor-pointer">
                <FaSignOutAlt />
                <span>Log out</span>
              </div>
            </div>
          </div>



          <div className="flex flex-col items-center justify-center bg-white lg:px-4 mt-[-30px] shadow-xl">
            <div className="mt-8 w-full max-w-md px-4">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
                  Phone number
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <img
                      src={NGN}
                      alt="Nigeria flag"
                      className="w-5 h-5 mr-1"
                    />
                    <input type="tel" placeholder="+234" className="px-3 py-3 border border-gray-300 rounded-md text-gray-700 text-sm font-medium w-15"/>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter full address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
                />
              </div>


              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter full address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
                />
              </div>

              <div className="mb-15">
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                  House No
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter full address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
                />
              </div>

              <button className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer mb-5">
                Save
              </button>

            </div>
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default MyAccount