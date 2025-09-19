import React, { useState, useEffect } from 'react';
import Header from '../../../../Navbar/header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loading from '../../../../Loading/Loading';
import { 
  FaArrowLeft, 
  FaDownload, 
  FaUpload, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaClock,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaTrophy,
  FaRedo,
  FaEye
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const EnhancedPhysicalTest = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [testData, setTestData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const userData = useSelector((store) => store.user.data);

  useEffect(() => {
    fetchTestData();
    checkSubmissionStatus();
  }, [id]);

  const fetchTestData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/${id}`
      );
      setTestData(response.data.data);
    } catch (error) {
      console.error('Error fetching test data:', error);
      setError('Failed to load test data');
    }
  };

  const checkSubmissionStatus = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/already_check/${id}`
      );
      setSubmissionStatus(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking submission status:', error);
      setSubmissionStatus(null);
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text(`${testData.name}`, 20, 20);
    
    // Test Info
    doc.setFontSize(12);
    doc.text(`Teacher: ${testData.teacher.fullName}`, 20, 35);
    doc.text(`Subject: ${testData.subject}`, 20, 45);
    doc.text(`Standard: ${testData.standard}`, 20, 55);
    doc.text(`Total Marks: ${testData.score}`, 20, 65);
    doc.text(`Due Date: ${new Date(testData.dueDate).toLocaleDateString()}`, 20, 75);
    
    // Line separator
    doc.line(10, 85, 200, 85);
    
    // Instructions
    doc.setFontSize(14);
    doc.text('Instructions:', 20, 95);
    doc.setFontSize(10);
    doc.text('1. Answer all questions clearly and legibly', 20, 105);
    doc.text('2. Show all working steps for numerical problems', 20, 115);
    doc.text('3. Upload your completed answer sheet as PDF', 20, 125);
    doc.text('4. Ensure all pages are clearly visible', 20, 135);
    
    // Questions
    doc.setFontSize(14);
    doc.text('Questions:', 20, 150);
    
    let yPosition = 160;
    testData.questions.forEach((item, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`Q${index + 1}: ${item.question}`, 20, yPosition);
      doc.setFontSize(10);
      doc.text(`[${item.score} marks]`, 20, yPosition + 10);
      doc.text(`Difficulty: ${item.difficultyLevel || 'Medium'}`, 150, yPosition + 10);
      
      yPosition += 25;
    });

    doc.save(`${testData.name}_Question_Paper.pdf`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setPdfFile(null);
    }
  };

  const submitTest = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file to upload');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('studentId', userData._id);
    formData.append('teacherId', testData.teacher._id);
    formData.append('testId', id);
    formData.append('pdf', pdfFile);

    try {
      axios.defaults.withCredentials = true;
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setSuccess('Test submitted successfully!');
      setTimeout(() => {
        navigate('/student/physical-test');
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit test');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      submitted: { color: 'bg-blue-100 text-blue-800', icon: FaClock, text: 'Submitted - Awaiting Grade' },
      resubmitted: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Resubmitted - Awaiting Grade' },
      graded: { color: 'bg-purple-100 text-purple-800', icon: FaFileAlt, text: 'Graded' },
      passed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Failed' }
    };
    
    const badge = badges[status] || badges.submitted;
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <IconComponent className="mr-2" />
        {badge.text}
      </span>
    );
  };

  const canTakeTest = () => {
    if (!submissionStatus) return true; // No submission yet
    return submissionStatus.canRetry; // Can retry if failed and attempts remaining
  };

  const showResults = () => {
    return submissionStatus && (submissionStatus.status === 'graded' || submissionStatus.status === 'passed' || submissionStatus.status === 'failed');
  };

  if (loading) return <Loading />;

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Physical Test</h1>
        </div>

        {testData && (
          <>
            {/* Test Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{testData.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      <span>Teacher: {testData.teacher.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <FaFileAlt className="mr-2 text-green-500" />
                      <span>Subject: {testData.subject}</span>
                    </div>
                    <div className="flex items-center">
                      <FaTrophy className="mr-2 text-yellow-500" />
                      <span>Total Marks: {testData.score}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-500" />
                      <span>Due: {new Date(testData.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {submissionStatus && (
                  <div className="text-right">
                    {getStatusBadge(submissionStatus.status)}
                    {submissionStatus.attempts > 1 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Attempt {submissionStatus.attempts} of {submissionStatus.maxAttempts}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submission Status Info */}
              {submissionStatus && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Submission Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Score: </span>
                      <span className={submissionStatus.isPassed ? 'text-green-600' : 'text-red-600'}>
                        {submissionStatus.score}/{testData.score} ({Math.round((submissionStatus.score/testData.score)*100)}%)
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Grade: </span>
                      <span>{submissionStatus.grade}</span>
                    </div>
                    <div>
                      <span className="font-medium">Remaining Attempts: </span>
                      <span>{submissionStatus.remainingAttempts}</span>
                    </div>
                  </div>
                  
                  {submissionStatus.feedback && (
                    <div className="mt-3">
                      <span className="font-medium">Feedback: </span>
                      <p className="text-gray-700 mt-1">{submissionStatus.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaDownload className="mr-2" />
                Download Question Paper
              </button>
              
              {showResults() && (
                <Link
                  to={`/student/ptest/result/${submissionStatus._id}`}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaEye className="mr-2" />
                  View Results
                </Link>
              )}
              
              {submissionStatus && submissionStatus.canRetry && (
                <div className="flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-lg">
                  <FaRedo className="mr-2" />
                  <span className="text-sm">You can retry this test</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Questions Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Questions</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {testData.questions.map((question, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <p className="text-gray-700 flex-1">
                          <span className="font-semibold">Q{index + 1}:</span> {question.question}
                        </p>
                        <div className="ml-4 text-right">
                          <span className="text-sm font-medium text-blue-600">{question.score} marks</span>
                          {question.difficultyLevel && (
                            <div className={`text-xs px-2 py-1 rounded mt-1 ${
                              question.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                              question.difficultyLevel === 'Hard' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {question.difficultyLevel}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              {canTakeTest() ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {submissionStatus ? 'Resubmit Answer Sheet' : 'Submit Answer Sheet'}
                  </h3>
                  
                  {submissionStatus && !submissionStatus.isPassed && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <FaExclamationTriangle className="text-yellow-600 mr-2" />
                        <span className="text-yellow-800 font-medium">
                          Previous attempt: {submissionStatus.score}/{testData.score} marks
                        </span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1">
                        You have {submissionStatus.remainingAttempts} attempt(s) remaining
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to select PDF file</p>
                        <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                      </label>
                      
                      {pdfFile && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 font-medium">{pdfFile.name}</p>
                          <p className="text-green-600 text-sm">
                            Size: {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={submitTest}
                      disabled={!pdfFile || uploading}
                      className="w-full flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="mr-2" />
                          {submissionStatus ? 'Resubmit Test' : 'Submit Test'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Test Completed</h3>
                  
                  {submissionStatus?.isPassed ? (
                    <div className="text-center py-8">
                      <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-green-800 mb-2">Congratulations!</h4>
                      <p className="text-green-700">You have successfully passed this test.</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Score: {submissionStatus.score}/{testData.score} ({Math.round((submissionStatus.score/testData.score)*100)}%)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-red-800 mb-2">Maximum Attempts Reached</h4>
                      <p className="text-red-700">You have used all available attempts for this test.</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Best Score: {submissionStatus.score}/{testData.score} ({Math.round((submissionStatus.score/testData.score)*100)}%)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedPhysicalTest;
