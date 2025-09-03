import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
const useGetAuthUser = () => {
    const {authUser, setAuthUser} = useState(null);
    useEffect(()=>{
        const fetchAuthUser = async () => {
        try {
            const response = await fetch("/api/auth/user",{
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            });

            if(!response.ok){
                throw new Error("Failed to fetch authenticated user");
            }
            const data = await response.json();
            
            setAuthUser(data);

            localStorage.setItem("user", JSON.stringify(data));
            toast.success("User data fetched successfully");

            return data;
        } catch (error) {
            console.error('Error fetching authenticated user:', error);
            toast.error(error?.message || "An error occurred while fetching user data");

            throw error;
        }
        };
        fetchAuthUser();
    },[authUser]);
};

export default useGetAuthUser;
