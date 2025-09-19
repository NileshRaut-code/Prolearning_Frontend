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
  FaDownload,
  FaEye,
  FaRedo,
  FaClipboardList,
  FaExclamationTriangle,
  FaStar
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const PhysicalTestResult = () => {
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { id } = useParams(); // This is the answerCopyId
  const navigate = useNavigate();
  
  const userData = useSelector(store => store.user.data);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies/${id}`);
      const resultData = response.data.data;
      
      setResult(resultData);
      setTest(resultData.test);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching result:', error);
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'B+': 'text-blue-600',
      'B': 'text-blue-600',
      'C+': 'text-yellow-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'F': 'text-red-600'
    };
    return gradeColors[grade] || 'text-gray-600';
  };

  const getStatusBadge = (status, isPassed) => {
    if (isPassed) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="mr-2" />
          Passed
        </span>
      );
    } else if (status === 'failed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <FaTimesCircle className="mr-2" />
          Failed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <FaExclamationTriangle className="mr-2" />
          Graded
        </span>
      );
    }
  };

  const calculatePercentage = () => {
    if (!result || !test) return 0;
    return Math.round((result.score / test.score) * 100);
  };

  const getPerformanceData = () => {
    const percentage = calculatePercentage();
    return [
      { name: 'Scored', value: result.score, color: '#10B981' },
      { name: 'Remaining', value: test.score - result.score, color: '#EF4444' }
    ];
  };

  const getGradeAnalysis = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return { grade: 'A+', description: 'Excellent Performance', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', description: 'Very Good Performance', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B+', description: 'Good Performance', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', description: 'Satisfactory Performance', color: 'text-blue-600' };
    if (percentage >= 50) return { grade: 'C', description: 'Average Performance', color: 'text-yellow-600' };
    if (percentage >= 40) return { grade: 'D', description: 'Below Average Performance', color: 'text-orange-600' };
    return { grade: 'F', description: 'Needs Improvement', color: 'text-red-600' };
  };

  if (loading) return <Loading />;

  if (!result || !test) {
    return (
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Result Not Found</h2>
            <p className="text-gray-600 mb-4">The test result you're looking for could not be found.</p>
            <Link
              to="/student/physical-test"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const percentage = calculatePercentage();
  const performanceData = getPerformanceData();
  const gradeAnalysis = getGradeAnalysis();

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
            <h1 className="text-2xl font-bold text-gray-800">Test Result</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusBadge(result.status, result.isPassed)}
            {!result.isPassed && result.canRetry && (
              <Link
                to={`/student/physical-test-enhanced/${test._id}`}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaRedo className="mr-2" />
                Retry Test
              </Link>
            )}
          </div>
        </div>

        {/* Test Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{test.name}</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-3 text-blue-500" />
                  <span>Teacher: {test.teacher?.fullName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaFileAlt className="mr-3 text-green-500" />
                  <span>Subject: {test.subject}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaGraduationCap className="mr-3 text-purple-500" />
                  <span>Standard: {test.standard}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-3 text-orange-500" />
                  <span>Submitted: {new Date(result.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Attempt Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Attempt</p>
                    <p className="text-2xl font-bold text-blue-600">{result.attempts}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining</p>
                    <p className="text-2xl font-bold text-orange-600">{result.remainingAttempts || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Score Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Score</h3>
            <div className="text-4xl font-bold mb-2">
              <span className={result.isPassed ? 'text-green-600' : 'text-red-600'}>
                {result.score}
              </span>
              <span className="text-gray-400">/{test.score}</span>
            </div>
            <div className="text-2xl font-semibold mb-2">
              <span className={result.isPassed ? 'text-green-600' : 'text-red-600'}>
                {percentage}%
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Passing Score: {result.passingScore || 60}%
            </p>
          </div>

          {/* Grade Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaStar className="text-4xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Grade</h3>
            <div className={`text-4xl font-bold mb-2 ${getGradeColor(result.grade)}`}>
              {result.grade}
            </div>
            <div className={`text-lg font-medium mb-2 ${gradeAnalysis.color}`}>
              {gradeAnalysis.grade}
            </div>
            <p className="text-sm text-gray-600">
              {gradeAnalysis.description}
            </p>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Feedback Section */}
          {result.feedback && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Teacher's Feedback</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Improvement Areas</h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {rec.topicId?.name || `Topic ${index + 1}`}
                      </span>
                      {rec.score && (
                        <span className="text-sm text-gray-600">
                          Score: {rec.score}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {result.planId && (
                <div className="mt-4">
                  <Link
                    to={`/student/learning-plan/${result.planId}`}
                    className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <FaClipboardList className="mr-2" />
                    View Learning Plan
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Sheet */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Submitted Answer Sheet</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaFileAlt className="text-2xl text-red-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Answer Sheet PDF</p>
                  <p className="text-sm text-gray-600">
                    Submitted on {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={result.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaEye className="mr-2" />
                View PDF
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/student/physical-test"
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tests
          </Link>
          
          <Link
            to="/student/performance"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaClipboardList className="mr-2" />
            View All Results
          </Link>
          
          {!result.isPassed && result.canRetry && (
            <Link
              to={`/student/physical-test-enhanced/${test._id}`}
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FaRedo className="mr-2" />
              Retry Test ({result.remainingAttempts} attempts left)
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhysicalTestResult;
