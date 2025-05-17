import Lefticon from "../assets/images/left-icon.png";
import UserIcon from "../assets/images/users-icon.png";
import Target from "../assets/images/target.png";
import Car from "../assets/images/Car.png";
import Bike from "../assets/images/Bike.png";
import Van from "../assets/images/van.png";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { getUserId, useSpinner } from "../components/CartContext";
import useAutoLogout from "../components/AutoLogout";

const DeliveryRequest = () => {
  useAutoLogout()
  const navigate = useNavigate();
  const { showSpinner } = useSpinner();
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    deliveryLocation: "",
    buildingNo: "",
    phone: "",
    address: "",
    landmark: "",
    houseNo: "",
    itemDetails: "",
  });

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUserProfile(userId);
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setSaving(true);
      const response = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const userData = await response.json();

      setFormData({
        name: userData.name || "",
        deliveryLocation: userData.address || "",
        buildingNo: userData.houseNo || "",
        phone: userData.phone || "",
        address: userData.address || "",
        landmark: userData.landmark || "",
        houseNo: userData.houseNo || "",
        itemDetails: "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.deliveryLocation.trim()) errors.deliveryLocation = "Delivery location is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.buildingNo.trim()) errors.buildingNo = "Building number is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      setSaving(true);
      const userId = getUserId();
      if (!userId) {
        navigate("/login");
        return;
      }
  
      // First fetch the current user data
      const response = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch user data");
      
      const userData = await response.json();
      
      // Update the user data with the form values
      const updatedUser = {
        ...userData,
        name: formData.name,
        address: formData.deliveryLocation,
        houseNo: formData.buildingNo,
        phone: formData.phone,
        landmark: formData.landmark,
      };
  
      // Send the update to the server
      const updateResponse = await fetch(
        `https://680ead7467c5abddd192c3df.mockapi.io/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );
  
      if (!updateResponse.ok) throw new Error("Failed to update delivery request");

      showSpinner("success", "Delivery request saved successfully!");
      setTimeout(() => {
      navigate("/checkout");
      }, 1500);
    } catch (err) {
      console.error("Error saving delivery request:", err);
      showSpinner("error", "There was an error saving your delivery request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-5 md:mx-40 mt-[-10px]">
      <div className="md:hidden flex items-center justify-between">
        <div className="flex items-center space-x-4 mb-4">
          <img src={Lefticon} alt="Back" className="w-auto h-8" />
          <span className="font-semibold text-lg text-gray-700">Delivery Request</span>
        </div>
        <img src={UserIcon} alt="User Icon" className="w-auto h-9 pb-2" />
      </div>

      <h2 className="font-bold text-xl">Deliver To</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 mt-4">
          <label className="mb-1 font-semibold text-md">Delivery Location</label>
          <div className="relative">
            <img src={Target} alt="Target" className="absolute ml-2 mt-3" />
            <input
              type="text"
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
              placeholder="Eleyele-Arulogun road"
              className="border border-gray-600 rounded-lg p-2 pl-7 w-full"
            />
            {formErrors.deliveryLocation && <p className="text-red-500 text-sm">{formErrors.deliveryLocation}</p>}
          </div>

          <label className="font-semibold text-md">Name (Shop/Person)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Adebayo"
            className="border border-gray-600 rounded-lg p-2 pl-6"
          />
          {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

          <label className="font-semibold text-md">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08123456789"
            className="border border-gray-600 rounded-lg p-2 pl-6"
          />
          {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}

          <label className="font-semibold text-md">Building/Floor Number</label>
          <input
            type="text"
            name="buildingNo"
            value={formData.buildingNo}
            onChange={handleChange}
            placeholder="No 1"
            className="border border-gray-600 rounded-lg p-2 pl-6"
          />
          {formErrors.buildingNo && <p className="text-red-500 text-sm">{formErrors.buildingNo}</p>}

          <label className="font-semibold text-md">Landmark/Busstop</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Oju-irin Akobo"
            className="border border-gray-600 rounded-lg p-2 pl-6"
          />

          <label className="font-semibold text-md">Item Details</label>
          <select
            name="itemDetails"
            value={formData.itemDetails}
            onChange={handleChange}
            className="border border-gray-600 rounded-lg p-2 pl-6"
          >
            <option value="">Select</option>
            <option value="item1">Item 1</option>
            <option value="item2">Item 2</option>
            <option value="item3">Item 3</option>
          </select>

          <h2 className="text-xl font-semibold text-gray-600 mt-2">Vehicle Type</h2>
          <div className="flex items-center justify-between md:justify-start space-x-4">
            <img src={Bike} alt="Bike" className="h-20 w-auto cursor-pointer" />
            <img src={Car} alt="Car" className="h-20 w-auto cursor-pointer" />
            <img src={Van} alt="Van" className="h-20 w-auto cursor-pointer" />
          </div>

          <div>
            <input type="checkbox" className="accent-red-600" required />
            <label className="ml-2 font-semibold text-md">
              I accept all the Terms & Conditions and confirm no restricted items are in the package.
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#a00000] text-white font-semibold py-3 px-4 rounded-lg mt-4 w-full md:w-[20%] mb-10 flex items-center justify-center"
        >
          {saving && <FaSpinner className="animate-spin mr-2" />}
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default DeliveryRequest;
