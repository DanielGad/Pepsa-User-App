import { Link } from "react-router-dom";
import NGN from "../assets/images/NGN.png";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white md:px-4 mt-[-30px]">
      {/* Header */}
      <div className="bg-red-100 w-full text-center py-6 md:max-w-md">
        <h1 className="text-2xl font-semibold text-black">Diadem Luxury</h1>
        <p className="text-sm">Powered By Pepsa.co</p>
      </div>

      <div className="mt-8 w-full max-w-md px-4">
        <h2 className="text-center text-lg font-medium mb-6">Register</h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter full name"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="johndoe@gmail.com"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
            Phone number
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <img
                src={NGN}
                alt="Nigeria flag"
                className="w-5 h-5 mr-1"
              />
              <input type="tel" placeholder="+234" className="px-3 py-3 border border-gray-300 rounded-md text-gray-700 text-sm font-medium w-15"/>
            </div>
            <input
              type="tel"
              id="phone"
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="*********************"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="*********************"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <button className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer">
          Sign up
        </button>

        <p className="mt-6 text-center text-sm text-gray-700 mb-10">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
