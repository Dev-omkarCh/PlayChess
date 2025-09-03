
const ProfileImage = ({ user, invalidateImage }) => {

    const profileImageVal = invalidateImage ? null : user?.profileImg;
    if (!profileImageVal) {
      return <span className="text-white font-bold text-lg capitalize ">{user?.username?.charAt(0)?.toUpperCase()}</span>
    }
    return <img src={profileImageVal} className="w-full h-full object-cover" />
  };

export default ProfileImage;