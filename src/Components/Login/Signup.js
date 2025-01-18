import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../utils/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const email = useRef();
    const password = useRef();
    const fullname = useRef();
    const phoneno = useRef();
    const role = useRef();
    const username = useRef();
    const [err, setErr] = useState();
    const [isLogging, setLogging] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Validation function
    function sign() {
        console.log(role?.current?.value);
        setLogging(true);
        if (!fullname.current.value || !email.current.value || !username.current.value || !password.current.value || !phoneno.current.value || !role.current.value || role.current.value === "ROLE") {
            setErr('All fields are Required');
            setLogging(false);
            setTimeout(() => {
                setErr();
            }, 2000);
            return;
        }
        const body = {
            "fullName": fullname?.current?.value,
            "email": email?.current?.value,
            "username": username?.current?.value,
            "password": password?.current?.value,
            "phoneno": phoneno?.current?.value,
            "role": role?.current?.value,
        };

        axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, body, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }).then(res => {
            console.log("Successfully created new Account");
            dispatch(login(res.data.data.user));
            navigate("/profile");
        }).catch(err => {
            console.log("Issue while creating the new account");
            setLogging(false);
        });
        console.log(body);
    }

    return (
        <>
            <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-2">
                <div className="hidden bg-gray-200 lg:block">
                    <img
                        src="https://img.freepik.com/free-vector/kids-studying-from-home-concept-illustration_114360-1762.jpg?t=st=1719916369~exp=1719919969~hmac=894a8f71cdea6ebe22bb1282973ceffdc18722eb82717b55f3a0c41fbcc28d56&w=740"
                        alt="Signup Illustration"
                        width="600"
                        height="800"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex items-center justify-center p-6 lg:p-10">
                    <div className="mx-auto w-full max-w-md space-y-6 bg-white  rounded-lg p-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-gray-900 text-3xl font-semibold tracking-tight">Welcome to ProLearning</h1>
                            <p className="text-gray-500">Sign Up to access your resources and information.</p>
                        </div>
                        <form className="grid gap-4" onClick={e => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="fullName">
                                        Full Name
                                    </label>
                                    <input id="fullname" ref={fullname} type="text" className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" placeholder="Full Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="username">
                                        Username
                                    </label>
                                    <input id="username" ref={username} type="text" className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" placeholder="Username" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                                    Email
                                </label>
                                <input id="email" ref={email} type="text" className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" placeholder="Email" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="phoneno">
                                    Phone No
                                </label>
                                <input id="phoneno" ref={phoneno} type="number" className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" placeholder="Phone No" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="role">
                                    Role
                                </label>
                                <select ref={role} className="flex-grow h-10 px-3 rounded-md border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                                    <option value="ROLE">Select Role</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="PARENT">Parent</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <input id="password" ref={password} type="password" className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" placeholder="Password" />
                            </div>

                            <div className="flex flex-col mt-6">
                                <button onClick={sign} className="cursor-pointer flex w-full justify-center items-center rounded-md bg-black hover:bg-gray-800 px-3 py-2 text-sm font-semibold text-white  focus:outline-none focus:ring-2 focus:ring-offset-2">
                                    {isLogging ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    ) : (
                                        "SIGN UP"
                                    )}
                                </button>
                            </div>
                            {err && <div className="text-red-500 font-medium mt-2">{err}</div>}
                        </form>

                        <div className="text-center mt-4">
                            Already have an account?{' '}
                            <Link className="text-blue-500 hover:underline" to={'/login'}>
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
