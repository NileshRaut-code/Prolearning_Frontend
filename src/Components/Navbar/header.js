import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaAngleRight, FaSearch, FaUserFriends, FaBrain, FaChartLine } from "react-icons/fa";
import { IoMdClose, IoIosRefresh } from "react-icons/io";
import { GrHomeRounded } from "react-icons/gr";
import { IoBookOutline } from "react-icons/io5";
import { LiaClipboardSolid } from "react-icons/lia";
import { PiUsers } from "react-icons/pi";
import { MdOutlineShowChart, MdSupervisorAccount } from "react-icons/md";
import { BsClipboard2Check } from "react-icons/bs";

//import { GrHomeRounded, IoBookOutline, LiaClipboardSolid, PiUsers, MdOutlineShowChart, BsClipboard2Check } from "react-icons/fa"; // React icons
import { useSelector } from "react-redux";
import Avatar from "./avatar";

const Header = ({ isSideNavOpen, setIsSideNavOpen }) => {
  const data = useSelector((store) => store.user.data);
  const [isTestDropdownOpen, setTestDropdownOpen] = useState(false);
  const [isContentDropdownOpen, setContentDropdownOpen] = useState(false);
  
  const toggleTestDropdown = () => {
    setTestDropdownOpen(!isTestDropdownOpen);
    setContentDropdownOpen(false);
  };
  
  const toggleContentDropdown = () => {
    setContentDropdownOpen(!isContentDropdownOpen);
    setTestDropdownOpen(false);
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
      name: "Dashboard",
      to: data?.role === "STUDENT" ? "/student/dashboard-new" : 
           data?.role === "TEACHER" ? "/teacher/dashboard-new" : 
           data?.role === "PARENT" ? "/parent/dashboard-new" : 
           `/${data?.role}/dashboard`,
      icon: <GrHomeRounded size={21} color="black" />,
      hoverIcon: <GrHomeRounded size={21} color="gray" />,
      condition: true,
    },
    {
      name: "Study Material",
      to: `/studymaterial`,
      icon: <IoBookOutline size={21} color="black" />,
      hoverIcon: <IoBookOutline size={21} color="gray" />,
      condition: data?.role === "STUDENT" || data?.role === "TEACHER",
    },
    {
      name: "Tests",
      to: "#",
      icon: <LiaClipboardSolid size={21} color="black" />,
      hoverIcon: <LiaClipboardSolid size={21} color="gray" />,
      condition: data?.role === "STUDENT" || data?.role === "TEACHER",
      dropdown: true,
    },
    {
      name: "Learning Plans",
      to: "/student/learning-plans",
      icon: <FaBrain size={21} color="black" />,
      hoverIcon: <FaBrain size={21} color="gray" />,
      condition: data?.role === "STUDENT",
    },
    {
      name: "Performance",
      to: data?.role === "STUDENT" ? "/student/performance-dashboard" : `/${data?.role}/performance`,
      icon: <FaChartLine size={21} color="black" />,
      hoverIcon: <FaChartLine size={21} color="gray" />,
      condition: data?.role === "STUDENT" || data?.role === "PARENT",
    },
    {
      name: "Parent Linking",
      to: "/student/parent-linking",
      icon: <FaUserFriends size={21} color="black" />,
      hoverIcon: <FaUserFriends size={21} color="gray" />,
      condition: data?.role === "STUDENT",
    },
    {
      name: "Community",
      to: `/${data?.role}/community`,
      icon: <PiUsers size={21} color="black" />,
      hoverIcon: <PiUsers size={21} color="gray" />,
      condition: data?.role === "STUDENT",
    },
    {
      name: "Test Management",
      to: "/teacher/test-management",
      icon: <BsClipboard2Check size={21} color="black" />,
      hoverIcon: <BsClipboard2Check size={21} color="gray" />,
      condition: data?.role === "TEACHER",
    },
    {
      name: "AI Test Generator",
      to: "/teacher/create/ai-test",
      icon: <FaBrain size={21} color="black" />,
      hoverIcon: <FaBrain size={21} color="gray" />,
      condition: data?.role === "TEACHER",
    },
    {
      name: "Content Creation",
      to: "#",
      icon: <FaBook size={21} color="black" />,
      hoverIcon: <FaBook size={21} color="gray" />,
      condition: data?.role === "TEACHER",
      dropdown: true,
      isContentDropdown: true,
    },
    {
      name: "Admin Panel",
      to: `/${data?.role}/Changerole`,
      icon: <MdSupervisorAccount size={21} color="black" />,
      hoverIcon: <MdSupervisorAccount size={21} color="gray" />,
      condition: data?.role === "SUPERADMIN",
    },
    {
      name: "Notifications",
      to: `/${data?.role}/Notifications`,
      icon: <MdOutlineShowChart size={21} color="black" />,
      hoverIcon: <MdOutlineShowChart size={21} color="gray" />,
      condition: data?.role === "SUPERADMIN",
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
        <div className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-gray-700">
            Welcome, {data?.fullName}!
          </span>
        </div>
        
        {/* Quick Access Links */}
        <div className="hidden md:flex items-center space-x-2">
          {data?.role === "STUDENT" && (
            <>
              <Link
                to="/student/test-dashboard"
                className="text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-700 py-2 px-3 rounded-md font-medium transition-colors"
              >
                Quick Test
              </Link>
              <Link
                to="/student/learning-plans"
                className="text-sm text-gray-600 hover:bg-green-100 hover:text-green-700 py-2 px-3 rounded-md font-medium transition-colors"
              >
                My Plans
              </Link>
            </>
          )}
          
          {data?.role === "TEACHER" && (
            <>
              <Link
                to="/teacher/create/ai-test"
                className="text-sm text-gray-600 hover:bg-purple-100 hover:text-purple-700 py-2 px-3 rounded-md font-medium transition-colors"
              >
                AI Generator
              </Link>
              <Link
                to="/teacher/create/subject"
                className="text-sm text-gray-600 hover:bg-teal-100 hover:text-teal-700 py-2 px-3 rounded-md font-medium transition-colors"
              >
                Create Content
              </Link>
              <Link
                to="/teacher/test-management"
                className="text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-700 py-2 px-3 rounded-md font-medium transition-colors"
              >
                Manage Tests
              </Link>
            </>
          )}
          
          {data?.role === "PARENT" && (
            <Link
              to="/parent/dashboard-new"
              className="text-sm text-gray-600 hover:bg-green-100 hover:text-green-700 py-2 px-3 rounded-md font-medium transition-colors"
            >
              Child Progress
            </Link>
          )}
        </div>
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-2">
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
              {data?.fullName} ({data?.role})
            </div>
            
            <Link
              to={data?.role === "STUDENT" ? "/student/dashboard-new" : 
                   data?.role === "TEACHER" ? "/teacher/dashboard-new" : 
                   data?.role === "PARENT" ? "/parent/dashboard-new" : 
                   `/${data?.role}/dashboard`}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <GrHomeRounded className="inline mr-2" size={16} />
              Dashboard
            </Link>
            
            {data?.role === "STUDENT" && (
              <>
                <Link
                  to="/student/performance-dashboard"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <FaChartLine className="inline mr-2" size={16} />
                  Performance
                </Link>
                <Link
                  to="/student/parent-linking"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <FaUserFriends className="inline mr-2" size={16} />
                  Parent Linking
                </Link>
              </>
            )}
            
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Profile Settings
              </Link>
              <Link
                to="/logout"
                className="block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
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
                  onClick={tab.isContentDropdown ? toggleContentDropdown : toggleTestDropdown}
                >
                  <div className="flex flex-row items-center ">
                    {(tab.isContentDropdown ? isContentDropdownOpen : isTestDropdownOpen) ? tab.hoverIcon : tab.icon}
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
                {isTestDropdownOpen && !tab.isContentDropdown && (
                  <div className="ml-4 mt-2 bg-white shadow-md rounded-md border border-gray-200">
                    {data?.role === "STUDENT" && (
                      <>
                        <Link
                          to="/student/test-dashboard"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LiaClipboardSolid className="inline mr-2" size={16} />
                          Test Dashboard
                        </Link>
                        <Link
                          to="/student/test-browse"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <FaSearch className="inline mr-2" size={16} />
                          Browse Tests
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <Link
                          to="/student/test"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          MCQ Tests
                        </Link>
                        <Link
                          to="/student/physical-test"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Physical Tests
                        </Link>
                      </>
                    )}
                    {data?.role === "TEACHER" && (
                      <>
                        <Link
                          to="/teacher/test-management"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <BsClipboard2Check className="inline mr-2" size={16} />
                          Test Management
                        </Link>
                        <Link
                          to="/teacher/create/ai-test"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <FaBrain className="inline mr-2" size={16} />
                          AI Test Generator
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <Link
                          to="/teacher/create/ptest"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Create Physical Test
                        </Link>
                        <Link
                          to="/teacher/check/ptest"
                          className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Grade Submissions
                        </Link>
                      </>
                    )}
                  </div>
                )}
                
                {isContentDropdownOpen && tab.isContentDropdown && (
                  <div className="ml-4 mt-2 bg-white shadow-md rounded-md border border-gray-200">
                    <Link
                      to="/teacher/create/standard"
                      className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaUserFriends className="inline mr-2" size={16} />
                      Create Standard
                    </Link>
                    <Link
                      to="/teacher/create/subject"
                      className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaBook className="inline mr-2" size={16} />
                      Create Subject
                    </Link>
                    <Link
                      to="/teacher/create/chapter"
                      className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaChartLine className="inline mr-2" size={16} />
                      Create Chapter
                    </Link>
                    <Link
                      to="/teacher/create/topic"
                      className="text-sm font-medium block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaBrain className="inline mr-2" size={16} />
                      Create Topic
                    </Link>
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
