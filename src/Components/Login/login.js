import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/userSlice";
import { useDispatch } from "react-redux";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const [err, setErr] = useState();
  const [isLogging, setloggin] = useState(false);

  function log() {
    setErr();
    setloggin(true);
    if (!email.current.value || !password.current.value) {
      setloggin(false);
      setErr("All Field are Required");
      return;
    }
    const body = {
      email: email.current.value,
      password: password.current.value,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/users/login`, body, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(login(res.data.data.loggedInUser));
        navigate(`/${res?.data?.data?.loggedInUser?.role}/dashboard`);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setErr("User Does not Exist");
        } else if (err.response.status === 401) {
          setErr("Wrong Password");
        } else {
          setErr("Some Other Error");
        }
        setloggin(false);
        setTimeout(() => {
          setErr();
        }, 4000);
      });
  }


  function handlegooglelogin(credentialResponse){
    const token=credentialResponse.credential;

    if(!token){
      setErr("Some Other Error");
      setTimeout(() => {
        setErr();
      }, 4000);
      return; 
    }

    axios
    .post(`${process.env.REACT_APP_API_URL}/api/users/google-login`, {token}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then((res) => {
      dispatch(login(res.data.data.loggedInUser));
      navigate(`/${res?.data?.data?.loggedInUser?.role}/dashboard`);
    })
    .catch((err) => {
      if (err.response.status === 404) {
        setErr("User Does not Exist");
      } else if (err.response.status === 401) {
        setErr("Wrong Password");
      } else {
        setErr("Some Other Error");
      }
      setloggin(false);
      setTimeout(() => {
        setErr();
      }, 4000);
    });

  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:block">
          <img
            src="https://img.freepik.com/free-vector/kids-studying-from-home-concept-illustration_114360-1762.jpg?t=st=1719916369~exp=1719919969~hmac=894a8f71cdea6ebe22bb1282973ceffdc18722eb82717b55f3a0c41fbcc28d56&w=740"
            alt="Illustration"
            width="800"
            height="800"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-black text-3xl font-semibold tracking-tight">
                Welcome to ProLearning
              </h1>
              <p className="text-gray-500">
                Sign in to access your resources and information.
              </p>
            </div>

            <form className="space-y-4 gap-2" onClick={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Email / Username
                </label>
                <input
                  ref={email}
                  className="border border-gray-300 bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-black focus:outline-none flex h-10 w-full rounded-md px-3 py-2 text-sm"
                  id="email"
                  placeholder="Enter your email or username"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  ref={password}
                  type="password"
                  className="border border-gray-300 bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-black focus:outline-none flex h-10 w-full rounded-md px-3 py-2 text-sm"
                  name="password"
                  required
                  placeholder="Enter a Password"
                />
              </div>

              <div className="flex flex-col mt-8">
                <button
                  onClick={log}
                  className="cursor-pointer flex w-full justify-center items-center rounded-md bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {isLogging ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Login"
                  )}
                </button>
<div className="mt-4">  <GoogleOAuthProvider clientId={process.env.CLIENT_ID}>
                  <GoogleLogin onSuccess={handlegooglelogin}
                  />
                </GoogleOAuthProvider> </div>
              
              </div>
              {err && (
                <div className="text-red-500 font-medium">
                  {err}
                </div>
              )}
            </form>

            <div className="text-center mt-4">
              New to ProLearning?{" "}
              <Link
                className="no-underline hover:underline text-gray-700 text-sm"
                to={"/signup"}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
