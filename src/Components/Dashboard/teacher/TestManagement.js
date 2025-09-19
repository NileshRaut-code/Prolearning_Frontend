import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../Navbar/header';
import { useSelector } from 'react-redux';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaClock, 
  FaChartBar,
  FaRobot,
  FaSearch
} from 'react-icons/fa';
import Loading from '../../Loading/Loading';

const TestManagement = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const teacherId = useSelector(store => store.user.data._id);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests`);
      // Filter tests created by current teacher
      const teacherTests = response.data.data.filter(test => 
        test.createdBy._id === teacherId
      );
      setTests(teacherTests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setLoading(false);
    }
  };

  const deleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tests/${testId}`);
      setTests(tests.filter(test => test._id !== testId));
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const getTestStats = (test) => {
    const totalStudents = test.results?.length || 0;
    const averageScore = totalStudents > 0 
      ? test.results.reduce((sum, result) => sum + result.score, 0) / totalStudents 
      : 0;
    const completionRate = totalStudents; // Assuming all results are completed tests
    
    return { totalStudents, averageScore: Math.round(averageScore * 100) / 100, completionRate };
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && test.results?.length > 0) ||
      (filterStatus === 'draft' && (!test.results || test.results.length === 0));
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading />;

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Test Management</h1>
              <p className="text-gray-600">Manage and monitor your tests</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/teacher/create/ai-test"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaRobot className="mr-2" />
                AI Test Generator
              </Link>
              <Link
                to="/teacher/create/ptest"
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaPlus className="mr-2" />
                Create Test
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tests</option>
                <option value="active">Active Tests</option>
                <option value="draft">Draft Tests</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredTests.length} of {tests.length} tests
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const stats = getTestStats(test);
            return (
              <div key={test._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Test Header */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{test.timeLimit || 60} min</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{stats.totalStudents} students</span>
                    </div>
                  </div>
                </div>

                {/* Test Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{test.questions?.length || 0}</p>
                      <p className="text-sm text-gray-600">Questions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.averageScore}</p>
                      <p className="text-sm text-gray-600">Avg Score</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      stats.totalStudents > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stats.totalStudents > 0 ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/teacher/test/${test._id}/results`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaChartBar className="mr-1" />
                      Results
                    </Link>
                    <Link
                      to={`/teacher/test/${test._id}/preview`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FaEye className="mr-1" />
                      Preview
                    </Link>
                  </div>

                  <div className="flex space-x-2 mt-2">
                    <Link
                      to={`/teacher/test/${test._id}/edit`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTest(test._id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
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
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No tests found' : 'No tests created yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first test to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <div className="flex justify-center space-x-4">
                <Link
                  to="/teacher/create/ai-test"
                  className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaRobot className="mr-2" />
                  Generate with AI
                </Link>
                <Link
                  to="/teacher/create/ptest"
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Create Manually
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {tests.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{tests.length}</p>
                <p className="text-sm text-gray-600">Total Tests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {tests.filter(test => test.results?.length > 0).length}
                </p>
                <p className="text-sm text-gray-600">Active Tests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {tests.reduce((sum, test) => sum + (test.results?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestManagement;
