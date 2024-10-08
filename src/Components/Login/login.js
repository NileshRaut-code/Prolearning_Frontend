import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/userSlice";
import { useDispatch } from "react-redux";
const Login = () => {
  // const id=useRef()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const [err, setErr] = useState();
  const [isLogging, setloggin] = useState(false);

  function log() {
    setErr();
    setloggin(true);
    if(!email.current.value || !password.current.value ){
      setloggin(false);
      setErr("All Field are Required")
      return
    }
    const body = {
      email: email.current.value,
      // "username": email.current.value,
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
          setErr()
        }, 4000);
      });
  }
  return (
    <>
     <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">

              <div className="hidden lg:block">
    <img src="https://img.freepik.com/free-vector/kids-studying-from-home-concept-illustration_114360-1762.jpg?t=st=1719916369~exp=1719919969~hmac=894a8f71cdea6ebe22bb1282973ceffdc18722eb82717b55f3a0c41fbcc28d56&w=740" alt="Illustration" width="800" height="800" className="h-full w-full object-cover" />
  </div>
  <div className="bg-background flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Welcome to the ProLearning</h1>
        <p className="text-muted-foreground">Sign in to access your resources and information.</p>
      </div>
         
                  <form
                    className="space-y-4 gap-2"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div >
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email"> Email / Username </label>
                      <input
                        ref={email}
                       className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="email" placeholder="Enter your email or username" required="" type="text"
                      />
                    </div>
                    <div >
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="Passowrd"> Passowrd </label>

                      <input
                        id="password"
                        ref={password}
                        type="password"
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        name="password"
                        required
                        placeholder="Enter a Password"
                      />
                    </div>
           
                    <div className="flex flex-col mt-8 ">
                      <button
                        onClick={log}
                        className="cursor-pointer flex w-full justify-center items-center rounded-md bg-[#FF726E] hover:bg-[#FF728E] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {isLogging ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>
                    {err && (
                     
                        <div className="text-red-500 font-medium">
                          {err}
                        </div>
                     
                    )}
                  </form>

                  <div className="text-center mt-4">
                    New to Prolearning ?{" "}
                    <Link
                      className="no-underline hover:underline text-blue-dark text-sm text-blue-500"
                      to={"/signup"}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
                </div>      </div>
                
              
       
     
    </>
  );
};

export default Login;
