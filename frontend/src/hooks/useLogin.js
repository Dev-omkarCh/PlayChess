import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';
import axios from 'axios';
import useAuthStore from '@/store/authStore';

const useLogin = () => {

    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser, setIsAuthenticated } = useAuthStore();
    
    const login = async({ username, password }) => {

        setLoading(true);
        const success = validation( username, password );
        if(!success) {
            setLoading(false);
            return;
        }

        try{
            const response = await axios.post("/api/auth/login",{ 
                username, password
            });

            const data = response.data;

            setAuthUser(data);
            setIsAuthenticated(true);
            navigate("/menu");
        }
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
            console.error("Error:", error);
            toast.error(errorMessage);
        }
        finally{
            setLoading(false);
        }
    }
  return { login, loading }
}

function validation( username, password){
    if(!username || !password){
        toast.error("Please fill in all Fields");
        return false;
    }
    if(password.length < 6){
        toast.error("Password must be atleast 6 characters");
        return false;
    }
    return true;
};

export default useLogin;
