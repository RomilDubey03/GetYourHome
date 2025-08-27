import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from 'axios'

function SignUp() {
  const [formData, setFormData] = useState({
    username : "",
    email : "",
    password : "",
  });
  const [error , setError] = useState(null)
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((data)=>{
      return {...data , [e.target.id]:e.target.value}
    })
  };

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(formData);
    setLoading(prev => true)
    
    try {
      const {data} = await axios.post('/api/auth/signup' , formData , {
        withCredentials : true,
      } )
      navigate('/sign-in')
      
    } catch (error) {
      if(error.response){
        setError(error.response.data.message)
      }
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        {/* <OAuth/> */}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

export default SignUp;
