import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { useFirebase } from "../context/FirebaseContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  // addDoc,
  // serverTimestamp,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useFirebase();

  // Country options with code, countryCode (ISO 3166-1 alpha-2), and name
  const countryOptions = [
    { code: "+1", countryCode: "US", name: "United States" },
    { code: "+44", countryCode: "GB", name: "United Kingdom" },
    { code: "+234", countryCode: "NG", name: "Nigeria" },
    { code: "+233", countryCode: "GH", name: "Ghana" },
    { code: "+254", countryCode: "KE", name: "Kenya" },
    { code: "+27", countryCode: "ZA", name: "South Africa" },
    { code: "+33", countryCode: "FR", name: "France" },
    { code: "+49", countryCode: "DE", name: "Germany" },
    { code: "+61", countryCode: "AU", name: "Australia" },
    { code: "+81", countryCode: "JP", name: "Japan" },
    { code: "+86", countryCode: "CN", name: "China" },
    { code: "+91", countryCode: "IN", name: "India" },
    { code: "+971", countryCode: "AE", name: "United Arab Emirates" },
    { code: "+966", countryCode: "SA", name: "Saudi Arabia" },
    { code: "+20", countryCode: "EG", name: "Egypt" },
  ];

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState({
    // hasUpperCase: false,
    // hasNumber: false,
    hasMinLength: false,
  });

  // Get current country details
  const currentCountry = countryOptions.find(opt => opt.code === countryCode) || countryOptions[2];

  // Check password requirements
  useEffect(() => {
    setPasswordErrors({
      // hasUpperCase: /[A-Z]/.test(password),
      // hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 6,
    });
  }, [password]);

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
      if (success) setSuccess(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, success]);

  const checkExisting = async (emailToCheck: string, phoneToCheck: string) => {
    const identifiersRef = collection(db, "authIdentifiers");
  
    const q = query(
      identifiersRef,
      where("value", "in", [emailToCheck, `${countryCode}${phoneToCheck}`])
    );
  
    const snap = await getDocs(q);
    snap.forEach((doc) => {
      const data = doc.data();
      if (data.type === "email") {
        throw new Error("An account with this email already exists.");
      }
      if (data.type === "phone") {
        throw new Error("An account with this phone number already exists.");
      }
    });
  };
  
  // ✅ UPDATED handleSubmit: use addDoc to store email/phone
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    if (
      // !passwordErrors.hasUpperCase ||
      // !passwordErrors.hasNumber ||
      !passwordErrors.hasMinLength
    ) {
      setError(
        "Password must contain an uppercase letter, a number, and be at least 6 characters."
      );
      return;
    }
  
    setLoading(true);
    try {
      await checkExisting(email, phone);
  
      const phoneNumber = `${countryCode}${phone}`;
      await register({ email, phoneNumber, name, password });
  
      setSuccess("Registration successful!");
      setTimeout(() => navigate("/account"), 1500);
    } catch (err: unknown) {
      let message = "Registration failed. Please try again.";
  
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-email":
            message = "Please enter a valid email address.";
            break;
          case "auth/weak-password":
            message =
              "Password should be at least 6 characters with an uppercase letter and number.";
            break;
          case "auth/email-already-in-use":
            message = "This email is already in use.";
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

  return (
    <div className="flex flex-col items-center justify-center bg-white md:px-4 mt-[-30px] relative">
      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-red-100 w-full text-center py-6 md:max-w-md">
        <h1 className="text-2xl font-semibold text-black">Diadem Luxury</h1>
        <p className="text-sm">Powered By Pepsa.co</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md px-4">
        <h2 className="text-center text-lg font-medium mb-6">Register</h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            required
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@gmail.com"
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
            Phone number
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <div className="flex items-center px-2">
                <ReactCountryFlag 
                  countryCode={currentCountry.countryCode}
                  svg
                  style={{
                    width: '20px',
                    height: '15px',
                    marginRight: '8px',
                  }}
                  title={currentCountry.name}
                />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="py-3 text-gray-700 text-sm font-medium focus:outline-none"
                >
                  {countryOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="8012345678"
              required
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*********************"
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
          <div className="mt-2 text-sm text-gray-600">
            {/* <div className={`flex items-center ${passwordErrors.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordErrors.hasUpperCase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
              At least one uppercase letter
            </div>
            <div className={`flex items-center ${passwordErrors.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordErrors.hasNumber ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
              At least one number
            </div> */}
            <div className={`flex items-center ${passwordErrors.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordErrors.hasMinLength ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
              At least 6 characters
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="*********************"
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <FaSpinner className="animate-spin" />}
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700 mb-10">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;