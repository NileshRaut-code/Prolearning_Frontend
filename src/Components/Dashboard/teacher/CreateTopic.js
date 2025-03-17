// axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard${selectedStandard}`);

// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../Navbar/header.js'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
function CreateTopic() {
  const standards = Array.from({ length: 10 }, (_, i) => i + 1); // Fixed standards 1 to 10
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [err ,setErr]=useState()
  const navigate=useNavigate()
 const getSubjects = async (standardId) => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${standardId}`);
    if(response.data.data.standards[0]){ return response.data.data.standards[0].subjects;}
    else{
        return [];
    }
    }
    catch (error) {
      console.error('Error fetching subjects:', error);
      setTimeout(() => {
        setErr("Something went wrong , try after some time")
      }, 2000);
    }
   
  };
 const getChapters = async (subjectId) => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/${subjectId}`);
    return response.data.data.chapters;
    }
    catch (error) {
      console.error('Error fetching subjects:', error);
      setTimeout(() => {
        setErr("Something went wrong , try after some time")
      }, 2000);
    }
  };
  useEffect(() => {
    if (selectedStandard) {
      const fetchSubjects = async () => {
        console.log(selectedStandard)
        const subjectsData = await getSubjects(selectedStandard);
        console.log(subjectsData)
        setSubjects(subjectsData);
      };
      fetchSubjects();
    }
  }, [selectedStandard]);

  useEffect(() => {
    if (selectedSubject) {
      const fetchChapters = async () => {
        console.log(selectedSubject);
        const chaptersData = await getChapters(selectedSubject);
        setChapters(chaptersData);
      };
      fetchChapters();
    }
  }, [selectedSubject]);

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      <div className="m-2 font-semibold text-xl flex flex-row">
        <button
          className="px-2"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowBack color="gray" />
        </button>
        <p></p>
      </div>
      <div className="p-4 flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
        <div className="mb-4 w-full sm:w-fit">
          <label className="block text-gray-900">Select Standard</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
            value={selectedStandard}
            onChange={(e) => {
              setSelectedStandard(e.target.value);
              setSubjects([]); // Clear subjects when standard changes
              setChapters([]); // Clear chapters when standard changes
              setSelectedSubject(''); // Reset subject
              setSelectedChapter(''); // Reset chapter
            }}
          >
            <option value="">Select Standard</option>
            {standards.map((standard) => (
              <option key={standard} value={standard}>
                {standard}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mb-4 w-full sm:w-fit">
          <label className="block text-gray-900">Select Subject</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter(''); // Reset chapter
            }}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mb-4 w-full sm:w-fit">
          <label className="block text-gray-900">Select Chapter</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
            value={selectedChapter}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              console.log(`Selected Chapter ID: ${e.target.value}`);
            }}
          >
            <option value="">Select Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter._id} value={chapter._id}>
                {chapter.name}
              </option>
            ))}
          </select>
        </div>
  
        {selectedChapter && (
          <div className="mt-4 w-full sm:w-fit">
            <Link to={`/create/topic/${selectedChapter}?standard=${selectedStandard}`}>
              <div className="p-2 bg-black rounded-xl text-white hover:bg-gray-800 transition-colors">
                Create New Topic
              </div>
            </Link>
          </div>
        )}
      </div>
      {err && (
        <div className="flex flex-col justify-center items-center">
          <p className="p-2 bg-black rounded-xl text-white w-fit">
            {err}s
          </p>
        </div>
      )}
    </div>
  );
  
}

export default CreateTopic;
