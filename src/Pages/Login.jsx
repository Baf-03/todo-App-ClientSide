import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [loadingApi,setLoadingApi]=useState(false)
  const [formData, setFormData] = useState({
    email: null,
    password: null,
  });
  const navigate = useNavigate();
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingApi(true)
    try {
      const loginRsp = await axios.post(`${apiUrl}/api/login`, formData);
      localStorage.setItem("token", loginRsp.data.token);
      toast.success(`welcome ${formData.email}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      navigate("/");
      console.log(loginRsp);
    } catch (err) {
      toast.error('Either email or password is incorrect', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      setLoadingApi(false)
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://e0.pxfuel.com/wallpapers/664/987/desktop-wallpaper-harry-potter-patronus.jpg"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600">
              Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              disabled={loadingApi}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              disabled={loadingApi}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full ${
              loadingApi ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loadingApi}
          >
            {loadingApi ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-blue-500 text-center" disabled={loadingApi}>
          <Link to="/auth/register" className="hover:underline">
            Sign up Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
