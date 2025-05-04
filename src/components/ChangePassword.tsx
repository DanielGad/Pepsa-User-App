import { useState } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // You can validate and submit here
    console.log({ currentPassword, newPassword, confirmPassword });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-10 fixed inset-0 z-10 bg-red-100 bg-opacity-30 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-[90%] max-w-md p-6 pt-15 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-5xl text-gray-500 hover:text-red-600 cursor-pointer focus:outline-none"
        >
          &times;
        </button>

        {/* Header */}
        <div className="bg-red-100 py-4 rounded-t text-center mb-6">
          <h1 className="text-2xl font-semibold text-black">Change Password</h1>
        </div>

        {/* Current Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* New Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-1">Enter New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
