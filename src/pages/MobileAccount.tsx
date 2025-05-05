import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AccountIcon from "../assets/images/account-icon-white.png";
import OrdersIcon from "../assets/images/list-icon.png";
import ChangePasswordIcon from "../assets/images/change-password.png";
import Footer from "../components/Footer";
import ChangePasswordModal from "../components/ChangePassword";
import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext";

const MobileAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useFirebase();
  const [openModal, setOpenModal] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="lg:hidden">
      {/* Breadcrumb */}
      <div className="mt-[-20px] mb-4 flex justify-center gap-2 text-sm bg-gray-200 py-1">
        <Link to="/">Home</Link> &gt; <span>My Account</span>
      </div>

      {/* Welcome */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">
          Welcome{profile?.name ? `, ${profile.name}` : '!'}
        </h2>
      </div>

      <div className="p-6 max-w-md mx-auto mb-10">
        <div className="bg-red-50 p-6 rounded-xl space-y-6">
          {/* My Details */}
          <Link to="/my-details">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
              <div className="flex items-center space-x-3">
                <img src={AccountIcon} alt="Account Icon" className="w-7" />
                <span className="text-sm">My details</span>
              </div>
              <span>&gt;</span>
            </div>
          </Link>

          {/* Order History */}
          <Link to="/order-history">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
              <div className="flex items-center space-x-3">
                <img src={OrdersIcon} alt="Orders Icon" className="w-6" />
                <span className="text-sm">Order history</span>
              </div>
              <span>&gt;</span>
            </div>
          </Link>

          {/* Change Password */}
          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5"
            onClick={() => setOpenModal(true)}
          >
            <div className="flex items-center space-x-3">
              <img src={ChangePasswordIcon} alt="Change Password Icon" className="w-6" />
              <span className="text-sm">Change password</span>
            </div>
            <span>&gt;</span>
          </div>
          <ChangePasswordModal isOpen={openModal} onClose={() => setOpenModal(false)} />

          {/* Logout */}
          <div
            className="flex items-center justify-center space-x-3 text-[#a00000] font-semibold pt-4 cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="text-sm">Log out</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MobileAccount;
