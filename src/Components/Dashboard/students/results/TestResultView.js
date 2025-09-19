import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loading from '../../../Loading/Loading';
import Header from '../../../Navbar/header';
import { 
  FaTrophy, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartPie,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const TestResultView = () => {
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { resultId, id } = useParams();
  const actualResultId = resultId || id; // Support both old and new route parameters

  useEffect(() => {
    const fetchResult = async () => {
      try {
        axios.defaults.withCredentials = true;
        
        // Try to fetch from new enhanced test results API first
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/results/${actualResultId}`);
          setResult(response.data.data.result);
          console.log(response.data);
          
          // Fetch test details
          const testResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/${response.data.data.testId }`);
          setTest(testResponse.data.data);
        } catch (enhancedError) {
          // Fallback to chapter test results
          const chapterTestResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/chapter-tests/results/${actualResultId}`);
          const resultData = chapterTestResponse.data.data;
          
          // Transform chapter test result to match enhanced test result format
          setResult({
            _id: resultData._id,
            score: resultData.score,
            correctAnswers: resultData.correctAnswers || 0,
            totalQuestions: resultData.totalQuestions || 0,
            timeSpent: resultData.timeSpent || 0,
            submittedAt: resultData.submittedAt,
            detailedResults: resultData.answers?.map(answer => ({
              questionId: answer.questionId,
              selectedAnswer: answer.answer,
              correctAnswer: answer.correctAnswer,
              isCorrect: answer.isCorrect,
              score: answer.score || 0
            })) || []
          });
          
          // // Fetch chapter test details
          const testResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/chapter-tests/${actualResultId}`);
          setTest({
            _id: testResponse.data.data._id,
            name: testResponse.data.data.testName,
            questions: testResponse.data.data.questions || [],
            timeLimit: testResponse.data.data.timeDuration || 60,
            createdAt: testResponse.data.data.createdAt
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching result:', error);
        setLoading(false);
      }
    };

    fetchResult();
  }, [actualResultId]);

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
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (loading) return <Loading />;
  if (!result || !test) return <div>Result not found</div>;

  const percentage = getPercentage(result.correctAnswers, result.totalQuestions);
  const pieData = [
    { name: 'Correct', value: result.correctAnswers, color: '#10B981' },
    { name: 'Incorrect', value: result.totalQuestions - result.correctAnswers, color: '#EF4444' }
  ];

  // Difficulty analysis
  const difficultyAnalysis = result.detailedResults.reduce((acc, item) => {
    const question = test.questions.find(q => q._id === item.questionId);
    const difficulty = question?.difficultyLevel || 'Medium';
    
    if (!acc[difficulty]) {
      acc[difficulty] = { correct: 0, total: 0 };
    }
    acc[difficulty].total++;
    if (item.isCorrect) acc[difficulty].correct++;
    
    return acc;
  }, {});

  const difficultyChartData = Object.entries(difficultyAnalysis).map(([difficulty, data]) => ({
    difficulty,
    percentage: Math.round((data.correct / data.total) * 100),
    correct: data.correct,
    total: data.total
  }));

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{test.name}</h1>
              <p className="text-gray-600">Test completed on {new Date(result.submittedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <FaDownload className="mr-2" />
                Download Report
              </button>
              <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <FaShare className="mr-2" />
                Share Result
              </button>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaTrophy className={`text-4xl mx-auto mb-3 ${getGradeColor(percentage)}`} />
            <h3 className="text-lg font-semibold text-gray-700">Overall Score</h3>
            <p className={`text-3xl font-bold ${getGradeColor(percentage)}`}>
              {result.score}/{test.questions.reduce((sum, q) => sum + (q.score || 1), 0)}
            </p>
            <p className={`text-lg font-semibold ${getGradeColor(percentage)}`}>
              {percentage}% ({getGrade(percentage)})
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Correct Answers</h3>
            <p className="text-3xl font-bold text-green-600">{result.correctAnswers}</p>
            <p className="text-gray-500">out of {result.totalQuestions}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Incorrect Answers</h3>
            <p className="text-3xl font-bold text-red-600">
              {result.totalQuestions - result.correctAnswers}
            </p>
            <p className="text-gray-500">out of {result.totalQuestions}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FaClock className="text-4xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Time Taken</h3>
            <p className="text-2xl font-bold text-blue-600">{formatTime(result.timeSpent)}</p>
            <p className="text-gray-500">
              {test.timeLimit ? `of ${test.timeLimit} min` : ''}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartPie className="mr-2" />
              Score Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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
          </div>

          {/* Difficulty Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance by Difficulty</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={difficultyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="difficulty" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'percentage' ? `${value}%` : value,
                    name === 'percentage' ? 'Success Rate' : name
                  ]}
                />
                <Bar dataKey="percentage" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Question Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Question-wise Analysis</h3>
          <div className="space-y-4">
            {result.detailedResults.map((item, index) => {
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
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          question?.difficultyLevel === 'Hard' ? 'bg-red-100 text-red-800' :
                          question?.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {question?.difficultyLevel || 'Medium'}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-2">{question?.questionText}</p>
                      <div className="text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Your Answer:</span> 
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
                        {question?.explanation && (
                          <p className="text-gray-600 mt-2">
                            <span className="font-medium">Explanation:</span> {question.explanation}
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

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Link 
            to="/student/dashboard" 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link 
            to="/student/test" 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Take Another Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestResultView;
