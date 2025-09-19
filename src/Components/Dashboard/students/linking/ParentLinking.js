import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../../../Navbar/header';
import Loading from '../../../Loading/Loading';
import { 
  FaUserPlus,
  FaUsers,
  FaKey,
  FaCheck,
  FaExclamationTriangle,
  FaCopy,
  FaTrash,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { IoIosRefresh } from 'react-icons/io';

const ParentLinking = () => {
  const [linkingCode, setLinkingCode] = useState('');
  const [linkedParents, setLinkedParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const userData = useSelector(store => store.user.data);

  useEffect(() => {
    fetchLinkedParents();
  }, []);

  const fetchLinkedParents = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/parent-link/parents`);
      setLinkedParents(response.data.data.parents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching linked parents:', error);
      setLinkedParents([]);
      setLoading(false);
    }
  };

  const generateLinkingCode = async () => {
    try {
      setGenerating(true);
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/parent-link/generate-code`);
      setLinkingCode(response.data.data.linkingCode);
      setShowCode(true);
      setMessage({ type: 'success', text: 'Linking code generated successfully!' });
      setGenerating(false);
    } catch (error) {
      console.error('Error generating linking code:', error);
      setMessage({ type: 'error', text: 'Failed to generate linking code' });
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkingCode);
    setMessage({ type: 'success', text: 'Code copied to clipboard!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const toggleCodeVisibility = () => {
    setShowCode(!showCode);
  };

  if (loading) return <Loading />;

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Parent Linking</h1>
          <p className="text-gray-600">Connect with your parents to share your academic progress</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? <FaCheck className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
              {message.text}
            </div>
          </div>
        )}

        {/* Generate Linking Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaKey className="mr-3 text-blue-500" />
            Generate Linking Code
          </h2>
          
          <p className="text-gray-600 mb-4">
            Generate a unique code that your parents can use to link their account with yours. 
            This will allow them to view your academic progress and performance.
          </p>

          {!linkingCode ? (
            <button
              onClick={generateLinkingCode}
              disabled={generating}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <FaUserPlus className="mr-2" />
              )}
              {generating ? 'Generating...' : 'Generate Linking Code'}
            </button>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Your Linking Code:</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleCodeVisibility}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title={showCode ? 'Hide code' : 'Show code'}
                  >
                    {showCode ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
              
              <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                <div className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
                  {showCode ? linkingCode : '••••••'}
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <p>• Share this code with your parents</p>
                <p>• Code expires in 24 hours</p>
                <p>• Generate a new code if needed</p>
              </div>

              <button
                onClick={() => {
                  setLinkingCode('');
                  setShowCode(false);
                }}
                className="mt-3 inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <IoIosRefresh className="mr-2" />
                Generate New Code
              </button>
            </div>
          )}
        </div>

        {/* Linked Parents Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaUsers className="mr-3 text-green-500" />
            Linked Parents ({linkedParents.length})
          </h2>

          {linkedParents.length === 0 ? (
            <div className="text-center py-8">
              <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Parents Linked</h3>
              <p className="text-gray-600 mb-4">
                Generate a linking code above and share it with your parents to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedParents.map((parent) => (
                <div key={parent._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {parent.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{parent.fullName}</h3>
                        <p className="text-gray-600">{parent.email}</p>
                        <p className="text-sm text-gray-500">Phone: {parent.phoneno}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <FaCheck className="inline mr-1" />
                        Linked
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Linked on: {new Date(parent.createdAt).toLocaleDateString()}</p>
                    <p>Your parent can now view your academic progress and performance data.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How Parent Linking Works</h3>
          <div className="space-y-2 text-blue-700">
            <p>1. <strong>Generate Code:</strong> Click the button above to create a unique linking code</p>
            <p>2. <strong>Share Code:</strong> Give this code to your parent(s)</p>
            <p>3. <strong>Parent Links:</strong> Your parent uses the code in their parent dashboard</p>
            <p>4. <strong>Access Granted:</strong> Your parent can now view your academic progress</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Note:</strong> Your parents will only be able to view your academic performance, 
              test results, and learning progress. Personal account settings remain private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLinking;
