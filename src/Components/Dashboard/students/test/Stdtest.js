import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../../Navbar/header";
import Loading from "../../../Loading/Loading";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";

export const Stdtest = () => {
  const navigate = useNavigate();
  const data = useSelector((store) => store.user.data);
  const Id = parseInt(data.standard);

  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [test, setTest] = useState(null);
  const [filteredTests, setFilteredTests] = useState(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/standard/${Id}`
        );
        setSubjects(response.data.data.standards[0].subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [Id]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chapters/chapter-tests/standard/${Id}`
        );
        const fixedStatuses = ["submitted", "not submitted", "delayed"];
        const testsWithStatus = response.data.data.map((test, index) => ({
          ...test,
          status: fixedStatuses[index % fixedStatuses.length],
        }));
        setTest(testsWithStatus);
        setFilteredTests(testsWithStatus);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTest();
  }, [Id]);

  const handleStatusFilterChange = (status) => {
    if (status === "All") {
      setFilteredTests(test);
    } else {
      setFilteredTests(
        test.filter((data) => data.status.toLowerCase() === status.toLowerCase())
      );
    }
  };
  const handleSubjectFilterChange = (subject) => {
    setSubjectFilter(subject);
  
    if (subject === "All") {
      setFilteredTests(test);
    } else {
      setFilteredTests(
        test.filter((data) => data.name === subject.name)

      );
    }
  };
  

  return (
    <>
      <div className={`${isSideNavOpen ? "sm:ml-64" : ""}`}>
        <Header
          isSideNavOpen={isSideNavOpen}
          setIsSideNavOpen={setIsSideNavOpen}
        />
        <div className="p-4">
          {/* Header Section */}
          <div className="flex justify items-center mb-4">
            <div className="font-semibold text-xl flex items-center">
              <button className="px-2" onClick={() => navigate(-1)}>
                <IoIosArrowBack color="red" />
              </button>
              <p>TEST DETAILS (MCQ)</p>
            </div>
            <div className="flex gap-2">
              <select
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="bg-red-400 text-white px-3 py-1 rounded-md"
              >
                <option value="All">Status</option>
                <option value="submitted">Submitted</option>
                <option value="not submitted">Not Submitted</option>
                <option value="delayed">Delayed</option>
              </select>
              <select
                onChange={(e) => handleSubjectFilterChange(e.target.value)}
                className="bg-red-400 text-white px-3 py-1 rounded-md"
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

          {/* Table Section */}
          {filteredTests ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow-lg">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2">SR. NO.</th>
                    <th className="p-2">TEST NAME</th>
                    <th className="p-2">SUBJECT</th>
                    <th className="p-2">TOTAL MARKS</th>
                    <th className="p-2">TIME DURATION</th>
                    <th className="p-2">DUE DATE</th>
                    <th className="p-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {filteredTests.map((data, index) => (
                    <tr key={data._id}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <Link
                          to={`/student/test/${data._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {data.testName}
                        </Link>
                      </td>
                      <td className="p-2">{data.subjectName}</td>
                      <td className="p-2">{data.totalMarks}</td>
                      <td className="p-2">{data.timeDuration}</td>
                      <td className="p-2">{data.dueDate}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            data.status === "submitted"
                              ? "text-green-500"
                              : data.status === "delayed"
                              ? "text-red-500"
                              : "text-yellow-500"
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
