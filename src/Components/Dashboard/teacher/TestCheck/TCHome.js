import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../Navbar/header';
import { Link } from 'react-router-dom';
import { 
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaSort,
  FaUser,
  FaFileAlt,
  FaTrophy
} from 'react-icons/fa';

export const TCHome = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState(10); // Default ID, adjust as needed
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies/standard/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, isPassed, grade) => {
    if (grade !== 'Not graded') {
      if (isPassed) {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Passed
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Failed
          </span>
        );
      }
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FaClock className="mr-1" />
          Pending
        </span>
      );
    }
  };

  const filteredAndSortedData = data
    .filter(item => {
      const matchesSearch = item.student.fullName?.toLowerCase().includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Pending' && item.grade === 'Not graded') ||
        (statusFilter === 'Graded' && item.grade !== 'Not graded') ||
        (statusFilter === 'Passed' && item.isPassed) ||
        (statusFilter === 'Failed' && item.grade !== 'Not graded' && !item.isPassed);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.student.fullName.localeCompare(b.student.fullName);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'date':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Physical Test Submissions</h1>
              <p className="text-gray-600">Review and grade student submissions</p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Standard Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
                <select
                  value={id}
                  onChange={e => setId(parseInt(e.target.value, 10))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {Array.from({ length: 10 }, (_, index) => index + 1).map(num => (
                    <option key={num} value={num}>Standard {num}</option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Graded">Graded</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="score">Score</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaFileAlt className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-800">{data.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaClock className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter(item => item.grade === 'Not graded').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaCheckCircle className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter(item => item.isPassed).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaTimesCircle className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter(item => item.grade !== 'Not graded' && !item.isPassed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="p-8 text-center">
              <FaExclamationTriangle className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Submissions Found</h3>
              <p className="text-gray-600">No test submissions match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        Student
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaFileAlt className="mr-2" />
                        Test
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attempt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaTrophy className="mr-2" />
                        Score
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedData.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {item.student.fullName?.charAt(0)?.toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.student.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.test.name}</div>
                        <div className="text-sm text-gray-500">{item.test.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {item.attempts}/{item.maxAttempts}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.grade !== "Not graded" ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.score}/{item.test.score}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round((item.score / item.test.score) * 100)}% - Grade {item.grade}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Pending Review</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status, item.isPassed, item.grade)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/TEACHER/check/ptest-enhanced/${item._id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <FaEye className="mr-2" />
                          {item.grade === "Not graded" ? "Grade" : "Review"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
