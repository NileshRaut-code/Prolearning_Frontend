import React, { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Header from '../Navbar/header.js'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import {  useLocation,useParams } from "react-router-dom";
import FormikRichText from "./index"
import axios from "axios";
const Editor =()=>{
const standard = parseInt(new URLSearchParams(useLocation().search).get('standard'), 10) || 0;


  const navigate=useNavigate()
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
   const [data,setdata]=useState("")
   const title=useRef("")
   const [err,seterr]=useState()
  //  console.log(data)
  const {id}=useParams()
  function newpost(){
    //console.log(data,title.current.value)
    if(data && title?.current?.value){
      const body={
        'name':title?.current?.value,
        'description':data,
        'chapterId':id,
        standard
      }
      console.log(body);
      axios.defaults.withCredentials=true;
      axios.post(`${process.env.REACT_APP_API_URL}/api/topics/`,body).then(res=>seterr('New Topic Created Succesfully')).catch(err=>seterr('Some Error Caught while Creating new Topic'))
     
    }
    else{
      console.log('data require to post');
      seterr('All Field Required')
      setTimeout(() => {
        seterr()
      }, 2000);
      return
      
    }
  }
    return <>
    <div className={`${isSideNavOpen? 'sm:ml-64': ''}`} >
   <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen}/>
   <div class="m-2 font-semibold text-xl flex flex-row ">
  <button className='px-2' onClick={()=>{navigate(-1)}}><IoIosArrowBack color='red' />
  </button>
  <p></p>

</div>
   <div className="  min-h-screen mx-auto p-4">
          <div className="md:w-1/2 mx-auto">
     <div className="p-4">
      <div className="mb-1">
            <label    className="py-2 block text-lg font-medium text-Black">
              Topic Title:
            </label>
            <input
              id="title"
              type="text"
               className="mt-1 p-2 border rounded-md bg-slate-100 w-full"
              ref={title}
            />
          </div></div>
   
          <div className="flex justify-center px-4">   <FormikRichText  value={data} setValue={setdata} /></div>

         
 <div className="px-4">     {err &&<p
              className="p-4 mb-4 text-sm text-red-800 rounded-lg  bg-gray-100 dark:text-red-400"
              role="alert"
            >
              {err}
            </p>}      <button className="bg-gray-800 hover:bg-blue-900  text-white py-2 px-4 rounded-md" onClick={newpost}>Add New Topic</button>
 </div>
 </div>
 </div>
   </div>

  </>
  
}

export default Editor;
