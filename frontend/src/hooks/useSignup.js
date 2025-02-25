import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";

const useSignup = () =>{
    const [ loading,setloading ] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const signup = async({ username, email, password, gender }) =>{
        
        setloading(true);
        const success = validation( username, email, password, gender );
        if(!success) return setloading(false);

        try{
            const res = await fetch(`/api/auth/signup`,{
                method : "POST",
                headers : { "Content-Type": "application/json"},
                body : JSON.stringify({ username, email, password, gender})
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