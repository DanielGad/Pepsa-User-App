import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AccountIcon from "../assets/images/account-icon-white.png";
import OrdersIcon from "../assets/images/list-icon.png";
import ChangePasswordIcon from "../assets/images/change-password.png";
import Footer from "../components/Footer";
import ChangePasswordModal from "../components/ChangePassword";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { getUserId, logoutUser } from "../components/CartContext";
import useAutoLogout from "../components/AutoLogout";
// import { useCart } from "../components/CartContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  houseNo: string;
  password?: string;
}

const MobileAccount: React.FC = () => {
  const navigate = useNavigate();
  useAutoLogout()
  // const {clearCart} = useCart();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentHashedPassword, setCurrentHashedPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 

  // Check if user is logged in and fetch profile
  useEffect(() => {
    const userId = getUserId();;
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        
        const userData = await response.json();
        setUser(userData);
        setCurrentHashedPassword(userData.password || "");
      } catch (err) {
        const message = (err as Error).message;

        if (
          message.includes("Failed to fetch") ||
          message.includes("ERR_NAME_NOT_RESOLVED") ||
          message.includes("NetworkError") ||
          message.includes("No internet")
        ) {
          setError("No internet connection");
        } else {
          setError(message || "Failed to load user profile");
        }
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handlePasswordChange = async (newHashedPassword: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            password: newHashedPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setCurrentHashedPassword(newHashedPassword);
    } catch (err) {
          const message = (err as Error).message;

    if (
      message.includes("Failed to fetch") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("NetworkError") ||
      message.includes("No internet")
    ) {
      setError("No internet connection, please try again.");
    } else {
      setError(message || "Password update Failed");
    }
      console.error("Password update failed", err);
      throw err;
    }
  };

  const handleLogout = () => {
    logoutUser()
    // clearCart();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={40} color="#E53E3E" />
        <div className="ml-3 text-[#E53E3E]">Please Wait...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">
          {error || "Check your internet connection and try again"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      {/* Breadcrumb */}
      <div className="mt-[-20px] mb-4 flex justify-center gap-2 text-sm bg-gray-200 py-1">
        <Link to="/">Home</Link> &gt; <span>My Account</span>
      </div>

      {/* Welcome */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">
          Welcome{user?.name ? `, ${user.name}` : '!'}
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
          
          <ChangePasswordModal 
            isOpen={openModal} 
            onClose={() => setOpenModal(false)}
            currentHashedPassword={currentHashedPassword}
            onChangePassword={handlePasswordChange}
          />

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