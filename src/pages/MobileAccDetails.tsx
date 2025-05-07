import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  houseNo: string;
}

const MobileAccDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    houseNo: "",
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check authentication and fetch profile
  useEffect(() => {
    const userId = localStorage.getItem("userId");
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

    fetchUserProfile();
  }, [navigate]);

  // Auto-dismiss messages
  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
      if (success) setSuccess(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
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
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            landmark: formData.landmark,
            houseNo: formData.houseNo,
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
      <div className="text-center py-10 lg:hidden">
        <p className="text-red-600 mb-4">
          {error || "Failed to load profile data"}
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
    <section className='lg:hidden'>
      <div className="mt-[-20px] mb-10 flex justify-center gap-2 text-sm bg-gray-200 py-1 relative">
        <Link to={"/"}><span className="">Home</span></Link>
         &gt; 
         <Link to={"/account"}><span className="">My Account</span></Link>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center justify-center bg-white lg:px-4 mt-[-30px]">
        <div className="mt-8 w-full max-w-md px-4">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                !isEditing ? 'bg-gray-100' : ''
              }`}
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
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 bg-gray-100"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={true}
              className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 bg-gray-100`}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-1">
              Address
            </label>
            <textarea
              rows={3}
              id="address"
              style={{ resize: "none" }}
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                !isEditing ? 'bg-gray-100' : ''
              }`}
            />
          </div>

          {/* Landmark */}
          <div className="mb-4">
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-800 mb-1">
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              value={formData.landmark}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                !isEditing ? 'bg-gray-100' : ''
              }`}
            />
          </div>

          {/* House No */}
          <div className="mb-6">
            <label htmlFor="houseNo" className="block text-sm font-medium text-gray-800 mb-1">
              House No
            </label>
            <input
              type="text"
              id="houseNo"
              value={formData.houseNo}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 ${
                !isEditing ? 'bg-gray-100' : ''
              }`}
            />
          </div>

          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition disabled:opacity-50 mb-4"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition mb-4"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileAccDetails;