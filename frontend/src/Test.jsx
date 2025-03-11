import React, { useState, useRef } from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useFriend } from './hooks/useFriend';

const EditProfileModal = ({ isOpen, onClose, user }) => {

  const [username, setUsername] = useState(user ? user.username : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { updateProfile } = useFriend();

  // const handleImageClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (!file.type.startsWith('image/')) {
  //       setErrors((prev) => ({ ...prev, profileImg: 'File must be an image' }));
  //       return;
  //     }
  //     if (file.size > 2 * 1024 * 1024) {
  //       setErrors((prev) => ({ ...prev, profileImg: 'File size must be less than 2MB' }));
  //       return;
  //     }
  //     setProfileImg(URL.createObjectURL(file));
  //     setErrors((prev) => ({ ...prev, profileImg: '' }));
  //   }
  // };

  const handleSave = () => {
    const newErrors = {};

    if ( username && username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (newPassword && newPassword.length > 0 && newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updateProfile(username, email, oldPassword, newPassword);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <FaTimes className="cursor-pointer" onClick={onClose} />
        </div>

        {/* ✅ Profile Image
        <div className="flex flex-col items-center mb-4">
          <div 
            className="w-24 h-24 rounded-full border-2 border-gray-600 overflow-hidden cursor-pointer transition-all hover:scale-105"
            // onClick={handleImageClick}
          >
            <img 
              src={profileImg} 
              alt={"profile"}
              className="w-full h-full object-cover flex justify-center items-center content-center"
            />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleImageChange} 
          />
          {errors.profileImg && <p className="text-red-500 text-sm">{errors.profileImg}</p>}
        </div> */}

        {/* ✅ Username */}
        <div>
          <label className="block text-sm">Username</label>
          <input 
            type="text" 
            className="w-full bg-gray-700 rounded p-2 text-white" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/* ✅ Email */}
        <div className="mt-3">
          <label className="block text-sm">Email</label>
          <input 
            type="email" 
            className="w-full bg-gray-700 rounded p-2 text-white" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* ✅ Old Password */}
        <div className="mt-3 relative">
          <label className="block text-sm">Old Password</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            className="w-full bg-gray-700 rounded p-2 text-white pr-10" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
          />
          <div 
            className="absolute right-3 top-9 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* ✅ New Password */}
        <div className="mt-3 relative">
          <label className="block text-sm">New Password</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            className="w-full bg-gray-700 rounded p-2 text-white pr-10" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <div 
            className="absolute right-3 top-9 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* ✅ Buttons */}
        <div className="flex justify-end mt-4">
          <button 
            className="bg-gray-600 text-white px-4 py-2 rounded mr-2" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded" 
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};


export default EditProfileModal;
