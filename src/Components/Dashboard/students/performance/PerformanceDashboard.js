import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaTrophy, FaChartLine, FaFileAlt, FaBrain, FaStar, FaExclamationTriangle
} from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/performance/`);
      setPerformanceData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Performance Dashboard</h1>
          <p className="text-gray-600">Track your academic progress</p>
        </div>

        {performanceData ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tests</p>
                    <p className="text-2xl font-bold">{performanceData.overview.totalTests}</p>
                  </div>
                  <FaFileAlt className="text-3xl text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold">{performanceData.overview.passRate}%</p>
                  </div>
                  <FaTrophy className="text-3xl text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">{performanceData.overview.averageScore}%</p>
                  </div>
                  <FaChartLine className="text-3xl text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Learning Plans</p>
                    <p className="text-2xl font-bold">{performanceData.learningPlanStats.completed}</p>
                  </div>
                  <FaBrain className="text-3xl text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaStar className="mr-2 text-yellow-500" />
                  Strengths
                </h2>
                
                {performanceData.strengths.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.strengths.map((strength, index) => (
                      <div key={index} className="flex justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">{strength.subject}</span>
                        <span className="text-green-600 font-bold">{strength.averageScore}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Take more tests to identify strengths</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FiTarget className="mr-2 text-red-500" />
                  Areas for Improvement
                </h2>
                
                {performanceData.weaknesses.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex justify-between p-3 bg-red-50 rounded-lg">
                        <span className="font-medium text-red-800">{weakness.subject}</span>
                        <span className="text-red-600 font-bold">{weakness.averageScore}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No weak areas identified</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <FaExclamationTriangle className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Performance Data</h3>
            <p className="text-gray-600">Take some tests to see your performance analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
