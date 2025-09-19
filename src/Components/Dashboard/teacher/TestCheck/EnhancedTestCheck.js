import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaArrowLeft,
  FaUser,
  FaFileAlt,
  FaCalendarAlt,
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaStar,
  FaClipboardList,
  FaLightbulb,
  FaGraduationCap
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EnhancedTestCheck = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // answerCopyId
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [data, setData] = useState(null);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [grade, setGrade] = useState('Not graded');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissionData();
  }, [id]);

  const fetchSubmissionData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies/${id}`
      );
      const submissionData = response.data.data;
      setData(submissionData);
      
      // Pre-fill existing scores if already graded
      if (submissionData.grade !== 'Not graded') {
        setFeedback(submissionData.feedback || '');
        setGrade(submissionData.grade);
        setTotalScore(submissionData.score);
        setRecommendations(submissionData.recommendations || []);
        
        // Initialize responses with existing scores
        const existingResponses = {};
        submissionData.recommendations?.forEach(rec => {
          existingResponses[rec.questionId] = rec.score || 0;
        });
        setResponses(existingResponses);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submission data:', error);
      setError('Failed to load submission data');
      setLoading(false);
    }
  };

  const handleScoreChange = (questionId, value) => {
    const question = data.test.questions.find(q => q._id === questionId);
    const clampedValue = Math.max(0, Math.min(value, question.score));
    
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: clampedValue
    }));
    
    updateRecommendations(questionId, clampedValue, question);
  };

  const updateRecommendations = (questionId, score, question) => {
    setRecommendations(prevRecommendations => {
      const filtered = prevRecommendations.filter(rec => rec.questionId !== questionId);
      
      // Add to recommendations if score is less than full marks
      if (score < question.score) {
        return [...filtered, {
          questionId: question._id,
          topicId: question.topicId,
          score: score
        }];
      }
      
      return filtered;
    });
  };

  const handleMarkAsRight = (questionId) => {
    const question = data.test.questions.find(q => q._id === questionId);
    handleScoreChange(questionId, question.score);
  };

  const handleMarkAsWrong = (questionId) => {
    handleScoreChange(questionId, 0);
  };

  const calculateGradeAndTotal = () => {
    let newTotalScore = 0;
    const totalPossibleScore = data.test.questions.reduce(
      (acc, question) => acc + question.score,
      0
    );

    data.test.questions.forEach(question => {
      const userScore = responses[question._id] || 0;
      newTotalScore += userScore;
    });

    const percentage = (newTotalScore / totalPossibleScore) * 100;
    let newGrade = 'F';
    
    if (percentage >= 90) newGrade = 'A+';
    else if (percentage >= 80) newGrade = 'A';
    else if (percentage >= 70) newGrade = 'B+';
    else if (percentage >= 60) newGrade = 'B';
    else if (percentage >= 50) newGrade = 'C';
    else if (percentage >= 40) newGrade = 'D';

    setTotalScore(newTotalScore);
    setGrade(newGrade);
    
    return { newTotalScore, percentage, newGrade };
  };

  const handleSubmit = async () => {
    const { newTotalScore, newGrade } = calculateGradeAndTotal();
    
    setSubmitting(true);
    setError('');

    const body = {
      answerCopyId: data._id,
      score: newTotalScore,
      recommendations,
      feedback: feedback || '',
      grade: newGrade
    };

    try {
      axios.defaults.withCredentials = true;
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies/grade`,
        body
      );
      
      setSuccess('Successfully graded the submission!');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error('Error submitting grade:', error);
      setError('Failed to submit grade. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'B+': 'text-blue-600',
      'B': 'text-blue-600',
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
          Pending Grade
        </span>
      );
    }
  };

  const getScoreDistribution = () => {
    const totalPossible = data?.test.questions.reduce((acc, q) => acc + q.score, 0) || 100;
    const currentTotal = Object.values(responses).reduce((acc, score) => acc + (score || 0), 0);
    
    return [
      { name: 'Scored', value: currentTotal, color: '#10B981' },
      { name: 'Lost', value: totalPossible - currentTotal, color: '#EF4444' }
    ];
  };

  if (loading) return <Loading />;

  if (!data) {
    return (
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Not Found</h2>
            <p className="text-gray-600 mb-4">The test submission you're looking for could not be found.</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { test, pdfPath, student } = data;
  const totalPossibleScore = test.questions.reduce((acc, question) => acc + question.score, 0);
  const currentPercentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;

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
            <h1 className="text-2xl font-bold text-gray-800">Grade Submission</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusBadge(data.status, data.isPassed)}
            <span className="text-sm text-gray-600">
              Attempt {data.attempts} of {data.maxAttempts}
            </span>
          </div>
        </div>

        {/* Student & Test Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-3 text-blue-500" />
                  <span className="font-medium">{student.fullName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaGraduationCap className="mr-3 text-purple-500" />
                  <span>Standard: {test.standard}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-3 text-orange-500" />
                  <span>Submitted: {new Date(data.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Test Information</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaFileAlt className="mr-3 text-green-500" />
                  <span className="font-medium">{test.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClipboardList className="mr-3 text-indigo-500" />
                  <span>Subject: {test.subject}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaTrophy className="mr-3 text-yellow-500" />
                  <span>Total Marks: {totalPossibleScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Answer Sheet</h3>
                <div className="flex space-x-2">
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaEye className="mr-2" />
                    View Full Screen
                  </a>
                  <a
                    href={pdfPath}
                    download
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </a>
                </div>
              </div>
              
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={pdfPath.startsWith('http://') ? pdfPath.replace('http://', 'https://') : pdfPath}
                  title="Answer Sheet PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>

          {/* Grading Panel */}
          <div className="space-y-6">
            {/* Current Score Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Overview</h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2">
                  <span className={getGradeColor(grade)}>{totalScore}</span>
                  <span className="text-gray-400">/{totalPossibleScore}</span>
                </div>
                <div className="text-2xl font-semibold mb-2">
                  <span className={getGradeColor(grade)}>{currentPercentage}%</span>
                </div>
                <div className={`text-lg font-medium ${getGradeColor(grade)}`}>
                  Grade: {grade}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={getScoreDistribution()}
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    dataKey="value"
                  >
                    {getScoreDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Questions Grading */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Questions</h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {test.questions.map((question, index) => (
                  <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="font-medium text-gray-800 mb-2">
                        Q{index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Max Score: {question.score} marks
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={0}
                        max={question.score}
                        value={responses[question._id] || 0}
                        onChange={(e) => handleScoreChange(question._id, parseInt(e.target.value, 10) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                        placeholder="Score"
                      />
                      <button
                        onClick={() => handleMarkAsRight(question._id)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Mark as Correct"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => handleMarkAsWrong(question._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Mark as Incorrect"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FaLightbulb className="inline mr-2 text-yellow-500" />
                Feedback & Comments
              </h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback to help the student improve..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Recommendations Preview */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <FaStar className="inline mr-2 text-purple-500" />
                  Improvement Areas
                </h3>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800">
                        Question {test.questions.findIndex(q => q._id === rec.questionId) + 1}
                      </p>
                      <p className="text-xs text-gray-600">
                        Scored: {rec.score}/{test.questions.find(q => q._id === rec.questionId)?.score} marks
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Grade...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Submit Grade
                  </>
                )}
              </button>
              
              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTestCheck;
