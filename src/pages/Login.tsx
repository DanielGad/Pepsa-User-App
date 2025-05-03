import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4">
      <div className="bg-red-100 w-full text-center max-w-md py-6">
        <h1 className="text-2xl font-semibold text-black">Diadem Luxury</h1>
      </div>

      {/* Login Box */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-center text-lg font-medium mb-6">Login</h2>

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

        {/* Password */}
        <div className="mb-2">
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

        <div className="text-sm text-red-600 mb-6 text-left hover:underline cursor-pointer">
          Forgot password?
        </div>

        <button className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer">
          Login
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
