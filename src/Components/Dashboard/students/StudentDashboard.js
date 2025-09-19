import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../Navbar/header';
import Loading from '../../Loading/Loading';
import { 
  FaBook, 
  FaClipboardList, 
  FaTrophy, 
  FaChartLine, 
  FaClock, 
  FaPlay,
  FaEye,
  FaUsers,
  FaGraduationCap,
  FaCalendarAlt,
  FaStar,
  FaArrowRight,
  FaBookOpen,
  FaQuestionCircle
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const StudentDashboard = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    tests: [],
    physicalTests: [],
    subjects: [],
    recentActivity: [],
    performance: {},
    loading: true
  });

  const userdata = useSelector(store => store.user.data);
  const standard = userdata?.standard || 10;

  useEffect(() => {
    fetchDashboardData();
  }, [standard]);

  const fetchDashboardData = async () => {
    try {
      axios.defaults.withCredentials = true;
      
      const [testsResponse, physicalTestsResponse, subjectsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/tests`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/standard/${standard}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${standard}`)
      ]);

      setDashboardData({
        tests: testsResponse.data.data || [],
        physicalTests: physicalTestsResponse.data.data || [],
        subjects: subjectsResponse.data.data.standards[0]?.subjects || [],
        recentActivity: generateRecentActivity(testsResponse.data.data || []),
        performance: calculatePerformance(testsResponse.data.data || []),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const generateRecentActivity = (tests) => {
    const activities = [];
    tests.forEach(test => {
      if (test.results) {
        test.results.forEach(result => {
          if (result.student === userdata._id) {
            activities.push({
              id: result._id,
              type: 'test_completed',
              title: `Completed ${test.name}`,
              score: result.score,
              date: result.submittedAt,
              testId: test._id
            });
          }
        });
      }
    });
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  const calculatePerformance = (tests) => {
    const userResults = [];
    tests.forEach(test => {
      if (test.results) {
        test.results.forEach(result => {
          if (result.student === userdata._id) {
            userResults.push({
              testName: test.name,
              score: result.score,
              percentage: Math.round((result.correctAnswers / result.totalQuestions) * 100),
              date: result.submittedAt
            });
          }
        });
      }
    });

    const averageScore = userResults.length > 0 
      ? userResults.reduce((sum, result) => sum + result.percentage, 0) / userResults.length 
      : 0;

    return {
      totalTests: userResults.length,
      averageScore: Math.round(averageScore),
      recentTests: userResults.slice(0, 5),
      performanceData: userResults.map((result, index) => ({
        test: index + 1,
        score: result.percentage
      }))
    };
  };

  const getUpcomingTests = () => {
    const upcoming = [...dashboardData.tests, ...dashboardData.physicalTests]
      .filter(test => !hasUserTakenTest(test))
      .slice(0, 3);
    return upcoming;
  };

  const hasUserTakenTest = (test) => {
    if (test.results) {
      return test.results.some(result => result.student === userdata._id);
    }
    return false;
  };

  const getQuickStats = () => {
    const totalTests = dashboardData.tests.length + dashboardData.physicalTests.length;
    const completedTests = dashboardData.performance.totalTests;
    const pendingTests = totalTests - completedTests;
    
    return {
      totalTests,
      completedTests,
      pendingTests,
      subjects: dashboardData.subjects.length,
      averageScore: dashboardData.performance.averageScore
    };
  };

  if (dashboardData.loading) return <Loading />;

  const stats = getQuickStats();
  const upcomingTests = getUpcomingTests();

  const pieData = [
    { name: 'Completed', value: stats.completedTests, color: '#10B981' },
    { name: 'Pending', value: stats.pendingTests, color: '#F59E0B' }
  ];

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userdata?.fullName}!</h1>
              <p className="text-blue-100">Ready to continue your learning journey?</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Standard {standard}</p>
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
              <p className="text-sm text-blue-100">Average Score</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaClipboardList className="text-4xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Total Tests</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTests}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaTrophy className="text-4xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedTests}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaClock className="text-4xl text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingTests}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaBook className="text-4xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Subjects</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.subjects}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaChartLine className="text-4xl text-indigo-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Avg Score</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.averageScore}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h3>
            {dashboardData.performance.performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.performance.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="test" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FaChartLine className="text-6xl mb-4 mx-auto" />
                  <p>No test data available yet</p>
                  <p className="text-sm">Take some tests to see your performance</p>
                </div>
              </div>
            )}
          </div>

          {/* Test Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Test Progress</h3>
            {stats.totalTests > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FaQuestionCircle className="text-6xl mb-4 mx-auto" />
                  <p>No tests available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Upcoming Tests */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Tests</h3>
              <Link 
                to="/student/test-dashboard" 
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All <FaArrowRight className="inline ml-1" />
              </Link>
            </div>
            
            {upcomingTests.length > 0 ? (
              <div className="space-y-3">
                {upcomingTests.map((test, index) => (
                  <div key={test._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{test.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FaQuestionCircle className="mr-1" />
                          <span>{test.questions?.length || 0} questions</span>
                          {test.timeLimit && (
                            <>
                              <FaClock className="ml-3 mr-1" />
                              <span>{test.timeLimit} min</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Link
                        to={test.type === 'physical' 
                          ? `/student/physical-test/${test._id}` 
                          : `/student/test/enhanced/${test._id}`
                        }
                        className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaPlay className="mr-1" />
                        Start
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaGraduationCap className="text-4xl mb-2 mx-auto" />
                <p>No upcoming tests</p>
                <p className="text-sm">All caught up!</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
              <Link 
                to="/student/performance" 
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All <FaArrowRight className="inline ml-1" />
              </Link>
            </div>
            
            {dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <FaTrophy className="text-green-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        Score: {activity.score} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/student/test/result/view/${activity.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl mb-2 mx-auto" />
                <p>No recent activity</p>
                <p className="text-sm">Start taking tests to see your progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/student/test-dashboard"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaClipboardList className="text-2xl text-blue-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Take Tests</h4>
                <p className="text-sm text-gray-600">Browse and take available tests</p>
              </div>
            </Link>
            
            <Link
              to="/student/test-browse"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaBookOpen className="text-2xl text-green-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Browse Tests</h4>
                <p className="text-sm text-gray-600">Discover new tests</p>
              </div>
            </Link>
            
            <Link
              to="/student/performance"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FaChartLine className="text-2xl text-purple-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Performance</h4>
                <p className="text-sm text-gray-600">View detailed analytics</p>
              </div>
            </Link>
            
            <Link
              to="/studymaterial"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <FaBook className="text-2xl text-orange-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Study Material</h4>
                <p className="text-sm text-gray-600">Access learning resources</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
