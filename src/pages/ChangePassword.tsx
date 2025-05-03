// import { Link } from "react-router-dom";

const ChangePassword = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4">
      <div className="bg-red-100 w-full text-center max-w-md py-6">
        <h1 className="text-2xl font-semibold text-black">Change Password</h1>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
            Current Password
          </label>
          <input
            type="text"
            id="text"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Enter New Password
          </label>
          <input
            type="text"
            id="text"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <div className="mb-15">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Confirm New Password
          </label>
          <input
            type="text"
            id="text"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <button className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer">
          Save
        </button>

      </div>
    </div>
  );
};

export default ChangePassword;
