import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { IoIosArrowBack } from "react-icons/io";

export const Chaptertest = () => {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [test, setTest] = useState(null);
  const [filteredTests, setFilteredTests] = useState(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/chapter-tests/chapter/${Id}`);

        // Define the fixed status array
        const fixedStatuses = ['submitted', 'not submitted', 'delayed', 'not submitted', 'not submitted'];
        
        // Add a status to each test based on the fixed array, cycling through if needed
        const testsWithStatus = response.data.data.map((test, index) => ({
          ...test,
          status: fixedStatuses[index % fixedStatuses.length],
        }));

        setTest(testsWithStatus);
        setFilteredTests(testsWithStatus);  // Initialize filtered tests
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [Id]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredTests(test); // Show all tests if "All" is selected
    } else {
      setFilteredTests(test.filter((data) => data.status === status.toLowerCase()));
    }
  };

  return (
    <>
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-xl flex items-center">
              <button className="px-2" onClick={() => navigate(-1)}>
                <IoIosArrowBack color="red" />
              </button>
              <p>TEST DETAILS (MCQ)</p>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="bg-red-300 text-white px-3 py-1 rounded-md"
              >
                <option value="All">All</option>
                <option value="Submitted">Submitted</option>
                <option value="Not Submitted">Not Submitted</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          {filteredTests ? (
            <table className="w-full border rounded-lg shadow-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-2">SR. NO.</th>
                  <th className="p-2">TEST NAME</th>
                  <th className="p-2">TOTAL MARKS</th>
                  <th className="p-2">TIME DURATION</th>
                  {/* <th className="p-2">DUE DATE</th> */}
                  <th className="p-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((data, index) => (
                  <tr key={data._id} className="text-center border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      <Link to={`/student/test/${data?._id}`} className="text-blue-500 hover:underline">
                        {data?.testName}
                      </Link>
                    </td>
                    <td className="p-2">10</td>
                    <td className="p-2">30 mins</td>
                    {/* <td className="p-2">{data?.dueDate}</td> */}
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full ${
                        data?.status === 'submitted'
                          ? 'text-green-500'
                          : data?.status === 'delayed'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                      }`}>
                        {data?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};
