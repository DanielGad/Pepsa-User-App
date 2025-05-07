// components/SpinnerMessage.tsx
import { FaSpinner, FaCheckCircle, FaTimes, FaExclamationCircle } from "react-icons/fa";
import React from "react";

type SpinnerMessageProps = {
  type: "loading" | "success" | "error" | "info";
  message: string;
  onClose?: () => void;
};

const iconMap = {
  loading: <FaSpinner className="animate-spin text-blue-500" />,
  success: <FaCheckCircle className="text-green-500" />,
  error: <FaTimes className="text-red-500" />,
  info: <FaExclamationCircle className="text-yellow-500" />,
};

const SpinnerMessage: React.FC<SpinnerMessageProps> = ({ type, message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div className="flex items-center space-x-2 bg-white border rounded-md shadow-lg px-4 py-2 min-w-[250px] max-w-sm">
        {iconMap[type]}
        <span className="text-gray-800 text-sm flex-1">{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default SpinnerMessage;
