import ProfileSideBar from '../components/profile/ProfileSideBar';
import ProfileMainSection from '../components/profile/ProfileMainSection';
import { useFriend } from '../hooks/useFriend';
import { useEffect } from 'react';

const ProfilePage = () => {

  const { getProfileDetails } = useFriend();

  useEffect(()=>{
    getProfileDetails();
  },[])

  return (
    <div className=" h-dvh w-dvw text-white flex">
      <ProfileSideBar />
      <ProfileMainSection />
    </div>
  );
};

export default ProfilePage;
