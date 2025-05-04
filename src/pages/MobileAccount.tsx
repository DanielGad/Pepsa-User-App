import {  FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AccountIcon from "../assets/images/account-icon-white.png"
import OrdersIcon from "../assets/images/list-icon.png"
import ChangePasswordIcon from "../assets/images/change-password.png"
import Footer from "../components/Footer";
import ChangePasswordModal from "../components/ChangePassword";
import { useState } from "react";

const MobileAccount = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="lg:hidden">
        <div className="mt-[-20px] mb-10 flex justify-center gap-2 text-sm bg-gray-200 py-1 relative">
        <Link to={"/"}><span className="">Home</span></Link>
         &gt; 
         <span className="">My Account</span>
      </div>

        <div className="p-6 max-w-md mx-auto mb-10">
      <div className="bg-red-50 p-6 rounded-xl space-y-6">
        {/* My Details */}
        <Link to="/my-details">
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

          <div className="flex text-gray-700 items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
            <div className="flex items-center space-x-3" onClick={() => setOpenModal(true)}>
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
    <Footer />
    </div>
  );
};

export default MobileAccount;
