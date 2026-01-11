import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const useSignup = () =>{
    const [ loading,setloading ] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser, setIsAuthenticated } = useAuthStore();

    const signup = async({ username, email, password, gender }) =>{
        
        setloading(true);
        const success = validation( username, email, password, gender );
        if(!success) {
            setloading(false);
            return;
        }

        try{
            const response = await axios.post("/api/auth/signup",{ 
                username, email, password, gender 
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
            setloading(false);
        }
    };
    return { loading, signup };
};

function validation( username, email, password, gender){
    if(!username || !password || !email || !gender){
        toast.error("Please fill in all Fields");
        return;
    }
    if(password.length < 6){
        toast.error("Password must be atleast 6 characters");
        return false;
    }
    if(gender !== "male" && gender !== "female" && gender !== "other"){
        toast.error("Invalid gender Entered");
        return false;
    }
    return true;
};

export default useSignup;