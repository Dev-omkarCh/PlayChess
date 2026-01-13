const ProfileImage = ({ user }) => {

  if (!user?.profileImg) {
    return (
      <span className="text-white font-bold text-lg capitalize ">
        {user?.username?.charAt(0)?.toUpperCase()}
      </span>
    );
  };
  return (
    <img
      src={user?.profileImg}
      className="w-full h-full object-cover"
    />
  );
};

export default ProfileImage;