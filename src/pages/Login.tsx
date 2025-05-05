import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";
import { FirebaseError } from "firebase/app";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useFirebase();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
      if (success) setSuccess(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, success]);

  // 🔍 Unified resolver for email from identifier (phone or email)
  const resolveEmailFromIdentifier = async (identifier: string): Promise<string> => {
    if (identifier.includes("@")) return identifier; // It's already an email
  
    // Query authIdentifiers where phoneNumber matches
    const q = query(
      collection(db, "authIdentifiers"),
      where("phoneNumber", "==", identifier)
    );
  
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      throw new FirebaseError("auth/user-not-found", "No account found with this phone number.");
    }
  
    const docData = querySnapshot.docs[0].data();
    const email = docData?.email;
  
    if (!email || typeof email !== "string") {
      throw new FirebaseError("auth/invalid-email", "Resolved email is invalid.");
    }
  
    return email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const loginEmail = await resolveEmailFromIdentifier(identifier);

      await login(loginEmail, password);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/account"), 3500);

    } catch (err: unknown) {
      let message = "Login failed. Please try again.";
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
            message = "No account found for this email or phone number.";
            break;
          case "auth/wrong-password":
            message = "Incorrect password.";
            break;
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          case "auth/invalid-credential":
            message = "Incorrect email or password.";
            break;
          default:
            message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/account");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 relative">
      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-md">
          <FaCheckCircle />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-md">
          <FaExclamationCircle />
          {error}
        </div>
      )}

      <div className="bg-red-100 w-full text-center max-w-md py-6">
        <h1 className="text-2xl font-semibold text-black">Diadem Luxury</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md">
        <h2 className="text-center text-lg font-medium mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-800 mb-1">
            Email or Phone number
          </label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or +2348012345678"
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <div className="text-sm text-red-600 mb-6 text-left hover:underline cursor-pointer">
          Forgot password?
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
