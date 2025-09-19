import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaUser, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartBar,
  FaDownload,
  FaEye
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TestGradingInterface = () => {
  const [test, setTest] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState('overview'); // overview, individual, analytics
  const { testId } = useParams();

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        axios.defaults.withCredentials = true;
        
        // Fetch test details
        const testResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/${testId}`);
        setTest(testResponse.data.data);
        
        // Fetch test results
        const resultsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/${testId}/results`);
        setResults(resultsResponse.data.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test data:', error);
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${secs}s`;
  };

  const getPercentage = (correct, total) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateAnalytics = () => {
    if (results.length === 0) return null;

    const totalStudents = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalStudents;
    const averagePercentage = results.reduce((sum, result) => 
      sum + getPercentage(result.correctAnswers, result.totalQuestions), 0) / totalStudents;
    
    const gradeDistribution = results.reduce((acc, result) => {
      const percentage = getPercentage(result.correctAnswers, result.totalQuestions);
      let grade;
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';
      else grade = 'F';
      
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    return {
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      averagePercentage: Math.round(averagePercentage),
      gradeDistribution
    };
  };

  const analytics = calculateAnalytics();

  if (loading) return <Loading />;
  if (!test) return <div>Test not found</div>;

  const gradeChartData = analytics ? Object.entries(analytics.gradeDistribution).map(([grade, count]) => ({
    grade,
    count
  })) : [];

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{test.name}</h1>
              <p className="text-gray-600">
                {results.length} student{results.length !== 1 ? 's' : ''} submitted
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'overview' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'analytics' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Analytics
              </button>
              <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <FaDownload className="mr-2" />
                Export Results
              </button>
            </div>
          </div>
        </div>

        {/* Analytics View */}
        {viewMode === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <FaUser className="text-4xl text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalStudents}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <FaChartBar className="text-4xl text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">Average Score</h3>
                <p className="text-3xl font-bold text-green-600">{analytics.averageScore}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <FaCheckCircle className="text-4xl text-purple-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">Average %</h3>
                <p className="text-3xl font-bold text-purple-600">{analytics.averagePercentage}%</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <FaClock className="text-4xl text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.round((results.length / analytics.totalStudents) * 100)}%
                </p>
              </div>
            </div>

            {/* Grade Distribution Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Overview/Results List */}
        {viewMode === 'overview' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Student Results</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => {
                    const percentage = getPercentage(result.correctAnswers, result.totalQuestions);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <FaUser className="text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {result.student?.fullName || 'Unknown Student'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {result.student?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result.score}/{test.questions.reduce((sum, q) => sum + (q.score || 1), 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.correctAnswers}/{result.totalQuestions} correct
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(result.timeSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedResult(result)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <FaEye className="mr-1" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Individual Result Modal */}
        {selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedResult.student?.fullName}'s Result
                  </h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Result Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedResult.score}/{test.questions.reduce((sum, q) => sum + (q.score || 1), 0)}
                    </p>
                    <p className="text-gray-600">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {getPercentage(selectedResult.correctAnswers, selectedResult.totalQuestions)}%
                    </p>
                    <p className="text-gray-600">Percentage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatTime(selectedResult.timeSpent)}
                    </p>
                    <p className="text-gray-600">Time Taken</p>
                  </div>
                </div>

                {/* Question-wise Results */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Question-wise Analysis</h4>
                  {selectedResult.detailedResults.map((item, index) => {
                    const question = test.questions.find(q => q._id === item.questionId);
                    return (
                      <div 
                        key={index} 
                        className={`border-l-4 p-4 rounded-lg ${
                          item.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {item.isCorrect ? (
                                <FaCheckCircle className="text-green-500 mr-2" />
                              ) : (
                                <FaTimesCircle className="text-red-500 mr-2" />
                              )}
                              <span className="font-semibold text-gray-700">
                                Question {index + 1}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-2">{question?.questionText}</p>
                            <div className="text-sm">
                              <p className="text-gray-600">
                                <span className="font-medium">Student's Answer:</span> 
                                <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                  {item.selectedAnswer || 'Not answered'}
                                </span>
                              </p>
                              {!item.isCorrect && (
                                <p className="text-gray-600">
                                  <span className="font-medium">Correct Answer:</span> 
                                  <span className="text-green-600">{item.correctAnswer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${
                              item.isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.score}/{question?.score || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestGradingInterface;
