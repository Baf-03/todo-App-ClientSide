import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {

    const [formData,setFormData]=useState({
        email:null,
        password:null
    })
    const navigate =useNavigate()
    useEffect(()=>{
        console.log(formData)
    },[formData])
    const submitHandler =async(e)=>{
        e.preventDefault();
        try{
            const loginRsp =await axios.post(`${apiUrl}/api/login`,formData)
            localStorage.setItem("token",loginRsp.data.token)
            navigate("/")
            console.log(loginRsp)
        }
        catch(err){
            console.error(err)
        }
        
    }

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
 
    <div className="w-1/2 h-screen hidden lg:block">
      <img src="https://e0.pxfuel.com/wallpapers/664/987/desktop-wallpaper-harry-potter-patronus.jpg" alt="Placeholder Image" className="object-cover w-full h-full"/>
    </div>
    
    <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={submitHandler}>
       
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600">Username</label>
          <input type="text" id="username" name="username" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" onChange={(e)=>{
          setFormData((prev) => ({
            ...prev,
            email: e.target.value
          }))
          }} />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">Password</label>
          <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" onChange={(e)=>{
          setFormData((prev) => ({
            ...prev,
            password:e.target.value
          }))
          }}  />
        </div>
       
       
    
        <div className="mb-6 text-blue-500">
          <Link to="/auth/register" className="hover:underline">Forgot Password?</Link>
        </div>
    
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
      </form>
    
      <div className="mt-6 text-blue-500 text-center">
        <a href="#" className="hover:underline">Sign up Here</a>
      </div>
    </div>
    </div>

  )
}

export default Login
