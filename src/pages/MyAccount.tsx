import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AccountIcon from "../assets/images/account-icon-white.png";
import OrdersIcon from "../assets/images/list-icon.png";
import ChangePasswordIcon from "../assets/images/change-password.png";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import ChangePasswordModal from "../components/ChangePassword";
import { FaCheckCircle, FaExclamationCircle, FaEdit } from "react-icons/fa";
// import { useCart } from "../components/CartContext";


interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  houseNo: string;
}

const MyAccount: React.FC = () => {
  const navigate = useNavigate();
  // const { clearCart } = useCart();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    houseNo: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentHashedPassword, setCurrentHashedPassword] = useState("");


  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUserProfile(userId);
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      
      const userData = await response.json();
      setUser(userData);
      setCurrentHashedPassword(userData.password || ""); // Assuming password is stored hashed
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        landmark: userData.landmark || "",
        houseNo: userData.houseNo || "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };
  
  // Add password change handler
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
      console.error("Password update failed", err);
      throw err; // This will be caught by the modal
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    // clearCart()
    navigate("/login");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;
    
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            landmark: formData.landmark.trim(),
            houseNo: formData.houseNo.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling edit
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          landmark: user.landmark,
          houseNo: user.houseNo,
        });
      }
      setFormErrors({});
    }
    setIsEditing(!isEditing);
    setSuccess(null);
    setError(null);
  };

  // Auto-dismiss messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

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
        <p className="text-red-600 mb-4">Check your internet connection and try again</p>
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
    <div className="hidden lg:block">
      {/* Success and Error Messages */}
      {success && (
        <div className="fixed top-20 right-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2 animate-fade-in">
          <FaCheckCircle />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2 animate-fade-in">
          <FaExclamationCircle />
          {error}
        </div>
      )}

      <div className="text-center py-4">
        <h2 className="text-2xl font-semibold">
          Welcome, {user.name}!
        </h2>
      </div>

      <div className="flex flex-row justify-center gap-10 mb-10 mt-10">
        {/* Sidebar Navigation */}
        <div className="p-6 mb-10 w-[400px]">
          <div className="bg-red-50 p-6 rounded-xl space-y-6">
            <Link to="/account">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
                <div className="flex items-center space-x-3">
                  <img src={AccountIcon} alt="Account Icon" className="w-7" />
                  <span className="text-sm">My details</span>
                </div>
                <span>&gt;</span>
              </div>
            </Link>
            <Link to="/order-history">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer mb-5">
                <div className="flex items-center space-x-3">
                  <img src={OrdersIcon} alt="Orders Icon" className="w-6" />
                  <span className="text-sm">Order history</span>
                </div>
                <span>&gt;</span>
              </div>
            </Link>
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
            <div
              className="flex items-center space-x-3 text-[#a00000] font-semibold justify-center pt-4 cursor-pointer hover:text-red-800 transition-colors"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Log out</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="flex flex-col items-center justify-center bg-white lg:px-4 shadow-xl w-[500px] rounded-lg">
          <div className="mt-8 w-full max-w-md px-4">
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                Name
                {isEditing && <span className="text-red-600">*</span>}
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900 ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900 bg-gray-100"
              />
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
                Phone number
                {isEditing && <span className="text-red-600">*</span>}
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={true}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900 bg-gray-100`}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-1">
                Address
                {isEditing && <span className="text-red-600">*</span>}
              </label>
              <textarea
                id="address"
                rows={3}
                style={{ resize: "none" }}
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border ${
                  formErrors.address ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900 ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
              )}
            </div>

            {/* Landmark Field */}
            <div className="mb-4">
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-800 mb-1">
                Landmark
              </label>
              <input
                id="landmark"
                type="text"
                value={formData.landmark}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900 ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              />
            </div>

            {/* House Number Field */}
            <div className="mb-6">
              <label htmlFor="houseNo" className="block text-sm font-medium text-gray-800 mb-1">
                House No
              </label>
              <input
                id="houseNo"
                type="text"
                value={formData.houseNo}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900 ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              />
            </div>

            {/* Save/Edit Button */}
            <div className="flex gap-4 mb-10">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition disabled:opacity-50 cursor-pointer flex justify-center items-center"
                  >
                    {saving ? <ClipLoader size={20} color="#fff" /> : "Save"}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition flex justify-center items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;