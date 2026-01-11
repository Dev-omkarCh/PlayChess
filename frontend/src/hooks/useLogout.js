import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

const useLogout = () => {

    const [ loading, setLoading ] = useState(false);
    const { logout : clearAuthData } = useAuthStore();
    
    const logout = async() => {
        setLoading(true);
        try{
            const res = await fetch(`/api/auth/logout`,{
                method : "DELETE",
                headers : { "Content-Type": "application/json"},
            });
            const data = await res.json();
            toast.success(data.msg);
            clearAuthData();
        }
        catch(e){
            toast.error(e.message);
        }
        finally{
            setLoading(false);
        }
    }
  return { logout, loading };
};


export default useLogout;
