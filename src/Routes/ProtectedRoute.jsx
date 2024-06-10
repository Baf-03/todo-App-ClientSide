import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Fixing the import statement
import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { isVerified, setLoading, updateEmail } from "../state/userSlice";
const apiUrl = import.meta.env.VITE_API_URL;
const ProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading ,verified} = useSelector((state) => state.userReducer);

 const pageNav =()=>{
  if(!verified){
    navigate("/auth/login")
  }
 }
    
const validateToken = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken.email)
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        dispatch(isVerified(false))
        dispatch(setLoading(true));
        pageNav()
      } 
      else{
        await axios.get(`${apiUrl}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        dispatch(setLoading(false));
        dispatch(isVerified(true))
        dispatch(updateEmail(decodedToken.email))

        const timeoutDuration = (decodedToken.exp - currentTime) * 1000;
        setTimeout(() => {
          localStorage.removeItem("token");
          dispatch(setLoading(true));
          dispatch(isVerified(false));
          pageNav()
        }, timeoutDuration);
      }
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(isVerified(false))
      dispatch(setLoading(true));
      pageNav()
     
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(isVerified(false))
        dispatch(setLoading(true));
        pageNav()
      } else {
        validateToken(token);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return loading ? "loading" : verified ? <Outlet /> : "User not verified";
};

export default ProtectedRoute;
