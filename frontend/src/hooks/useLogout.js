import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const useLogout = () => {

    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    
    const logout = async() => {

        setLoading(true);
        try{
            const res = await fetch(`/api/auth/logout`,{
                method : "DELETE",
                headers : { "Content-Type": "application/json"},
            });
            const data = await res.json();
            // localStorage
            localStorage.removeItem("Chess-User");
            setAuthUser(null);
            toast.success(data.msg);
            // navigate("/menu");
        }
        catch(e){
            toast.error(e.message);
        }
        finally{
            setLoading(false);
        }
    }
  return { logout, loading }
}


export default useLogout;
