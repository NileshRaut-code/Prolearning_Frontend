import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const userdata=useSelector(store=>store.user.data);

  return (
    <>

<div className="flex p-4 m-2 ">
        <img src={userdata.avatar} alt="User Icon" className="w-12 h-12 rounded-full mr-4" />
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {userdata.fullName}</h2>
        </div>
    </div>
      <div className="flex flex-row flex-wrap gap-5 p-4 m-4">
        <Link to={"/create/topic"}>
          <div className="w-64 h-64 m-2 p-2 rounded-md shadow-lg hover:scale-105 duration-300 bg-white hover:bg-gray-100">
            <div className="flex flex-col justify-between items-center h-full py-4">
              <h2 className="m-2 p-2">
                <img
                  width="70"
                  alt="Create Topic"
                  src="https://cdn2.iconfinder.com/data/icons/lucid-generic/24/new_artboard_file_create_post-512.png"
                />
              </h2>
              <div className="m-2 p-2 border border-gray-300 rounded-xl">
                <p className="text-gray-700">Create New Topic</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to={"/teacher/create/subject"}>
          <div className="w-64 h-64 m-2 p-2 rounded-md shadow-lg hover:scale-105 duration-300 bg-white hover:bg-gray-100">
            <div className="flex flex-col justify-between items-center h-full py-4">
              <h2 className="m-2 p-2">
                <img
                  width="70"
                  alt="Create Subject"
                  src="https://cdn2.iconfinder.com/data/icons/lucid-generic/24/new_artboard_file_create_post-512.png"
                />
              </h2>
              <div className="m-2 p-2 border border-gray-300 rounded-xl">
                <p className="text-gray-700">Create New Subject</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to={"/teacher/create/chapter"}>
          <div className="w-64 h-64 m-2 p-2 rounded-md shadow-lg hover:scale-105 duration-300 bg-white hover:bg-gray-100">
            <div className="flex flex-col justify-between items-center h-full py-4">
              <h2 className="m-2 p-2">
                <img
                  width="70"
                  alt="Create Chapter"
                  src="https://cdn2.iconfinder.com/data/icons/lucid-generic/24/new_artboard_file_create_post-512.png"
                />
              </h2>
              <div className="m-2 p-2 border border-gray-300 rounded-xl">
                <p className="text-gray-700">Create New Chapter</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to={"/teacher/create/ptest"}>
          <div className="w-64 h-64 m-2 p-2 rounded-md shadow-lg hover:scale-105 duration-300 bg-white hover:bg-gray-100">
            <div className="flex flex-col justify-between items-center h-full py-4">
              <h2 className="m-2 p-2">
                <img
                  width="70"
                  alt="Create Physical Test"
                  src="https://cdn2.iconfinder.com/data/icons/lucid-generic/24/new_artboard_file_create_post-512.png"
                />
              </h2>
              <div className="m-2 p-2 border border-gray-300 rounded-xl">
                <p className="text-gray-700">Create New Physical Test</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Home;
