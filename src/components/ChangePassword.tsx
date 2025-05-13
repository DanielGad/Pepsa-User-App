import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import bcrypt from "bcryptjs";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHashedPassword: string;
  onChangePassword: (newHashedPassword: string) => Promise<void>;
}

const ChangePasswordModal = ({ 
  isOpen, 
  onClose, 
  // userId,
  currentHashedPassword,
  onChangePassword 
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [error, success]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, currentHashedPassword);
      if (!isMatch) {
        setError("The current password is incorrect.");
        setLoading(false);
        return;
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      // Call the parent component's password change handler
      await onChangePassword(newHashedPassword);

      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Password change error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-10 fixed inset-0 z-10 bg-red-100 bg-opacity-30 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-[90%] max-w-md p-6 pt-15 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          className="absolute top-2 right-5 text-5xl text-gray-500 hover:text-red-600 cursor-pointer focus:outline-none"
        >
          &times;
        </button>

        {/* Header */}
        <div className="bg-red-100 py-4 rounded-t text-center mb-6">
          <h1 className="text-2xl font-semibold text-black">Change Password</h1>
        </div>

        {/* Success or Error Message */}
        {error && (
          <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-md">
            <FaExclamationCircle />
            {error}
          </div>
        )}
        {success && (
          <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-md">
            <FaCheckCircle />
            {success}
          </div>
        )}

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
            disabled={loading}
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-1">Enter New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;