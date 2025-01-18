import React, { useEffect, useState } from 'react';
import Header from '../../Navbar/header';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Loading from '../../Loading/Loading';
import { useSelector } from 'react-redux';

const Topics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const role = useSelector(store => store.user.data.role);

  const [data, setData] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/${id}`)
      .then(res => {
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />

      <div className='p-4'>
        <div className='flex flex-row justify-between'>
          <div className="m-2 font-semibold text-xl flex flex-row">
            <button className='px-2' onClick={() => navigate(-1)}>
              <IoIosArrowBack color='#4B5563' />
            </button>
            <p className="text-gray-700">{data && data?.name}</p>
          </div>
          {role === "TEACHER" && (
            <div>
              <Link to={`/create/topic/${id}`}>
                <button className='m-2 px-4 py-2 rounded-xl border border-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors'>
                  + Add New Topic
                </button>
              </Link>
            </div>
          )}
        </div>

        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-2">
            {data.topics.map((items) => (
              <Link to={`/topic/${items._id}`} key={items._id}>
                <div className="border border-gray-300 rounded-lg p-4 hover:shadow-lg hover:bg-gray-50 transition-all">
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-800">{items.name}</h1>
                    <IoIosArrowForward color='#4B5563' size={22} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Topics;
