import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../../../Loading/Loading';
import { FaClock, FaQuestionCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const EnhancedTestComponent = () => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const navigate = useNavigate();
  const { testId } = useParams();
  const studentId = useSelector(store => store?.user?.data?._id);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && test) {
      // Auto-submit when time runs out
      handleSubmit(true);
    }
  }, [timeLeft, test]);

  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/${testId}`);
        const testData = response.data.data;
        setTest(testData);
        setTimeLeft(testData.timeLimit * 60 || 3600); // Convert minutes to seconds, default 1 hour
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [testId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && Object.keys(answers).length < test.questions.length) {
      const unanswered = test.questions.length - Object.keys(answers).length;
      if (!window.confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setIsSubmitting(true);

    const answersArray = test.questions.map(question => ({
      questionId: question._id,
      selectedAnswer: answers[question._id] || ''
    }));

    const payload = {
      answers: answersArray,
      timeSpent: (test.timeLimit * 60) - timeLeft
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tests/${testId}/submit`, 
        payload
      );
      console.log('Test submitted successfully:', response.data);
      navigate(`/student/test/result/${response.data.data._id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!test) {
    return <Loading />;
  }

  const currentQ = test.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{test.name || 'Test'}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {test.questions.length}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-blue-600">
                <FaClock className="mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-2" />
                <span>{getAnsweredCount()}/{test.questions.length} Answered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaQuestionCircle className="text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentQ.questionText}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <label 
                    key={index} 
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[currentQ._id] === option 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQ._id}
                      value={option}
                      checked={answers[currentQ._id] === option}
                      onChange={() => handleAnswerChange(currentQ._id, option)}
                      className="form-radio text-blue-600 mr-3"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestion === test.questions.length - 1}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigator & Submit Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigator</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {test.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      index === currentQuestion
                        ? 'bg-blue-500 text-white'
                        : answers[test.questions[index]._id]
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  <span>Not Answered</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Submit Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Submission</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your test? You have answered {getAnsweredCount()} out of {test.questions.length} questions.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmSubmit(false);
                    handleSubmit();
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTestComponent;
