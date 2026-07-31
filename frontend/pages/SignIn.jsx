import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Footer from "../components/Footer";

import { backendUrl } from "../src/config";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignin = async () => {
    setLoading(true);
    setErr("");

    try {
      const result = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/google-auth`,
        {
          fullname: result.user.displayName,
          email: result.user.email,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(data));
      navigate("/");
    } catch (error) {
      setErr("Google auth failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0e0e11] text-white font-sans">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111115] items-center justify-center border-r border-white/5 px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-semibold leading-tight mb-6">
            Welcome Back.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sign in to continue building your projects and managing your account.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-16 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">
              Sign in to your account
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials below.
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151519] border border-[#26262b] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#151519] border border-[#26262b] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={18} />
                  ) : (
                    <FaRegEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer transition"
              >
                Forgot password?
              </span>
            </div>

            {/* Error */}
            {err && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
                {err}
              </div>
            )}

            {/* Sign In Button */}
            <button
              onClick={handleSignin}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {loading ? <ClipLoader color="#fff" size={18} /> : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-[#26262b]" />
              <span className="px-4 text-xs text-gray-500 uppercase tracking-wider">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-[#26262b]" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 bg-[#151519] border border-[#26262b] hover:bg-[#1b1b21] text-sm font-medium py-3 rounded-lg transition-all duration-200"
            >
              <FcGoogle size={18} />
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium transition"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignIn;
