import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login} = useLogin();
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="h-dvh w-[100svw] flex items-center justify-center bg-primary text-white">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-[85%] max-w-sm border border-sectionBorder">
      <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
      <p className="text-gray-400 text-center mb-6">Please enter your details</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mt-5">
            <label className="block text-gray-400">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div className="mt-4 relative">
            <label className="block text-gray-400">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {/* Toggle Password Button */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-all duration-300"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEyeSlash size={22} className="hover:scale-110  transition-transform duration-300" />
                ) : (
                  <FaEye size={22} className="hover:scale-110 hover:text-gray-800 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
          <p className="text-left text-gray-400 my-4">
              Don't have an account? <Link to="/signup" className="text-green-500 hover:underline">Signup</Link>
          </p>

          {/* Login Button with Animation */}
          <Button type={"submit"} text={loading ? <Spinner /> : "Login"} disabled={loading} shadow={"6b21a8"} color={"green"} />
        </form>
      </div>
    </div>
  );
}


