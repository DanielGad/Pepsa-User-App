import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import bcrypt from "bcryptjs";
import { setUserId } from "../components/CartContext";

interface User {
  id: string;
  email: string;
  phone: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // auto-dismiss
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  // fetch user by email or phone
  const findUserByIdentifier = async (id: string): Promise<User> => {
    const clean = id.trim();
    if (!clean) throw new Error("Please enter email or phone");

    const isEmail = clean.includes("@");
    let lookup = clean;
    if (!isEmail && lookup.startsWith("+")) {
      lookup = lookup.slice(1);
    }

    const param = isEmail ? "email" : "phone";
    const url = `https://680ead7467c5abddd192c3df.mockapi.io/api/users?${param}=${encodeURIComponent(
      lookup
    )}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No account found with this ${isEmail ? "email address" : "phone number"}`);

    // strongly type JSON
    const users: User[] = await res.json();

    const matched = users.find((u) =>
      isEmail
        ? u.email.toLowerCase() === clean.toLowerCase()
        : u.phone === lookup
    );

    if (!matched) {
      throw new Error(
        `No account found with this ${isEmail ? "email address" : "phone number"}`
      );
    }

    return matched;
  };

  const authenticateUser = async (id: string, pw: string): Promise<User> => {
    const user = await findUserByIdentifier(id);
    if (!user.password) throw new Error("Invalid account data");
    const match = await bcrypt.compare(pw, user.password);
    if (!match) throw new Error("Incorrect password");
    return user;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!identifier.trim() || !password.trim()) {
      setError("Fill in both fields");
      return;
    }

    setLoading(true);
    try {
      
      if (!navigator.onLine) {
      throw new Error("No internet connection");
    }
      const user = await authenticateUser(identifier, password);
      setUserId(user.id)
      setSuccess("Login successful!");
      setTimeout(() => navigate("/account"), 500);
    } catch (err: unknown) {
      console.error(err);
      const message = (err as Error).message;

    if (
      message.includes("Failed to fetch") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("NetworkError") ||
      message.includes("No internet")
    ) {
      setError("No internet connection");
    } else {
      setError(message || "Login failed");
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 relative">
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2 z-50">
          <FaCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 z-50">
          <FaExclamationCircle /> {error}
        </div>
      )}

      <div className="bg-red-100 w-full max-w-md text-center py-6">
        <h1 className="text-2xl font-semibold">Diadem Luxury</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-md px-4 space-y-4"
      >
        <h2 className="text-center text-lg font-medium">Login</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Email or Phone
          </label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or +2348012345678"
            className="w-full px-4 py-3 border rounded focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
          )}
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="text-center text-lg text-gray-700">
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
