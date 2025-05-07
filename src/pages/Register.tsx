import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import bcrypt from "bcryptjs";

const Register: React.FC = () => {
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState({
    hasMinLength: false,
  });

  // Validate password length
  useEffect(() => {
    setPasswordErrors({ hasMinLength: password.length >= 6 });
  }, [password]);

  // Auto-dismiss
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const generateUserId = () => Math.random().toString(36).substring(2, 12);
  const hashPassword = async (pw: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pw, salt);
  };

  /** Fetches all users once and checks */
  const checkExisting = async (
    emailToCheck: string,
    phoneToCheck: string
  ): Promise<"email" | "phone" | null> => {
    const res = await fetch(
      "https://680ead7467c5abddd192c3df.mockapi.io/api/users"
    );
    if (!res.ok) throw new Error("Failed to validate uniqueness");
    const users: Array<{ email: string; phone: string }> = await res.json();

    // case-insensitive email match
    if (users.some(u => u.email.toLowerCase() === emailToCheck.toLowerCase())) {
      return "email";
    }

    // strip plus from country code
    const strippedCode = countryCode.replace("+", "");
    const fullPhone = strippedCode + phoneToCheck;
    if (users.some(u => u.phone === fullPhone)) {
      return "phone";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordErrors.hasMinLength) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const exists = await checkExisting(email, phone);
      if (exists === "email") {
        setError("An account with this email already exists.");
        return;
      }
      if (exists === "phone") {
        setError("An account with this phone number already exists.");
        return;
      }

      const hashed = await hashPassword(password);
      const newUser = {
        userId: generateUserId(),
        name,
        email,
        phone: countryCode.replace("+", "") + phone,
        password: hashed,
        createdAt: new Date().toISOString(),
        orders: [],
      };

      const postRes = await fetch(
        "https://680ead7467c5abddd192c3df.mockapi.io/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );
      if (!postRes.ok) throw new Error("Registration failed");

      setSuccess("Registration successful!");
      setTimeout(() => navigate("/account"), 1500);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentCountry =
    countryOptions.find(o => o.code === countryCode) || countryOptions[0];

  return (
    <div className="relative flex flex-col items-center justify-center bg-white md:px-4 mt-[-30px]">
      {/* Messages */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2 z-50">
          <FaCheck /> {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 z-50">
          <FaTimes /> {error}
        </div>
      )}

      <div className="bg-red-100 w-full text-center py-6 md:max-w-md">
        <h1 className="text-2xl font-semibold">Diadem Luxury</h1>
        <p className="text-sm">Powered By Pepsa.co</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md px-4">
        <h2 className="text-center text-lg font-medium mb-6">Register</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500"
            placeholder="Full name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone number</label>
          <div className="flex items-center gap-2">
            <ReactCountryFlag
              countryCode={currentCountry.countryCode}
              svg
              style={{ width: "20px", height: "15px" }}
            />
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="py-3 border border-gray-300 rounded-md"
            >
              {countryOptions.map(opt => (
                <option key={opt.code} value={opt.code}>
                  {opt.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500"
              placeholder="8012345678"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500"
            placeholder="••••••••"
          />
          <div className="mt-2 text-sm">
            <div
              className={`flex items-center ${
                passwordErrors.hasMinLength ? "text-green-600" : "text-gray-400"
              }`}
            >
              {passwordErrors.hasMinLength ? <FaCheck /> : <FaTimes />} At least 6 characters
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading && <FaSpinner className="animate-spin" />}
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
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