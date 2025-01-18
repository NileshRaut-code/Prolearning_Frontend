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
              <IoIosArrowBack color='red' />
            </button>
            <p>{data && data?.name}</p>
          </div>
          {role === "TEACHER" && (
            <div>
              <Link to={`/create/topic/${id}`}>
                <button className='m-2 px-4 py-2 rounded-xl border border-[#FF725E] hover:scale-105 delay-100'>
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
                <div className="border border-gray-400 rounded-lg p-4 hover:shadow-lg">
                  <div className="flex justify-between items-center">
                  <h1 className="text-lg font-semibold">{items.name}</h1>
                    <IoIosArrowForward color='red' size={22} />
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
