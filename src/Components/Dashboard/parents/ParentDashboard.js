import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../../Navbar/header';
import Loading from '../../Loading/Loading';
import { 
  FaUserPlus, FaUser, FaTrophy, FaChartLine, FaBook, FaCheckCircle, 
  FaTimesCircle, FaExclamationTriangle, FaKey, FaBrain, FaFileAlt,
  FaClock, FaStar, FaGraduationCap, FaCalendarAlt, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';

const ParentDashboard = () => {
  const [linkedStudent, setLinkedStudent] = useState(null);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [linkingCode, setLinkingCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showLinkingForm, setShowLinkingForm] = useState(false);

  useEffect(() => {
    checkLinkedStudent();
  }, []);

  const checkLinkedStudent = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/parent-link/student`);
      setLinkedStudent(response.data.data.student);
      fetchStudentPerformance();
    } catch (error) {
      setLinkedStudent(null);
      setLoading(false);
    }
  };

  const fetchStudentPerformance = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/parent-link/student-performance`);
      setStudentPerformance(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const linkToStudent = async (e) => {
    e.preventDefault();
    if (!linkingCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a linking code' });
      return;
    }

    try {
      setLinking(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/parent-link/link-student`, {
        linkingCode: linkingCode.trim().toUpperCase()
      });
      
      setLinkedStudent(response.data.data.student);
      setMessage({ type: 'success', text: 'Successfully linked to student!' });
      setLinkingCode('');
      setShowLinkingForm(false);
      fetchStudentPerformance();
      setLinking(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to link. Please check the code.' });
      setLinking(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Parent Dashboard</h1>
          <p className="text-gray-600">Monitor your child's academic progress</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {!linkedStudent ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaUserPlus className="text-6xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Link to Your Child</h2>
            <p className="text-gray-600 mb-6">Enter the linking code from your child</p>

            {!showLinkingForm ? (
              <button
                onClick={() => setShowLinkingForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaKey className="mr-2" />
                Enter Linking Code
              </button>
            ) : (
              <form onSubmit={linkToStudent} className="max-w-md mx-auto">
                <input
                  type="text"
                  value={linkingCode}
                  onChange={(e) => setLinkingCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  className="w-full px-4 py-3 border rounded-lg mb-4 text-center font-mono"
                  maxLength={6}
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={linking}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {linking ? 'Linking...' : 'Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLinkingForm(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {linkedStudent.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{linkedStudent.fullName}</h2>
                    <p className="text-gray-600">Standard {linkedStudent.standard}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            {studentPerformance && (
              <>
                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <FaFileAlt className="text-3xl text-blue-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Total Tests</p>
                        <p className="text-2xl font-bold">{studentPerformance.stats.totalTests}</p>
                        <p className="text-xs text-gray-500">All test attempts</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-3xl text-green-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Passed Tests</p>
                        <p className="text-2xl font-bold">{studentPerformance.stats.passedTests}</p>
                        <p className="text-xs text-gray-500">
                          {studentPerformance.stats.totalTests > 0 
                            ? Math.round((studentPerformance.stats.passedTests / studentPerformance.stats.totalTests) * 100)
                            : 0}% pass rate
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <FaTrophy className="text-3xl text-yellow-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold">{studentPerformance.stats.averageScore}%</p>
                        <p className="text-xs text-gray-500">Overall performance</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <FaBrain className="text-3xl text-purple-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Learning Plans</p>
                        <p className="text-2xl font-bold">
                          {studentPerformance.stats.completedLearningPlans}/{studentPerformance.stats.activeLearningPlans + studentPerformance.stats.completedLearningPlans}
                        </p>
                        <p className="text-xs text-gray-500">Completed plans</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Performance Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Recent Test Performance */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-blue-500" />
                      Recent Test Performance
                    </h3>
                    
                    {studentPerformance.recentTests && studentPerformance.recentTests.length > 0 ? (
                      <div className="space-y-3">
                        {studentPerformance.recentTests.slice(0, 5).map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                test.isPassed ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-gray-800">{test.test?.name || 'Test'}</p>
                                <p className="text-sm text-gray-600">{test.test?.subject || 'Subject'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800">
                                {test.score || 0}/{test.test?.score || 0}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(test.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No recent tests available</p>
                      </div>
                    )}
                  </div>

                  {/* Learning Plans Progress */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaBrain className="mr-2 text-purple-500" />
                      Learning Plans Progress
                    </h3>
                    
                    {studentPerformance.learningPlans && studentPerformance.learningPlans.length > 0 ? (
                      <div className="space-y-4">
                        {studentPerformance.learningPlans.map((plan, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">
                                Learning Plan #{plan.id?.slice(-6) || index + 1}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                plan.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                plan.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {plan.status}
                              </span>
                            </div>
                            
                            <div className="mb-2">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{plan.overallProgress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    plan.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${plan.overallProgress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Topics: {plan.completedTopics || 0}/{plan.totalTopics || 0}</span>
                              <span>
                                {plan.completedAt 
                                  ? `Completed ${new Date(plan.completedAt).toLocaleDateString()}`
                                  : `Created ${new Date(plan.createdAt).toLocaleDateString()}`
                                }
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">
                                {studentPerformance.stats.activeLearningPlans + studentPerformance.stats.completedLearningPlans}
                              </p>
                              <p className="text-sm text-blue-800">Total Plans</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">
                                {studentPerformance.stats.completedLearningPlans}
                              </p>
                              <p className="text-sm text-green-800">Completed</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-yellow-600">
                                {studentPerformance.stats.activeLearningPlans}
                              </p>
                              <p className="text-sm text-yellow-800">Active</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaBrain className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No learning plans available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Insights */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaGraduationCap className="mr-2 text-green-500" />
                    Academic Insights
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Performance Trend */}
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        {studentPerformance.stats.averageScore >= 75 ? (
                          <FaArrowUp className="text-green-500 mr-2" />
                        ) : studentPerformance.stats.averageScore >= 60 ? (
                          <FaClock className="text-yellow-500 mr-2" />
                        ) : (
                          <FaArrowDown className="text-red-500 mr-2" />
                        )}
                        <span className="font-semibold text-gray-800">Performance</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {studentPerformance.stats.averageScore >= 75 ? 'Excellent Performance' :
                         studentPerformance.stats.averageScore >= 60 ? 'Good Progress' :
                         'Needs Improvement'}
                      </p>
                    </div>

                    {/* Study Consistency */}
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <FaCalendarAlt className="text-green-500 mr-2" />
                        <span className="font-semibold text-gray-800">Activity</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {studentPerformance.stats.totalTests > 10 ? 'Very Active' :
                         studentPerformance.stats.totalTests > 5 ? 'Moderately Active' :
                         'Getting Started'}
                      </p>
                    </div>

                    {/* Learning Focus */}
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <FiTarget className="text-purple-500 mr-2" />
                        <span className="font-semibold text-gray-800">Focus</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {studentPerformance.stats.activeLearningPlans > 0 ? 'Following Learning Plans' :
                         studentPerformance.stats.completedLearningPlans > 0 ? 'Completed Improvements' :
                         'Ready for Challenges'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations for Parents */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaStar className="mr-2 text-yellow-500" />
                    Recommendations for You
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Encourage Regular Practice</h4>
                      <p className="text-sm text-gray-600">
                        Your child has taken {studentPerformance.stats.totalTests} tests. 
                        Regular practice helps improve performance and confidence.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Support Learning Plans</h4>
                      <p className="text-sm text-gray-600">
                        {studentPerformance.stats.activeLearningPlans > 0 
                          ? `Help your child complete ${studentPerformance.stats.activeLearningPlans} active learning plan(s).`
                          : 'Encourage your child to take more tests to get personalized learning recommendations.'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Celebrate Achievements</h4>
                      <p className="text-sm text-gray-600">
                        Your child has passed {studentPerformance.stats.passedTests} tests. 
                        Celebrate these successes to maintain motivation!
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Monitor Progress</h4>
                      <p className="text-sm text-gray-600">
                        Keep track of your child's learning journey and provide support 
                        when they face challenges in specific subjects.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
