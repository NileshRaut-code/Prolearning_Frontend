import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { RiArrowDropDownLine } from "react-icons/ri";

const Avatar = () => {
    const[check,setcheck]=useState(true)
    const data = useSelector((store) => store.user.data);
    const getInitials = (name) => {
      if (!name) return '';
      const nameParts = name.split(' '); // Split the name by space
      const initials = nameParts.map(part => part[0].toUpperCase()); // Get the first letter of each part
      return initials.join(''); // Join the initials
    };
    var userName = data.fullName;
    const initials = getInitials(userName);
  return (
    
    <>
  

<div> <div className='flex flex-row'>

<div className='flex flex-row' onClick={()=>{setcheck(!check)}}>
<div   className="z-50   inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-[black] rounded-full dark:bg-blue-600">
                <span className="font-medium text-2xl text-white dark:text-gray-300">{initials}</span>
              </div>
              {/* <div className='mt-1'><RiArrowDropDownLine size={38}/></div> */}
              

</div>
</div></div>
    </>
  )
}

export default Avatar