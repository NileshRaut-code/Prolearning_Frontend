import React, { useRef, useState } from "react";
import axios from "axios";
import Header from "../../../Navbar/header";
import { useSelector } from "react-redux";

const StandardAdd = () => {
  const [submitErr, setSubmitErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const nameRef = useRef("");
  const descriptionRef = useRef("");

  const submitData = () => {
    const name = nameRef.current?.value.trim();
    const description = descriptionRef.current?.value.trim();
    
    if (!name || !description) {
      setSubmitErr("Please fill out both fields.");
      setTimeout(() => setSubmitErr(""), 3000);
      return;
    }
    
    const data = {
      name,
      description,
      
    };

    axios.defaults.withCredentials = true;
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/standards`, data)
      .then(() => {
        setSuccessMsg("Standard created successfully");
        setSubmitErr("");
        nameRef.current.value = "";
        descriptionRef.current.value = "";
        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch(() => setSubmitErr("Error creating standard. Try again."));
  };

  return (
    <>
      <div className={`${isSideNavOpen ? "sm:ml-64" : ""}`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="max-w-xl mx-auto p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add Standard</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              ref={nameRef}
              className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
              placeholder="Enter Standard Name"
            />
            <input
              type="text"
              ref={descriptionRef}
              className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
              placeholder="Enter Standard Description"
            />
            {submitErr && <p className="text-red-500 mt-2 animate-bounce">{submitErr}</p>}
            {successMsg && <p className="text-green-500 mt-2">{successMsg}</p>}
            <button
              onClick={submitData}
              className="bg-black hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Add Standard
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StandardAdd;
