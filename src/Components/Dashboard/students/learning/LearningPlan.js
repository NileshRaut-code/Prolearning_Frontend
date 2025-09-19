import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaArrowLeft,
  FaCheckCircle, 
  FaTimesCircle, 
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaTrophy,
  FaGraduationCap,
  FaBook,
  FaLightbulb,
  FaClock,
  FaPlay,
  FaCheck,
  FaExclamationTriangle,
  FaStar,
  FaChartLine,

  FaBrain,
  FaQuestionCircle
} from 'react-icons/fa';
// Removed circular progress bar dependency for simplicity
import {FiTarget} from "react-icons/fi";
const LearningPlan = () => {
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTopic, setUpdatingTopic] = useState(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const userData = useSelector(store => store.user.data);

  useEffect(() => {
    fetchLearningPlan();
  }, [id]);

  const fetchLearningPlan = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/plan/progress/${id}`);
      setPlan(response.data.data);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching learning plan:', error);
      setLoading(false);
    }
  };

  const markTopicCompleted = async (topicId) => {
    try {
      setUpdatingTopic(topicId);
      axios.defaults.withCredentials = true;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/plan/${id}/topic/${topicId}/complete`);
      
      // Refresh the plan data
      await fetchLearningPlan();
      setUpdatingTopic(null);
    } catch (error) {
      console.error('Error marking topic as completed:', error);
      setUpdatingTopic(null);
    }
  };

  const updateTopicProgress = async (topicId, progress) => {
    try {
      setUpdatingTopic(topicId);
      axios.defaults.withCredentials = true;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/plan/${id}/topic/${topicId}/progress`, {
        progress
      });
      
      // Refresh the plan data
      await fetchLearningPlan();
      setUpdatingTopic(null);
    } catch (error) {
      console.error('Error updating topic progress:', error);
      setUpdatingTopic(null);
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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-600 bg-green-50 border-green-200',
      'Medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'Hard': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[difficulty] || colors['Medium'];
  };

  if (loading) return <Loading />;

  if (!plan) {
    return (
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Learning Plan Not Found</h2>
            <p className="text-gray-600 mb-4">The learning plan you're looking for could not be found.</p>
            <Link
              to="/student/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Learning Plan</h1>
              <p className="text-gray-600">Personalized improvement recommendations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusBadge(plan.status)}
            {plan.completedAt && (
              <span className="text-sm text-gray-600">
                Completed on {new Date(plan.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Overall Progress */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {stats?.overallProgress || 0}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    stats?.overallProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${stats?.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
          </div>

          {/* Completed Topics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaCheckCircle className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Completed Topics</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.completedTopics || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Topics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaClock className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Pending Topics</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.pendingTopics || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <FaCalendarAlt className="text-3xl text-purple-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Days Active</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.timeSpent || Math.ceil((new Date() - new Date(plan.createdAt)) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Plan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-3 text-blue-500" />
                <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiTarget  className="mr-3 text-green-500" />
                <span>Total Topics: {stats?.totalTopics || 0}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaChartLine className="mr-3 text-purple-500" />
                <span>Status: {plan.status}</span>
              </div>
              {plan.completedAt && (
                <div className="flex items-center text-gray-600">
                  <FaTrophy className="mr-3 text-yellow-500" />
                  <span>Completed: {new Date(plan.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recommended Topics</h2>
          
          <div className="space-y-6">
            {plan.recommendedTopics.map((topic, index) => (
              <div key={topic.topicId._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 mr-3">
                        {topic.topicName}
                      </h3>
                      {topic.isCompleted && (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-800">
                          {topic.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            topic.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${topic.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {topic.completedAt && (
                      <p className="text-sm text-gray-600 mb-3">
                        Completed on {new Date(topic.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {!topic.isCompleted ? (
                      <>
                        <button
                          onClick={() => markTopicCompleted(topic.topicId._id)}
                          disabled={updatingTopic === topic.topicId._id}
                          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {updatingTopic === topic.topicId._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <FaCheck className="mr-2" />
                          )}
                          Mark Complete
                        </button>
                        
                        <div className="flex space-x-1">
                          {[25, 50, 75].map(progress => (
                            <button
                              key={progress}
                              onClick={() => updateTopicProgress(topic.topicId._id, progress)}
                              disabled={updatingTopic === topic.topicId._id}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                            >
                              {progress}%
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span className="font-medium">Completed!</span>
                      </div>
                    )}
                    
                    <Link
                      to={`/topic/${topic.topicId._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaBook className="mr-2" />
                      Study Topic
                    </Link>
                  </div>
                </div>

                {/* AI Generated Q&A */}
                {topic.aiGeneratedQnA && topic.aiGeneratedQnA.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <FaBrain className="mr-2 text-purple-500" />
                      AI-Generated Practice Questions
                    </h4>
                    
                    <div className="space-y-3">
                      {topic.aiGeneratedQnA.slice(0, 3).map((qa, qaIndex) => (
                        <div key={qaIndex} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <FaQuestionCircle className="text-blue-500 mr-2 mt-1" />
                              <p className="font-medium text-gray-800">{qa.question}</p>
                            </div>
                            {qa.difficultyLevel && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(qa.difficultyLevel)}`}>
                                {qa.difficultyLevel}
                              </span>
                            )}
                          </div>
                          {qa.tags && qa.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {qa.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {topic.aiGeneratedQnA.length > 3 && (
                        <p className="text-sm text-gray-600 text-center">
                          +{topic.aiGeneratedQnA.length - 3} more questions available
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          
          <Link
            to="/student/performance"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaChartLine className="mr-2" />
            View Performance
          </Link>
          
          {plan.status === 'Completed' && (
            <Link
              to="/student/test"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaTrophy className="mr-2" />
              Take New Tests
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlan;
