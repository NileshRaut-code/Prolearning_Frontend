import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaClock, 
  FaQuestionCircle, 
  FaFileAlt, 
  FaPlay,
  FaEye,
  FaSearch,
  FaFilter,
  FaStar,
  FaUsers,
  FaChartBar,
  FaBook,
  FaGraduationCap
} from 'react-icons/fa';

const TestBrowse = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [testType, setTestType] = useState('all'); // all, mcq, physical
  const [difficulty, setDifficulty] = useState('all'); // all, easy, medium, hard
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular, difficulty
  
  const userdata = useSelector(store => store.user.data);
  const standard = userdata?.standard || 10;

  useEffect(() => {
    fetchInitialData();
  }, [standard]);

  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter('');
    }
  }, [selectedSubject]);

  const fetchInitialData = async () => {
    try {
      axios.defaults.withCredentials = true;
      
      // Fetch subjects
      const subjectsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${standard}`);
      setSubjects(subjectsResponse.data.data.standards[0]?.subjects || []);
      
      // Fetch all tests (MCQ + Physical)
      const [mcqResponse, physicalResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/tests`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/standard/${standard}`)
      ]);
      
      const mcqTests = (mcqResponse.data.data || []).map(test => ({ ...test, type: 'mcq' }));
      const physicalTests = (physicalResponse.data.data || []).map(test => ({ ...test, type: 'physical' }));
      
      setTests([...mcqTests, ...physicalTests]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
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

  const hasUserTakenTest = (test) => {
    if (test.type === 'mcq') {
      return test.results?.some(result => result.student === userdata._id);
    }
    // For physical tests, you'd need to check submission status
    return false;
  };

  const getTestDifficulty = (test) => {
    if (test.type === 'physical') return 'Medium';
    
    // For MCQ tests, calculate average difficulty from questions
    if (test.questions && test.questions.length > 0) {
      const difficulties = test.questions.map(q => q.difficultyLevel || 'Medium');
      const counts = difficulties.reduce((acc, diff) => {
        acc[diff] = (acc[diff] || 0) + 1;
        return acc;
      }, {});
      
      // Return the most common difficulty
      return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }
    
    return 'Medium';
  };

  const getTestPopularity = (test) => {
    if (test.type === 'mcq') {
      return test.results?.length || 0;
    }
    return 0; // For physical tests, implement based on your data structure
  };

  const filterAndSortTests = () => {
    let filtered = tests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = testType === 'all' || test.type === testType;
      const matchesDifficulty = difficulty === 'all' || getTestDifficulty(test).toLowerCase() === difficulty;
      const matchesSubject = !selectedSubject || 
        (test.type === 'physical' ? test.subject === subjects.find(s => s._id === selectedSubject)?.name : true);
      
      return matchesSearch && matchesType && matchesDifficulty && matchesSubject;
    });

    // Sort tests
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return getTestPopularity(b) - getTestPopularity(a);
        case 'difficulty':
          const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return diffOrder[getTestDifficulty(a)] - diffOrder[getTestDifficulty(b)];
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <Loading />;

  const filteredTests = filterAndSortTests();

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Browse Tests</h1>
              <p className="text-gray-600">Discover and take tests to improve your knowledge</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Standard {standard}</p>
              <p className="text-lg font-semibold text-blue-600">
                {filteredTests.length} tests available
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>

            {/* Test Type Filter */}
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="mcq">MCQ Tests</option>
              <option value="physical">Physical Tests</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="difficulty">By Difficulty</option>
            </select>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            {['all', 'easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  difficulty === diff
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isTaken = hasUserTakenTest(test);
            const testDifficulty = getTestDifficulty(test);
            const popularity = getTestPopularity(test);
            
            return (
              <div key={`${test.type}-${test._id}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Test Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1 mr-2">
                      {test.name}
                    </h3>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        test.type === 'mcq' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {test.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(testDifficulty)}`}>
                        {testDifficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      {test.type === 'mcq' ? <FaQuestionCircle className="mr-1" /> : <FaFileAlt className="mr-1" />}
                      <span>{test.questions?.length || 0} questions</span>
                    </div>
                    {test.type === 'mcq' && (
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{test.timeLimit || 60} min</span>
                      </div>
                    )}
                    {popularity > 0 && (
                      <div className="flex items-center">
                        <FaUsers className="mr-1" />
                        <span>{popularity} taken</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {test.instructions || test.description || "Test your knowledge and skills with this comprehensive assessment."}
                    </p>
                  </div>

                  {/* Test Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Created {new Date(test.createdAt).toLocaleDateString()}</span>
                    {test.type === 'physical' && test.subject && (
                      <span className="flex items-center">
                        <FaBook className="mr-1" />
                        {test.subject}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar for taken tests */}
                  {isTaken && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Completed</span>
                        <span className="text-xs font-semibold text-green-600">✓</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {isTaken ? (
                      <>
                        <Link
                          to={test.type === 'mcq' 
                            ? `/student/test/result/view/${test._id}` 
                            : `/student/ptest/result/${test._id}`
                          }
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <FaEye className="mr-2" />
                          View Result
                        </Link>
                        <Link
                          to={test.type === 'mcq' 
                            ? `/student/test/enhanced/${test._id}` 
                            : `/student/physical-test-enhanced/${test._id}`
                          }
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          <FaPlay className="mr-2" />
                          Retake
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={test.type === 'mcq' 
                          ? `/student/test/enhanced/${test._id}` 
                          : `/student/physical-test-enhanced/${test._id}`
                        }
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaPlay className="mr-2" />
                        Start Test
                      </Link>
                    )}
                  </div>
                </div>

                {/* Test Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {test.score && (
                        <span className="text-xs text-gray-500">
                          Max Score: {test.score}
                        </span>
                      )}
                    </div>
                    {popularity > 0 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <FaStar className="mr-1 text-yellow-400" />
                        <span>Popular</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedSubject || testType !== 'all' || difficulty !== 'all'
                ? 'Try adjusting your search and filter criteria'
                : 'No tests are available for your standard yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('');
                setTestType('all');
                setDifficulty('all');
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/student/dashboard"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaChartBar className="text-2xl text-blue-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">View Dashboard</h4>
                <p className="text-sm text-gray-600">Check your overall progress</p>
              </div>
            </Link>
            
            <Link
              to="/student/performance"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaStar className="text-2xl text-green-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Performance</h4>
                <p className="text-sm text-gray-600">Analyze your results</p>
              </div>
            </Link>
            
            <Link
              to="/studymaterial"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FaBook className="text-2xl text-purple-500 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-800">Study Material</h4>
                <p className="text-sm text-gray-600">Access learning resources</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBrowse;
