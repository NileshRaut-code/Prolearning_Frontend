import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../Navbar/header';
import Loading from '../../Loading/Loading';
import { 
  FaUsers, 
  FaClipboardList, 
  FaChartBar, 
  FaPlus, 
  FaEye,
  FaEdit,
  FaRobot,
  FaGraduationCap,
  FaClock,
  FaTrophy,
  FaBook,
  FaArrowRight,
  FaCalendarAlt,
  FaQuestionCircle,
  FaFileAlt
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const TeacherDashboard = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    tests: [],
    physicalTests: [],
    students: [],
    recentActivity: [],
    analytics: {},
    loading: true
  });

  const teacherData = useSelector(store => store.user.data);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      axios.defaults.withCredentials = true;
      
      const [testsResponse, physicalTestsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/tests`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests`)
      ]);

      const myTests = testsResponse.data.data?.filter(test => 
        test.createdBy._id === teacherData._id
      ) || [];

      const myPhysicalTests = physicalTestsResponse.data.data?.filter(test => 
        test.teacherId === teacherData._id
      ) || [];

      setDashboardData({
        tests: myTests,
        physicalTests: myPhysicalTests,
        students: extractStudents(myTests),
        recentActivity: generateRecentActivity(myTests, myPhysicalTests),
        analytics: calculateAnalytics(myTests, myPhysicalTests),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const extractStudents = (tests) => {
    const studentMap = new Map();
    tests.forEach(test => {
      if (test.results) {
        test.results.forEach(result => {
          if (result.student && !studentMap.has(result.student._id)) {
            studentMap.set(result.student._id, {
              id: result.student._id,
              name: result.student.fullName,
              email: result.student.email,
              testsCompleted: 0,
              averageScore: 0
            });
          }
        });
      }
    });
    return Array.from(studentMap.values());
  };

  const generateRecentActivity = (tests, physicalTests) => {
    const activities = [];
    
    // Add test submissions
    tests.forEach(test => {
      if (test.results) {
        test.results.forEach(result => {
          activities.push({
            id: `test-${result._id}`,
            type: 'test_submission',
            title: `${result.student?.fullName} completed ${test.name}`,
            score: result.score,
            date: result.submittedAt,
            testId: test._id,
            studentName: result.student?.fullName
          });
        });
      }
    });

    // Add recent test creations
    [...tests, ...physicalTests].forEach(test => {
      activities.push({
        id: `created-${test._id}`,
        type: 'test_created',
        title: `Created test: ${test.name}`,
        date: test.createdAt,
        testId: test._id
      });
    });

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  };

  const calculateAnalytics = (tests, physicalTests) => {
    const totalTests = tests.length + physicalTests.length;
    const totalSubmissions = tests.reduce((sum, test) => sum + (test.results?.length || 0), 0);
    
    let totalScore = 0;
    let scoreCount = 0;
    
    tests.forEach(test => {
      if (test.results) {
        test.results.forEach(result => {
          totalScore += (result.correctAnswers / result.totalQuestions) * 100;
          scoreCount++;
        });
      }
    });

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    // Performance over time data
    const performanceData = tests.map((test, index) => {
      const testAverage = test.results?.length > 0 
        ? test.results.reduce((sum, result) => sum + ((result.correctAnswers / result.totalQuestions) * 100), 0) / test.results.length
        : 0;
      
      return {
        test: `Test ${index + 1}`,
        average: Math.round(testAverage),
        submissions: test.results?.length || 0
      };
    }).slice(0, 10);

    // Grade distribution
    const gradeDistribution = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    tests.forEach(test => {
      if (test.results) {
        test.results.forEach(result => {
          const percentage = (result.correctAnswers / result.totalQuestions) * 100;
          if (percentage >= 90) gradeDistribution.A++;
          else if (percentage >= 80) gradeDistribution.B++;
          else if (percentage >= 70) gradeDistribution.C++;
          else if (percentage >= 60) gradeDistribution.D++;
          else gradeDistribution.F++;
        });
      }
    });

    const gradeChartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
      grade,
      count
    }));

    return {
      totalTests,
      totalSubmissions,
      averageScore,
      activeTests: tests.filter(test => test.results?.length > 0).length,
      performanceData,
      gradeChartData
    };
  };

  const getRecentTests = () => {
    return [...dashboardData.tests, ...dashboardData.physicalTests]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  if (dashboardData.loading) return <Loading />;

  const analytics = dashboardData.analytics;
  const recentTests = getRecentTests();

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {teacherData?.fullName}!</h1>
              <p className="text-green-100">Manage your tests and track student progress</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{analytics.totalTests}</p>
              <p className="text-sm text-green-100">Total Tests Created</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaClipboardList className="text-4xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Total Tests</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.totalTests}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaUsers className="text-4xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Submissions</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.totalSubmissions}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Avg Score</h3>
            <p className="text-3xl font-bold text-yellow-600">{analytics.averageScore}%</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaChartBar className="text-4xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Active Tests</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.activeTests}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaGraduationCap className="text-4xl text-indigo-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Students</h3>
            <p className="text-3xl font-bold text-indigo-600">{dashboardData.students.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Analytics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Test Performance Overview</h3>
            {analytics.performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="test" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FaChartBar className="text-6xl mb-4 mx-auto" />
                  <p>No test data available</p>
                  <p className="text-sm">Create tests to see analytics</p>
                </div>
              </div>
            )}
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Grade Distribution</h3>
            {analytics.gradeChartData.some(item => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.gradeChartData.filter(item => item.count > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ grade, count }) => `${grade}: ${count}`}
                  >
                    {analytics.gradeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FaTrophy className="text-6xl mb-4 mx-auto" />
                  <p>No grades available</p>
                  <p className="text-sm">Students need to complete tests</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Tests */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Recent Tests</h3>
              <Link 
                to="/teacher/test-management" 
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All <FaArrowRight className="inline ml-1" />
              </Link>
            </div>
            
            {recentTests.length > 0 ? (
              <div className="space-y-3">
                {recentTests.map((test) => (
                  <div key={test._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{test.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          {test.questions ? (
                            <>
                              <FaQuestionCircle className="mr-1" />
                              <span>{test.questions.length} questions</span>
                            </>
                          ) : (
                            <>
                              <FaFileAlt className="mr-1" />
                              <span>Physical Test</span>
                            </>
                          )}
                          <FaCalendarAlt className="ml-3 mr-1" />
                          <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {test.results?.length || 0} submissions
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/teacher/test/${test._id}/results`}
                          className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FaEye className="mr-1" />
                          Results
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaClipboardList className="text-4xl mb-2 mx-auto" />
                <p>No tests created yet</p>
                <Link 
                  to="/teacher/create/ai-test"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Create your first test
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            
            {dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'test_submission' ? (
                        <FaTrophy className="text-green-500" />
                      ) : (
                        <FaPlus className="text-blue-500" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.score && `Score: ${activity.score} • `}
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    {activity.type === 'test_submission' && (
                      <Link
                        to={`/teacher/test/${activity.testId}/results`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEye />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl mb-2 mx-auto" />
                <p>No recent activity</p>
                <p className="text-sm">Activity will appear here as students take tests</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/teacher/create/ai-test"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaRobot className="text-2xl text-blue-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">AI Test Generator</h4>
                <p className="text-sm text-gray-600">Create tests with AI</p>
              </div>
            </Link>
            
            <Link
              to="/teacher/create/ptest"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaPlus className="text-2xl text-green-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Create Test</h4>
                <p className="text-sm text-gray-600">Manual test creation</p>
              </div>
            </Link>
            
            <Link
              to="/teacher/test-management"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FaClipboardList className="text-2xl text-purple-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Manage Tests</h4>
                <p className="text-sm text-gray-600">View and edit tests</p>
              </div>
            </Link>
            
            <Link
              to="/teacher/analytics"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <FaChartBar className="text-2xl text-orange-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Analytics</h4>
                <p className="text-sm text-gray-600">Detailed insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
