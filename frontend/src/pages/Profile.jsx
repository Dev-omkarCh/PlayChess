import React, { useState, useEffect } from "react";
import { FiUser, FiEdit, FiSave, FiX, FiEye } from "react-icons/fi";
import Button from "../components/Button";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    username: "oliver",
    email: "oliver@example.com",
    gender: "",
    profilePic: "", 
  });

  const [editing, setEditing] = useState(false);
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [profileColor, setProfileColor] = useState("");

  useEffect(() => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500"];
    setProfileColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-lg text-center">
        <h2 className="text-3xl font-semibold mb-4 text-green-400">Profile</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          {profile.profilePic ? (
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-400"
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${profileColor}`}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
          <button onClick={() => { handle}} className="mt-2 text-blue-400 hover:text-blue-500">
            Change Profile Picture
          </button>
        </div>

        {/* All Input Fields */}
        <div className="mt-6 space-y-4">
          {["fullName", "username", "email"].map((field) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-gray-300 capitalize">{field}:</label>
              <input
                type="text"
                className="bg-gray-700 px-3 py-2 rounded w-2/3 shadow-[0_4px_0_#0f172a]"
                value={profile[field]}
                onChange={(e) =>
                  setProfile({ ...profile, [field]: e.target.value })
                }
                disabled={!editing}
              />
            </div>
          ))}

          {/* Gender Selection */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Gender:</label>
            <select
              className="bg-gray-700 px-3 py-2 rounded w-2/3 outline-none"
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              disabled={!editing}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-between">
          <Button className={"w-fit px-5"} handleOnClick={() => setEditing(!editing)} 
          text={editing ? <div className="flex justify-center items-center gap-2"><FiSave /> Save </div>  : <div className="flex justify-center items-center gap-2"><FiEdit /> Edit</div>} />
          <button
            className="w-fit px-5 mt-6 py-2 rounded-lg text-lg font-bold shadow-[0_4px_0_#b91c1c]
            active:translate-y-1 active:shadow-none transition-all duration-300 hover:scale-105 
            transform bg-red-500 hover:bg-red-600"
            onClick={() => setShowPasswordCard(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Card */}
      {showPasswordCard && <ChangePasswordCard onClose={() => setShowPasswordCard(false)} />}
    </div>
  );
}

// Change Password Card Component
function ChangePasswordCard({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <FiX size={20} />
        </button>
        <h3 className="text-2xl text-green-400 mb-4">Change Password</h3>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full bg-gray-700 px-3 py-2 rounded outline-none"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          
          {/* New Password Input */}
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              placeholder="New Password"
              className="w-full bg-gray-700 px-3 py-2 rounded outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FiEye
              className={`absolute right-3 top-3 cursor-pointer ${
                showPasswords.new ? "text-green-400" : "text-gray-400"
              }`}
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full bg-gray-700 px-3 py-2 rounded outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FiEye
              className={`absolute right-3 top-3 cursor-pointer ${
                showPasswords.confirm ? "text-green-400" : "text-gray-400"
              }`}
              onClick={() =>
                setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
              }
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <button
          className="w-full bg-green-500 hover:bg-green-600 mt-4 py-2 rounded shadow-md transition-all"
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
