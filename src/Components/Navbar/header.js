import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa";
import Avatar from "./avatar";
import { useSelector } from "react-redux";
import { IoIosHome } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { GrDocumentPerformance } from "react-icons/gr";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

const Header = ({ isSideNavOpen, setIsSideNavOpen }) => {
  const data = useSelector((store) => store.user.data);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const [isTestDropdownOpen,setTestDropdownOpen]=useState(true)
  const toggleTestDropdown =()=>{
    setTestDropdownOpen(!isTestDropdownOpen)
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-[#FF725E] border-b border-black">
        <div className="max-w-screen-2xl flex items-center justify-between mx-auto p-4">
   <div className="flex flex-row ">
   {!isSideNavOpen && (
            <button
              onClick={toggleSideNav}
              className="p-2 bg-[#FF725E] text-white rounded-full focus:outline-none"
            >
              <FaAlignJustify />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-semibold text-white">
              HI! {data?.fullName}
            </span>
          </div>
   </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center justify-center rounded-full focus:outline-none"
            >
              <Avatar />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Link
                  to={`/${data?.role}/dashboard`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Home
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Profile
                </Link>
                <Link
                  to="/logout"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold">Prolearning</h1>
          <button
            onClick={toggleSideNav}
            className="p-2 text-black bg-gray-200 rounded-full"
          >
            <IoMdClose size={20} />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-2">
          <Link
            to={`/${data?.role}/dashboard`}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
          >
            <IoIosHome size={20} className="text-red-500" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          {data?.role !== "PARENT" && (
            <Link
              to="/studymaterial"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
            >
              <FaBookOpen size={20} className="text-red-500" />
              <span className="text-sm font-medium">Study Material</span>
            </Link>
          )}
       {data?.role === "STUDENT" &&   <Link
            to={`/${data?.role}/test`}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
          >
            <FaRegPenToSquare size={20} className="text-red-500" />
            <span className="text-sm font-medium">MCQ Test</span>
          </Link>}
          {data?.role === "TEACHER" &&   <Link
            to={`/${data?.role}/check/ptest`}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
          >
            <FaRegPenToSquare size={20} className="text-red-500" />
            <span className="text-sm font-medium">Physical Test Check</span>
          </Link>}
          {data?.role === "STUDENT" && (
            <Link
              to={`/${data?.role}/physical-test`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
            >
              <FaRegPenToSquare size={20} className="text-red-500" />
              <span className="text-sm font-medium">Physical Test</span>
            </Link>
          )}
          {data?.role === "STUDENT" && (
            <Link
              to={`/${data?.role}/community`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
            >
              <FaPeopleGroup size={20} className="text-red-500" />
              <span className="text-sm font-medium">Community</span>
            </Link>
          )}
          {data?.role !== "TEACHER" && (
            <Link
              to={`/${data?.role}/performance`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
            >
              <GrDocumentPerformance size={20} className="text-red-500" />
              <span className="text-sm font-medium">Performance</span>
            </Link>
          )}

{(data?.role === "STUDENT" || data?.role === "TEACHER") && (
      <div className="relative">
        <button
          className="flex items-center gap-2 p-2 w-full text-left rounded-md hover:bg-[#FF725E] hover:text-white transition-colors"
          onClick={toggleTestDropdown}
        >
          <FaRegPenToSquare size={20} className="text-red-500" />
          <span className="text-sm font-medium">Test</span>
        </button>
        {isTestDropdownOpen && (
          <div className="ml-4 mt-2 bg-white shadow-md rounded-md">
            {data?.role === "STUDENT" && (
              <>
                <Link
                  to={`/${data?.role}/test`}
                  className="block px-4 py-2 text-gray-800 hover:bg-[#FF725E] hover:text-white"
                >
                  MCQ Test
                </Link>
                <Link
                  to={`/${data?.role}/physical-test`}
                  className="block px-4 py-2 text-gray-800 hover:bg-[#FF725E] hover:text-white"
                >
                  Physical Test
                </Link>
              </>
            )}
            {data?.role === "TEACHER" && (
              <Link
                to={`/${data?.role}/check/ptest`}
                className="block px-4 py-2 text-gray-800 hover:bg-[#FF725E] hover:text-white"
              >
                Physical Test Check
              </Link>
            )}
          </div>
        )}
      </div>
    )}
        </div>
      </div>
    </>
  );
};

export default Header;
