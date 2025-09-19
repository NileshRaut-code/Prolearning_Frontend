import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaCheckCircle, 
  FaClock, 
  FaPlay,
  FaFileAlt,
  FaCalendarAlt,
  FaTrophy,
  FaChartLine,
  FaExclamationTriangle,
  FaBrain,
  FaBook
} from 'react-icons/fa';
import {FiTarget} from "react-icons/fi"
const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  
  const userData = useSelector(store => store.user.data);

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/plan/student/${userData._id}`);
      setPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-gray-100 text-gray-800', icon: FaClock },
      'In Progress': { color: 'bg-blue-100 text-blue-800', icon: FaPlay },
      'Completed': { color: 'bg-green-100 text-green-800', icon: FaCheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="mr-2" />
        {status}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) return <Loading />;

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Learning Plans</h1>
          <p className="text-gray-600">Track your personalized improvement recommendations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaFileAlt className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-800">{plans.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaPlay className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">
                  {plans.filter(plan => plan.status === 'In Progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaCheckCircle className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {plans.filter(plan => plan.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaTrophy className="text-3xl text-purple-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-800">
                  {plans.length > 0 ? Math.round(plans.reduce((acc, plan) => acc + (plan.overallProgress || 0), 0) / plans.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Plans List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {plans.length === 0 ? (
            <div className="p-8 text-center">
              <FaExclamationTriangle className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Learning Plans Found</h3>
              <p className="text-gray-600 mb-4">
                Learning plans are automatically generated based on your test performance. 
                Take some tests to get personalized improvement recommendations!
              </p>
              <Link
                to="/student/test"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaBook className="mr-2" />
                Take a Test
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {plans.map((plan) => (
                <div key={plan._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Learning Plan #{plan._id.slice(-6)}
                          </h3>
                          {getStatusBadge(plan.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <FiTarget  className="mr-2 text-blue-500" />
                          <span>Topics: {plan.totalTopicsCount || plan.recommendedTopics?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCheckCircle className="mr-2 text-green-500" />
                          <span>Completed: {plan.completedTopicsCount || 0}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaChartLine className="mr-2 text-purple-500" />
                          <span>Progress: {plan.overallProgress || 0}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                          <span className="text-sm text-gray-600">{plan.overallProgress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(plan.overallProgress || 0)}`}
                            style={{ width: `${plan.overallProgress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Topics Preview */}
                      {plan.recommendedTopics && plan.recommendedTopics.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.recommendedTopics.slice(0, 3).map((topic, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  topic.isCompleted 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {topic.isCompleted && <FaCheckCircle className="inline mr-1" />}
                                {topic.topicName}
                              </span>
                            ))}
                            {plan.recommendedTopics.length > 3 && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{plan.recommendedTopics.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {plan.completedAt && (
                        <div className="flex items-center text-green-600 text-sm">
                          <FaTrophy className="mr-2" />
                          <span>Completed on {new Date(plan.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      <Link
                        to={`/student/learning-plan/${plan._id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaBrain className="mr-2" />
                        {plan.status === 'Completed' ? 'Review Plan' : 'Continue Learning'}
                      </Link>
                      
                      {plan.status !== 'Completed' && (
                        <div className="text-center">
                          <span className="text-xs text-gray-500">
                            {plan.totalTopicsCount - plan.completedTopicsCount} topics remaining
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaChartLine className="mr-2" />
            Back to Dashboard
          </Link>
          
          <Link
            to="/student/test"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaBook className="mr-2" />
            Take Tests
          </Link>
          
          <Link
            to="/student/performance"
            className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaTrophy className="mr-2" />
            View Performance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanList;
