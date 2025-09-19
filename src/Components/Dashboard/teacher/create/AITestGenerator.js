import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../Navbar/header';
import { useSelector } from 'react-redux';
import { FaRobot, FaCog, FaEye, FaSave, FaPlus, FaMinus } from 'react-icons/fa';
import Loading from '../../../Loading/Loading';

const AITestGenerator = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [generatedTest, setGeneratedTest] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const teacherId = useSelector(store => store.user.data._id);

  const [formData, setFormData] = useState({
    testName: '',
    standard: '',
    subject: '',
    selectedTopics: [],
    questionsPerTopic: 2,
    timeLimit: 60,
    difficultyDistribution: {
      Easy: 40,
      Medium: 40,
      Hard: 20
    },
    instructions: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch subjects when standard changes
  useEffect(() => {
    if (formData.standard) {
      fetchSubjects(formData.standard);
    }
  }, [formData.standard]);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (formData.subject) {
      fetchChapters(formData.subject);
    }
  }, [formData.subject]);

  const fetchSubjects = async (standardId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${standardId}`);
      setSubjects(response.data.data.standards[0]?.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/${subjectId}`);
      setChapters(response.data.data.chapters || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchTopics = async (chapterId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/${chapterId}`);
      return response.data.data.topics || [];
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  };

  const handleChapterSelect = async (chapterId, isSelected) => {
    if (isSelected) {
      const chapterTopics = await fetchTopics(chapterId);
      setTopics(prev => [...prev, ...chapterTopics.map(topic => ({ ...topic, chapterId }))]);
    } else {
      setTopics(prev => prev.filter(topic => topic.chapterId !== chapterId));
      setFormData(prev => ({
        ...prev,
        selectedTopics: prev.selectedTopics.filter(topicId => 
          !topics.find(topic => topic._id === topicId && topic.chapterId === chapterId)
        )
      }));
    }
  };

  const handleTopicSelect = (topicId, isSelected) => {
    setFormData(prev => ({
      ...prev,
      selectedTopics: isSelected 
        ? [...prev.selectedTopics, topicId]
        : prev.selectedTopics.filter(id => id !== topicId)
    }));
  };

  const handleDifficultyChange = (difficulty, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setFormData(prev => ({
      ...prev,
      difficultyDistribution: {
        ...prev.difficultyDistribution,
        [difficulty]: newValue
      }
    }));
  };

  const generateTest = async () => {
    if (!formData.testName || !formData.standard || !formData.subject || formData.selectedTopics.length === 0) {
      setError('Please fill in all required fields and select at least one topic.');
      return;
    }

    const totalPercentage = Object.values(formData.difficultyDistribution).reduce((sum, val) => sum + val, 0);
    if (totalPercentage !== 100) {
      setError('Difficulty distribution must total 100%');
      return;
    }

    setLoading(true);
    setError('');

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/generate-test`, {
        standard: formData.standard,
        subject: formData.subject,
        topics: formData.selectedTopics,
        questionsPerTopic: formData.questionsPerTopic,
        difficultyDistribution: formData.difficultyDistribution,
        testName: formData.testName,
        timeLimit: formData.timeLimit
      });

      setGeneratedTest(response.data.data);
      setPreviewMode(true);
      setSuccess('Test generated successfully!');
    } catch (error) {
      console.error('Error generating test:', error);
      setError('Failed to generate test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveTest = async () => {
    if (!generatedTest) return;

    setLoading(true);
    try {
      // First, create questions in the database
      const questionIds = [];
      for (const question of generatedTest.questions) {
        const questionResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/questions`, {
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficultyLevel: question.difficultyLevel,
          score: question.score,
          explanation: question.explanation,
          tags: question.tags,
          topicId: question.topicId
        });
        questionIds.push(questionResponse.data.data._id);
      }

      // Then create the test
      const testResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/tests`, {
        name: generatedTest.testName,
        questions: questionIds,
        timeLimit: generatedTest.timeLimit,
        instructions: formData.instructions,
        createdBy: teacherId
      });

      setSuccess('Test saved successfully!');
      setTimeout(() => {
        setPreviewMode(false);
        setGeneratedTest(null);
        setFormData({
          testName: '',
          standard: '',
          subject: '',
          selectedTopics: [],
          questionsPerTopic: 2,
          timeLimit: 60,
          difficultyDistribution: { Easy: 40, Medium: 40, Hard: 20 },
          instructions: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error saving test:', error);
      setError('Failed to save test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (previewMode && generatedTest) {
    return (
      <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
        <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
        
        <div className="p-6 max-w-6xl mx-auto">
          {/* Preview Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{generatedTest.testName}</h1>
                <p className="text-gray-600">
                  {generatedTest.totalQuestions} questions • {generatedTest.timeLimit} minutes
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Edit Test
                </button>
                <button
                  onClick={saveTest}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Test'}
                </button>
              </div>
            </div>
          </div>

          {/* Questions Preview */}
          <div className="space-y-6">
            {generatedTest.questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {index + 1}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.difficultyLevel === 'Hard' ? 'bg-red-100 text-red-800' :
                      question.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {question.difficultyLevel}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {question.score} points
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4">{question.questionText}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-3 border rounded-lg ${
                        option === question.correctAnswer 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span> {option}
                      {option === question.correctAnswer && (
                        <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {success && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <FaRobot className="text-4xl text-blue-500 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Test Generator</h1>
              <p className="text-gray-600">Create comprehensive tests using AI technology</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Name *
              </label>
              <input
                type="text"
                value={formData.testName}
                onChange={(e) => setFormData(prev => ({ ...prev, testName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter test name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 60 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          {/* Standard and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard *
              </label>
              <select
                value={formData.standard}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  standard: e.target.value,
                  subject: '',
                  selectedTopics: []
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Standard</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(standard => (
                  <option key={standard} value={standard}>{standard}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  subject: e.target.value,
                  selectedTopics: []
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!formData.standard}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter and Topic Selection */}
          {formData.subject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Chapters and Topics *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {chapters.map(chapter => (
                  <div key={chapter._id} className="mb-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`chapter-${chapter._id}`}
                        onChange={(e) => handleChapterSelect(chapter._id, e.target.checked)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`chapter-${chapter._id}`}
                        className="font-medium text-gray-800"
                      >
                        {chapter.name}
                      </label>
                    </div>
                    <div className="ml-6 space-y-1">
                      {topics
                        .filter(topic => topic.chapterId === chapter._id)
                        .map(topic => (
                          <div key={topic._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`topic-${topic._id}`}
                              checked={formData.selectedTopics.includes(topic._id)}
                              onChange={(e) => handleTopicSelect(topic._id, e.target.checked)}
                              className="mr-2"
                            />
                            <label 
                              htmlFor={`topic-${topic._id}`}
                              className="text-gray-600"
                            >
                              {topic.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions per Topic
              </label>
              <input
                type="number"
                value={formData.questionsPerTopic}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  questionsPerTopic: parseInt(e.target.value) || 1 
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Questions
              </label>
              <input
                type="text"
                value={formData.selectedTopics.length * formData.questionsPerTopic}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Distribution (%)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(formData.difficultyDistribution).map(([difficulty, percentage]) => (
                <div key={difficulty}>
                  <label className="block text-sm text-gray-600 mb-1">{difficulty}</label>
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => handleDifficultyChange(difficulty, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Total: {Object.values(formData.difficultyDistribution).reduce((sum, val) => sum + val, 0)}%
            </p>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Instructions (Optional)
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter test instructions for students..."
            />
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={generateTest}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-lg font-semibold"
            >
              <FaRobot className="mr-2" />
              {loading ? 'Generating Test...' : 'Generate Test with AI'}
            </button>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <Loading />
              <p className="text-center mt-4 text-gray-700">Generating your test with AI...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITestGenerator;
