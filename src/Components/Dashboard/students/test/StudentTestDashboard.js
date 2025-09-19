import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaClock, 
  FaQuestionCircle, 
  FaFileAlt, 
  FaChartLine, 
  FaPlay,
  FaEye,
  FaFilter,
  FaSearch,
  FaTrophy,
  FaCalendarAlt
} from 'react-icons/fa';

const StudentTestDashboard = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [mcqTests, setMcqTests] = useState([]);
  const [physicalTests, setPhysicalTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, mcq, physical, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  
  const userdata = useSelector(store => store.user.data);
  const standard = userdata?.standard || 10;

  useEffect(() => {
    fetchTests();
    fetchSubjects();
  }, [standard]);

  const fetchTests = async () => {
    try {
      axios.defaults.withCredentials = true;
      
      // Fetch MCQ tests
      const mcqResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests`);
      setMcqTests(mcqResponse.data.data || []);
      
      // Fetch physical tests by standard
      const physicalResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/standard/${standard}`);
      setPhysicalTests(physicalResponse.data.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${standard}`);
      setSubjects(response.data.data.standards[0]?.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const hasUserTakenTest = (test, isPhysical = false) => {
    if (isPhysical) {
      // Check if user has submitted this physical test
      return false; // You'll need to implement this check
    } else {
      // Check if user has taken this MCQ test
      return test.results?.some(result => result.student === userdata._id);
    }
  };

  const getUserTestResult = (test, isPhysical = false) => {
    if (isPhysical) {
      return null; // Implement physical test result lookup
    } else {
      return test.results?.find(result => result.student === userdata._id);
    }
  };

  const filterTests = (tests, isPhysical = false) => {
    return tests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = !filterSubject || 
        (isPhysical ? test.subject === filterSubject : true); // Adjust based on your data structure
      
      const isTaken = hasUserTakenTest(test, isPhysical);
      
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'mcq' && !isPhysical) ||
        (activeTab === 'physical' && isPhysical) ||
        (activeTab === 'completed' && isTaken) ||
        (activeTab === 'pending' && !isTaken);
      
      return matchesSearch && matchesSubject && matchesTab;
    });
  };

  const getTestStats = () => {
    const totalMcq = mcqTests.length;
    const totalPhysical = physicalTests.length;
    const completedMcq = mcqTests.filter(test => hasUserTakenTest(test, false)).length;
    const completedPhysical = physicalTests.filter(test => hasUserTakenTest(test, true)).length;
    
    return {
      total: totalMcq + totalPhysical,
      completed: completedMcq + completedPhysical,
      pending: (totalMcq + totalPhysical) - (completedMcq + completedPhysical),
      mcqTotal: totalMcq,
      physicalTotal: totalPhysical
    };
  };

  if (loading) return <Loading />;

  const stats = getTestStats();
  const filteredMcqTests = filterTests(mcqTests, false);
  const filteredPhysicalTests = filterTests(physicalTests, true);

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Tests</h1>
              <p className="text-gray-600">Take tests and track your progress</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Standard {standard}</p>
              <p className="text-lg font-semibold text-blue-600">
                {stats.completed}/{stats.total} Completed
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaQuestionCircle className="text-4xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Total Tests</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaTrophy className="text-4xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaClock className="text-4xl text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaChartLine className="text-4xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Success Rate</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Tests', count: stats.total },
                { key: 'mcq', label: 'MCQ Tests', count: stats.mcqTotal },
                { key: 'physical', label: 'Physical Tests', count: stats.physicalTotal },
                { key: 'completed', label: 'Completed', count: stats.completed },
                { key: 'pending', label: 'Pending', count: stats.pending }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MCQ Tests */}
          {(activeTab === 'all' || activeTab === 'mcq' || activeTab === 'completed' || activeTab === 'pending') &&
            filteredMcqTests.map((test) => {
              const isTaken = hasUserTakenTest(test, false);
              const result = getUserTestResult(test, false);
              
              return (
                <div key={`mcq-${test._id}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Test Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <FaQuestionCircle className="mr-1" />
                            <span>{test.questions?.length || 0} questions</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{test.timeLimit || 60} min</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        MCQ
                      </span>
                    </div>
                  </div>

                  {/* Test Body */}
                  <div className="p-6">
                    {isTaken && result ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Your Score:</span>
                          <span className="font-bold text-green-600">
                            {result.score}/{test.questions?.reduce((sum, q) => sum + (q.score || 1), 0) || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.round((result.correctAnswers / result.totalQuestions) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm">
                          {test.instructions || "Complete this test to assess your knowledge."}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {isTaken ? (
                        <>
                          <Link
                            to={`/student/test/result/view/${result._id}`}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <FaEye className="mr-2" />
                            View Result
                          </Link>
                          <Link
                            to={`/student/test/enhanced/${test._id}`}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaPlay className="mr-2" />
                            Retake
                          </Link>
                        </>
                      ) : (
                        <Link
                          to={`/student/test/enhanced/${test._id}`}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaPlay className="mr-2" />
                          Start Test
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Test Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Created {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}

          {/* Physical Tests */}
          {(activeTab === 'all' || activeTab === 'physical' || activeTab === 'completed' || activeTab === 'pending') &&
            filteredPhysicalTests.map((test) => {
              const isTaken = hasUserTakenTest(test, true);
              
              return (
                <div key={`physical-${test._id}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Test Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <FaFileAlt className="mr-1" />
                            <span>{test.questions?.length || 0} questions</span>
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            <span>Due: {new Date(test.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Physical
                      </span>
                    </div>
                  </div>

                  {/* Test Body */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm">
                        {test.description || "Download, solve, and upload your answer sheet."}
                      </p>
                      {test.score && (
                        <p className="text-sm text-gray-500 mt-2">
                          Total Marks: {test.score}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {isTaken ? (
                        <>
                          <Link
                            to={`/student/ptest/result/${test._id}`}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <FaEye className="mr-2" />
                            View Result
                          </Link>
                        </>
                      ) : (
                        <Link
                          to={`/student/physical-test-enhanced/${test._id}`}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaPlay className="mr-2" />
                          Take Test
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Test Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Subject: {test.subject} • Standard: {test.standard}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty State */}
        {filteredMcqTests.length === 0 && filteredPhysicalTests.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests found</h3>
            <p className="text-gray-500">
              {searchTerm || filterSubject 
                ? 'Try adjusting your search or filter criteria'
                : 'No tests are available for your standard yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTestDashboard;
