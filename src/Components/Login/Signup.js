import React ,{useRef, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { login} from '../../utils/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
export const Signup = () => {
    const email=useRef()
    const password=useRef()
    const fullname=useRef()
    const phoneno=useRef()
    const role=useRef()
    const username=useRef()
    const [err,setErr]=useState()
    const [isLogging,setloggin]=useState(false)
    const dispatch=useDispatch()
    const navigate=useNavigate()

    // Validation function
    function sign(){
        console.log(role?.current?.value);
        setloggin(true)
        if (!fullname.current.value || !email.current.value || !username.current.value || !password.current.value || !phoneno.current.value || !role.current.value || role.current.value==="ROLE") {
            setErr('All fields are Required');
            setloggin(false)
            setTimeout(()=>{
                setErr()
            },2000)
            return;
        }
        const body={
            "fullName":fullname?.current?.value,
            "email": email?.current?.value,
   "username": username?.current?.value,
  "password": password?.current?.value,
  "phoneno":phoneno?.current?.value,
  "role":role?.current?.value,

        }

       axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`,body,{
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    }).then(res=>{console.log("Succesfully created new Account");dispatch(login(res.data.data.user));navigate("/profile")}).catch(err=>{console.log("Issue while creating the new account");setloggin(false)})
    console.log(body);
    }

  return (
<>

<div class="grid w-full min-h-screen grid-cols-1 lg:grid-cols-2">
  <div class="hidden bg-muted lg:block">
    <img
      src="https://img.freepik.com/free-vector/kids-studying-from-home-concept-illustration_114360-1762.jpg?t=st=1719916369~exp=1719919969~hmac=894a8f71cdea6ebe22bb1282973ceffdc18722eb82717b55f3a0c41fbcc28d56&w=740"
      alt="Login Illustration"
      width="600"
      height="800"
      class="h-full w-full object-cover"
    //   style="aspect-ratio: 600 / 800; object-fit: cover;"
    />
  </div>
  <div class="flex items-center justify-center p-6 lg:p-10">
    <div class="mx-auto w-full max-w-md space-y-6">
      <div class="space-y-2 text-center">
      <h1 className="text-foreground text-3xl font-bold tracking-tight">Welcome to the ProLearning</h1>
      <p className="text-muted-foreground">Sign Up to access your resources and information.</p>
      </div>
                        <form className="grid gap-2" onClick={e=>e.preventDefault()}>

                        <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                        <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="fullName"
            >
              Full Name
            </label>
                                <input id="fullname" ref={fullname} type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" name="text"  placeholder="fullname"/>
                           </div>

                                <div class="space-y-2">
                                <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="username"
            >
              Username
            </label>
                                <input id="usernaem" ref={username} type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" name="username"  placeholder="username"/>
                            </div>  </div>

                            
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="email"
          >
            Email
          </label>
                                <input id="email" ref={email} type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" name="email" placeholder="Email"/>
                           

              <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="phoneno"
          >
            Phone No
          </label>
                                <input id="password" ref={phoneno} type="Number" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" name="phoneno"  placeholder="Phone No"/>
                            
              <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="Role"
          >
            Role
          </label>            
    <select ref={role} className="flex-grow h-8 px-2 rounded border border-grey-400 text-gray-500">
        <option className='' value={"ROLE"}>Role</option>
        <option value="STUDENT">Student</option>
        <option value="PARENT">Parent</option>
    </select>

                          
                           
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="Password"
          >
            Password
          </label>
                                <input id="password" ref={password} type="password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" name="password"  placeholder="Password"/>
                         
                           <div className="flex flex-col mt-4 ">
                                <button onClick={sign} className="cursor-pointer flex w-full justify-center items-center rounded-md bg-[#FF726E] hover:bg-[#FF728E] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {isLogging ? 
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> :
         
              "SIGN UP"}
                        </button>
                            </div>
                            {err &&  <div className="text-red-500 font-medium">{err}</div>}
                        </form>
                        
                        <div className="text-center mt-4">
                          Old to Prolearning ?  <Link className="no-underline hover:underline text-blue-dark text-sm text-blue-500" to={'/login'}>
                               Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
   
</>
  )
}
