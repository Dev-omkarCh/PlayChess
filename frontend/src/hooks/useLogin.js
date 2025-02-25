import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const useLogin = () => {

    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    
    const login = async({ username, password }) => {

        setLoading(true);
        const success = validation( username, password );
        if(!success) return setLoading(false);

        try{
            const res = await fetch(`/api/auth/login`,{
                method : "POST",
                headers : { "Content-Type": "application/json"},
                body : JSON.stringify({ username, password })
            });
            const data = await res.json();
            if(data.error) return toast.error(data.error);

            // localStorage
            localStorage.setItem("Chess-User",JSON.stringify(data));
            //context
            setAuthUser(data);
            navigate("/menu");
        }
        catch(e){
            toast.error(e.message);
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
