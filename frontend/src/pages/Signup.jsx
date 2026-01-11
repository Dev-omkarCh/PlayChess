import React, { useState } from "react";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { GiChessRook } from "react-icons/gi";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import useSignup from "../hooks/useSignup";
import { Link} from "react-router-dom";
import GenderSelect from "../components/GenderSelect";
import useAuthStore from "@/store/authStore";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { loading, signup } = useSignup();
  const [selectedGender, setSelectedGender] = useState(null);
  const { isAuthenticated, authUser  } = useAuthStore();

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ username, email, password, gender : selectedGender });
  };

  return (
    <div className="h-[100svh] w-[100svw] flex items-center justify-center bg-primary text-white ">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-[85%] max-w-sm border border-sectionBorder">
      <h2 className="text-3xl font-bold text-center mb-1 flex gap-2 justify-center items-center"><GiChessRook className="text-orange-500 text-3xl" /> Welcome</h2>
      <p className="text-gray-400 text-sm text-center mb-6">Signup to start playing Chess nerds</p>

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
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mt-5">
            <GenderSelect onSelect={(gender) => setSelectedGender(gender)} />
          </div>

          <div className="mt-5">
            <label className="block text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-2 pr-12 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <p className="text-center text-gray-400 my-4">
            Already have an account? <Link to="/login" className="text-green-500 hover:underline">login</Link>
          </p>
          <Button type={"submit"} text={loading ? <Spinner /> : "Signup"} disabled={loading} />
        </form>
      </div>
    </div>
  );
}
