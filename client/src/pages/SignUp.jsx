import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import OAuth from "../components/OAuth.jsx";
import api from "../utils/api.js";

function SignUp() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/signup', formData);
      navigate('/sign-in');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
            <p className="text-slate-500 text-sm">Join us to find your perfect place</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Username"
                className="input-field pl-10"
                id="username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                className="input-field pl-10"
                id="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                className="input-field pl-10"
                id="password"
                onChange={handleChange}
                required
              />
            </div>

            <button disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>Sign Up <FaArrowRight className="text-sm" /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 text-xs">or</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <OAuth />

          <p className="text-center mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;