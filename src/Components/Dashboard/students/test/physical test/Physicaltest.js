import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../../../Loading/Loading';
import Header from '../../../../Navbar/header';
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from 'react-redux';

export const Physicaltest = () => {
  const navigate = useNavigate();
  const data = useSelector(store => store.user.data);
  const Id = parseInt(data.standard);
  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [test, setTest] = useState(null);
  const [filteredTests, setFilteredTests] = useState(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${Id}`);
        setSubjects(response.data.data.standards[0].subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [Id]);

  // Fetch tests and apply filters
  useEffect(() => {
    const fetchTest = async () => {
      try {
        axios.defaults.withCredentials = true;
        const url = subjectFilter === 'All'
          ? `${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/standard/${Id}`
          : `${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/standard/${Id}/${subjectFilter}`;

        const response = await axios.get(url);
        setTest(response.data.data);
        setFilteredTests(response.data.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTest();
  }, [subjectFilter, Id]);

  // Apply status filter
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredTests(test);
    } else {
      setFilteredTests(
        test.filter((data) => {
          const status = data.status || 'not submitted'; // Set default value if status is undefined or null
          return status.toLowerCase() === statusFilter.toLowerCase();
        })
      );
    }
  }, [statusFilter, test]);

  // Handle subject filter change
  const handleSubjectFilterChange = (subject) => {
    setSubjectFilter(subject);
    if (subject === 'All') {
      setFilteredTests(test);
    } else {
      setFilteredTests(
        test.filter((data) => data.name === subject)
      );
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  return (
    <>
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="p-4 bg-white shadow-lg">
          <div className="flex flex-row justify-between items-center">
            <div className="m-2 font-semibold text-xl flex flex-row">
              <button className="px-2" onClick={() => { navigate(-1) }}>
                <IoIosArrowBack color="black" />
              </button>
              <p className="text-gray-700">TEST DETAILS (MCQ)</p>
            </div>

            {/* Filters for Subject and Status */}
            <div className="flex gap-6">
              <select
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300"
              >
                <option value="All">Status</option>
                <option value="submitted">Submitted</option>
                <option value="not submitted">Not Submitted</option>
                <option value="delayed">Delayed</option>
              </select>
              <select
                onChange={(e) => handleSubjectFilterChange(e.target.value)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300"
              >
                <option value="All">Subject</option>
                {subjects &&
                  subjects.map((sub, index) => (
                    <option key={index} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Table for displaying tests */}
          {filteredTests ? (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-gray-300 shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SR No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTests.map((data, index) => (
                    <tr key={data._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/student/physical-test/${data._id}`} className="text-gray-600 hover:underline">
                          {data?.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{data?.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{data?.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{data?.timeDuration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{data?.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full ${data.status === 'submitted'
                              ? 'bg-green-100 text-green-700'
                              : data.status === 'delayed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {data.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};
