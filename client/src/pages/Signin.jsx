import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {signInStart , signInSuccess , signInFailure} from '../redux/user/userSlice.js'
import OAuth from "../components/OAuth.jsx";

function Signin() {
  const [formData, setFormData] = useState({
    email : "",
    password : "",
  });
  
  const {loading , error} = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  


  const handleChange = (e) => {
    setFormData((data)=>{
      return {...data , [e.target.id]:e.target.value}
    })
  };

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(signInStart())
    
    try {
      const {data} = await axios.post('/api/auth/signin' , formData , {
        withCredentials : true,
      } )
      dispatch(signInSuccess(data))
      navigate('/')
      
    } catch (error) {
      if(error.response){
        dispatch(signInFailure(error.response.data.message))
      }
      else{
        dispatch(signInFailure(error.message))
      }
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:cursor-wait disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>        
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't Have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

export default Signin;
