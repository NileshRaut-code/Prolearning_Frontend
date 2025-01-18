import React, { useEffect, useState } from 'react';
import Header from '../../Navbar/header';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import Loading from '../../Loading/Loading';
import { useSelector } from 'react-redux';

const Chapters = () => {
  const { id } = useParams();
  const role = useSelector(store => store.user.data.role);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/${id}`)
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
            <button className='px-2' onClick={() => { navigate(-1) }}>
              <IoIosArrowBack color='red' />
            </button>
          
            <p>{data && data?.name}</p>
          </div>
          {role === "TEACHER" && (
            <div>
              <Link to={`/create/subject/${id}`}>
                <button className='m-2 px-4 py-2 rounded-xl border border-[#FF725E] hover:scale-105 delay-100'>
                  + Add New Chapter
                </button>
              </Link>
            </div>
          )}
        </div>

        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {data.chapters.map((items) => (
             <Link  to={`/chapter/${items._id}`}> <div 
                key={items._id} 
                className="p-6 border rounded-lg shadow-md hover:shadow-lg relative"
              >
                <h1 className="text-lg font-semibold">{truncateTitle(items.name,40)}</h1>
                
                <Link 
                  to={`/student/chaptertest/${items._id}`} 
                  className="text-orange-600 text-sm absolute right-4 bottom-4"
                >
                  Test &gt;
                </Link>
              </div></Link>
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Chapters;
