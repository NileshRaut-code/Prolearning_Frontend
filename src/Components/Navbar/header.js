import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaAngleRight, FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { GrHomeRounded } from "react-icons/gr";
import { IoBookOutline } from "react-icons/io5";
import { LiaClipboardSolid } from "react-icons/lia";
import { PiUsers } from "react-icons/pi";
import { MdOutlineShowChart } from "react-icons/md";
import { BsClipboard2Check } from "react-icons/bs";

//import { GrHomeRounded, IoBookOutline, LiaClipboardSolid, PiUsers, MdOutlineShowChart, BsClipboard2Check } from "react-icons/fa"; // React icons
import { useSelector } from "react-redux";
import Avatar from "./avatar";

const Header = ({ isSideNavOpen, setIsSideNavOpen }) => {
  const data = useSelector((store) => store.user.data);
  const [isTestDropdownOpen, setTestDropdownOpen] = useState(false);
  const toggleTestDropdown = () => {
    setTestDropdownOpen(!isTestDropdownOpen);
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tabs data (array)
  const tabs = [
    {
      name: "Home",
      to: `/${data?.role}/dashboard`,
      icon: <GrHomeRounded size={21} color="black" />, // React Icon
      hoverIcon: <GrHomeRounded size={21} color="gray" />, // Hover icon color
      condition: true,
    },
    {
      name: "Study Material",
      to: `/studymaterial`,
      icon: <IoBookOutline size={21} color="black" />, // React Icon
      hoverIcon: <IoBookOutline size={21} color="gray" />, // Hover icon color
      condition: data?.role !== "PARENT",
    },
    {
      name: "Test",
      to: "#",
      icon: <LiaClipboardSolid size={21} color="black" />, // React Icon
      hoverIcon: <LiaClipboardSolid size={21} color="gray" />, // Hover icon color
      condition: data?.role === "STUDENT" || data?.role === "TEACHER",
      dropdown: true,
    },
    {
      name: "Assignment",
      to: `/${data?.role}/assignment`,
      icon: <BsClipboard2Check size={21} color="black" />, // React Icon
      hoverIcon: <BsClipboard2Check size={21} color="gray" />, // Hover icon color
      condition: data?.role === "STUDENT",
    },
    {
      name: "Performance",
      to: `/${data?.role}/performance`,
      icon: <MdOutlineShowChart size={21} color="black" />, // React Icon
      hoverIcon: <MdOutlineShowChart size={21} color="gray" />, // Hover icon color
      condition: data?.role !== "TEACHER",
    },
    {
      name: "Community",
      to: `/${data?.role}/community`,
      icon: <PiUsers size={21} color="black" />, // React Icon
      hoverIcon: <PiUsers size={21} color="gray" />, // Hover icon color
      condition: data?.role === "STUDENT",
    },
  ];

  return (
    <>
     <nav className="bg-white ">
  <div className="max-w-screen-2xl flex items-center justify-between mx-auto p-4">
    <div className="flex flex-row ">
      {!isSideNavOpen && (
        <button
          onClick={toggleSideNav}
          className="p-2 bg-white text-gray-700 rounded-full focus:outline-none"
        >
          <RxHamburgerMenu size={21} />
        </button>
      )}
      {/* <div className="flex items-center space-x-3">
        <span className="text-xl font-semibold text-gray-700">
          HI! {data?.fullName}
        </span>
      </div> */}
      <div className="flex items-center space-x-4">
  <Link
    to="/courses"
    className="text-lg text-gray-700 hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md font-bold transition-colors"
  >
    Courses
  </Link>
  <Link
    to="/ai-tool"
    className="text-lg text-gray-700 hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md font-bold transition-colors"
  >
    Contest 
  </Link>
  <Link
    to="/blog"
    className="text-lg text-gray-700 hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md font-bold transition-colors"
  >
    Blog
  </Link>
  <Link
    to="/other"
    className="text-lg text-gray-700 hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md font-bold transition-colors"
  >
    Other
  </Link>
</div>

    </div>
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-row">
      <div className="flex items-center bg-gray-200 text-gray-500 p-1 rounded-md mx-6 drop-shadow-lg">
    {/* Search Icon before the text */}
    <FaSearch size={16} className="text-gray-500 mx-2" />

    {/* Small, rounded input field */}
    <input
  type="text"
  placeholder="Search..."
  className="bg-transparent text-gray-500 w-40 px-2 py-1 outline-none border-none"
/>
  </div>

        <button
          onClick={toggleDropdown}
          className="inline-flex items-center justify-center rounded-full focus:outline-none drop-shadow-lg"
        >
          <Avatar />
        </button>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <Link
            to={`/${data?.role}/dashboard`}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Profile
          </Link>
          <Link
            to="/logout"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  </div>
</nav>

<div
  className={`fixed top-0 left-0 w-64 text-gray-700 h-full bg-white shadow-lg transform ${isSideNavOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-300 ease-in-out drop-shadow-lg`}
>
  <div className="flex justify-between items-center p-4">
    <div className="flex flex-row justify-between">
      <h1 className="text-2xl text-gray-700 font-bold">Prolearning</h1>
    </div>

    <button
      onClick={toggleSideNav}
      className="p-2 text-gray-700 bg-gray-200 rounded-full"
    >
      <IoMdClose size={20} />
    </button>
  </div>
  <div className="flex flex-col p-4 space-y-4"> {/* Increased space-y-2 to space-y-4 */}
    {tabs.map(
      (tab, index) =>
        tab.condition && (
          <div key={index} className="relative">
            {tab.dropdown ? (
              <>
                <button
                  className="flex justify-between gap-2 p-2 w-full text-left rounded-md transition-colors group"
                  onClick={toggleTestDropdown}
                >
                  <div className="flex flex-row items-center ">
                    {isTestDropdownOpen ? tab.hoverIcon : tab.icon}
                    <span className="text-lg text-gray-700 px-2 font-medium group-hover:text-gray-800">
                      {tab.name}
                    </span>
                  </div>
                  <div className="py-2 group">
                    <FaAngleRight
                      size={16}
                      className="text-gray-700 group-hover:text-gray-800 transition-colors"
                    />
                  </div>
                </button>
                {isTestDropdownOpen && (
                  <div className="ml-4 mt-2 bg-white shadow-md rounded-md">
                    {data?.role === "STUDENT" && (
                      <>
                        <Link
                          to={`/student/test`}
                          className="text-lg font-medium block px-4 py-2 text-gray-700 hover:bg-gray-300"
                        >
                          MCQ Test
                        </Link>
                        <Link
                          to={`/student/physical-test`}
                          className="text-lg font-medium block px-4 py-2 text-gray-700 hover:bg-gray-300"
                        >
                          Physical Test
                        </Link>
                      </>
                    )}
                    {data?.role === "TEACHER" && (
                      <Link
                        to={`${data?.role}/check/ptest`}
                        className="text-lg font-medium block px-4 py-2 text-gray-700 hover:bg-gray-300"
                      >
                        Physical Test Check
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={tab.to}
                className="flex items-center gap-2 p-2 rounded-md transition-colors bg-white hover:bg-gray-300 text-gray-700 hover:text-gray-800"
              >
                {tab.icon}
                <span className="text-lg font-medium">{tab.name}</span>
              </Link>
            )}
          </div>
        )
    )}
  </div>
</div>

    </>
  );
};

export default Header;
