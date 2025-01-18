import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import mathicon from "../../../images/icons/icons/mathematics.png";
import phyicon from "../../../images/icons/icons/web-analytics.png";
import bioicon from "../../../images/icons/icons/technology.png";
import chemicon from "../../../images/icons/icons/chemistry-class (1).png";
import hindicon from "../../../images/icons/icons/language.png";
import maricon from "../../../images/icons/icons/hindu (1).png";
import geoicon from "../../../images/icons/icons/geography.png";
import histicon from "../../../images/icons/icons/evolution (1).png";
import engicon from "../../../images/icons/icons/english.png";
import { useSelector } from 'react-redux';
import { FaRegEdit } from "react-icons/fa";
import { Studentph } from './Studentph';

const Subjects = () => {
    const userdata=useSelector(store=>store.user.data);
  
  const [data, setData] = useState();
  const imageMapping = {
    math: mathicon,
    english: engicon,
    physics: phyicon,
    chemistry: chemicon,
    geography: geoicon,
    history: histicon,
    biology: bioicon,
    marathi: maricon,
    hindi: hindicon,
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/10`)
      .then(res => setData(res.data.data.standards[0]))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      {data ? (

        <> <div className="flex p-4 m-2 ">
        <img src={userdata.avatar} alt="User Icon" className="w-12 h-12 rounded-full mr-4" />
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {userdata.fullName}</h2>
        </div>
    </div> <div className="flex flex-col gap-2 p-2 m-2 sm:flex-row items-center justify-between drop-shadow-xl">
          
          {data.subjects.map((subject, index) => (
            <div className="flex flex-col items-center justify-center sm:w-[10%]" key={index}>
              <Link to={`/subject/${subject?._id}`}>
                <img
                  src={imageMapping[subject?.name.toLowerCase()] || mathicon}
                  alt="subject"
                  className="w-20 h-20 rounded-xl"
                />
                <div className="flex justify-center items-center">
                  <h3 className='font-semi-bold  font-md mt-5'>{subject?.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div> <div className='mt-8'>
        <span className='m-5 font-bold text-lg'>Upcoming Test</span>

        <div className='flex flex-row rounded-xl p-2 ml-2 mt-2 drop-shadow-xl'>
          <div className='bg-[white] w-[234px] h-[70px] p-1 m-1 rounded-xl '>
            <div className='flex flex-row ml-2 justify-between'>
              <div className='flex flex-col'>
              <div className='font-bold'>27 Oct 12:00 PM</div><div>Math Test</div></div><FaRegEdit /></div></div>

              <div className='bg-[white] w-[234px] h-[70px] p-1 m-1 rounded-xl '>
              <div className='flex flex-row ml-2 justify-between'>
              <div className='flex flex-col'>
              <div className='font-bold'>1 Dec 12:00 PM</div><div>Math Test</div></div><FaRegEdit /></div></div>

        </div>

      </div>
   {/* {   <Studentph/>} */}
</>
       
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Subjects;
