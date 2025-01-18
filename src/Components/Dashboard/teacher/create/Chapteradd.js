import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from '../../../Navbar/header';
import { useSelector } from 'react-redux';
const Chapteradd = () => {
  // Define the array of values from 1 to 10
  const standards = Array.from({ length: 10 }, (_, index) => index + 1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjectdata, setSubjectdata] = useState('');
  const teacherId = useSelector(store=>store.user.data._id)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const chapterName = useRef('');

  const handleStandardChange = (event) => {
    const value = event.target.value;
    setSelectedStandard(value);
    setSelectedSubject(''); // Reset selected subject when standard changes
  };

  const handleSubjectChange = async (event) => {
    const value = event.target.value;
    setSelectedSubject(value);

    if (value) {
      try {
        const response = await axios.get(`https://backend-pro-learning.vercel.app/api/subjects/${value}`);
        setSubjectId(response.data.data._id);
        setSubjectdata(response.data) // Set the subject ID from the response
      } catch (error) {
        console.error('Error fetching subject details:', error);
        setSubmitErr('Error fetching subject details');
      }
    }
  };

  const submitData = () => {

    
    const inputData = chapterName.current?.value;
    if (!inputData) {
      setSubmitErr('Chapter name is required');
      return;
    }

    if (!subjectId) {
      setSubmitErr('Subject ID is missing');
      return;
    }

    if (subjectdata.data.chapters.some(subject => subject.name.toLowerCase() === inputData.toLowerCase())) {
      setSubmitErr('Subject already exists');
    }

    const data = {
      "name": inputData,
      "subjectId": subjectId,
      teacherId
    };
    console.log('Submitted data:', data);
    axios.defaults.withCredentials = true;
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/chapters`, data)
        .then((res) => {
          
          setSubmitErr("chapter created succesfully");
        })
        .catch((err) => setSubmitErr("some error chapter created succesfully"));
  };

  useEffect(() => {
    const getSubjects = async (standardId) => {
      try {
        const response = await axios.get(`https://backend-pro-learning.vercel.app/api/subjects/standard/${standardId}`);
        const subjects = response.data.data.standards[0] ? response.data.data.standards[0].subjects : [];
        setSubjects(subjects);
        setSubmitErr(subjects.length === 0 ? 'No subjects available for this standard' : '');
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
        setSubmitErr('Error fetching subjects');
      }
    };
    if (selectedStandard) {
      getSubjects(selectedStandard);
    }
  }, [selectedStandard]);

  return (
    <>
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="max-w-xl mx-auto p-5">
          <div className="mb-5">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Standard:</label>
            <select
              id="standardDropdown"
              value={selectedStandard}
              onChange={handleStandardChange}
              className="border border-gray-300 rounded p-2 text-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
            >
              <option value=''>Select Standard</option>
              {standards.map((standard) => (
                <option key={standard} value={standard}>
                  {standard}
                </option>
              ))}
            </select>
          </div>
  
          {subjects.length > 0 && (
            <div className="mb-5">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Subject:</label>
              <select
                id="subjectDropdown"
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="border border-gray-300 rounded p-2 text-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
              >
                <option value=''>Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {subjectdata && (
            <form onSubmit={e => e.preventDefault()}>
              <input
                type='text'
                ref={chapterName}
                className="border border-gray-300 rounded p-2 mb-2 w-full text-gray-800 focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-sm"
                placeholder="Type chapter name"
              />
              <p className={`text-red-500 mt-2 ${submitErr ? 'animate-bounce' : ''}`}>{submitErr}</p>
              <button
                onClick={submitData}
                className="bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none shadow-md"
              >
                Add the Chapter
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
  
};

export default Chapteradd;