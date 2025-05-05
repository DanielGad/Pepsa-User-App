import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AccountIcon from "../assets/images/account-icon-white.png";
import OrdersIcon from "../assets/images/list-icon.png";
import ChangePasswordIcon from "../assets/images/change-password.png";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import ChangePasswordModal from "../components/ChangePassword";
import { useFirebase } from "../context/FirebaseContext";

const MyAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, logout, updateUserProfile, refreshProfile } = useFirebase();
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

  // Redirect if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
        address: profile.address as string || "",
        landmark: profile.landmark as string || "",
        houseNo: profile.houseNo as string || "",
      });
    }
  }, [profile]);

  // Auto-dismiss messages
  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
      if (success) setSuccess(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSuccess(null);
    setError(null);
    
    try {
      // Update profile in Firebase
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        landmark: formData.landmark,
        houseNo: formData.houseNo,
      });

      // Force refresh the profile data in the context
      await refreshProfile();

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccess(null);
    setError(null);
  };

  if (loading || !profile) {
    return <div className="text-center py-10">Loading your account...</div>;
  }

  return (
    <div className="hidden lg:block">
      {/* Success and Error Messages */}
      {success && (
        <div className="fixed top-20 right-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}

      <div className="text-center py-4">
        <h2 className="text-2xl font-semibold">
          Welcome, {profile.name}!
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
            <ChangePasswordModal isOpen={openModal} onClose={() => setOpenModal(false)} />
            <div 
              className="flex items-center space-x-3 text-[#a00000] font-semibold justify-center pt-4 cursor-pointer" 
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">Name</label>
              <input 
                id="name" 
                type="text" 
                value={formData.name} 
                onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email Address</label>
              <input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                disabled={true}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 bg-gray-100"
              />
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">Phone number</label>
              <input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              />
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-1">Address</label>
              <textarea 
                id="address"
                rows={3}
                style={{ resize: "none" }}
                value={formData.address} 
                onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              />
            </div>

            {/* Landmark Field */}
            <div className="mb-4">
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-800 mb-1">Landmark</label>
              <input 
                id="landmark" 
                type="text" 
                value={formData.landmark} 
                onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              />
            </div>

            {/* House Number Field */}
            <div className="mb-6">
              <label htmlFor="houseNo" className="block text-sm font-medium text-gray-800 mb-1">House No</label>
              <input 
                id="houseNo" 
                type="text" 
                value={formData.houseNo} 
                onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                  !isEditing ? 'bg-gray-100' : ''
                }`}
              />
            </div>

            {/* Save/Edit Button */}
            {isEditing ? (
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition disabled:opacity-50 mb-10 cursor-pointer"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            ) : (
              <button 
                onClick={handleEditToggle} 
                className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition mb-10 cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;