import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';

const CreateTestForm = ({ standard, subject, onClose }) => {
  const [formData, setFormData] = useState({
    standard: standard || '',
    subject: subject || '',
    chapters: [],
    topics: [],
    questionsPerTopic: ''
  });
  const [loader,setLoader]=useState(false)
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]);

  const getSubjects = async (standardId) => {
    try {
      const response = await axios.get(`https://backend-pro-learning.vercel.app/api/subjects/standard/${standardId}`);
      return response.data.data.standards[0] ? response.data.data.standards[0].subjects : [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  };

  const getChapters = async (subjectId) => {
    try {
      const response = await axios.get(`https://backend-pro-learning.vercel.app/api/subjects/${subjectId}`);
      return response.data.data.chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  };

  const getTopics = async (chapterId) => {
    try {
      const response = await axios.get(`https://backend-pro-learning.vercel.app/api/chapters/${chapterId}`);
      return response.data.data.topics;
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  };

  useEffect(() => {
    if (formData.standard) {
      getSubjects(formData.standard).then(setSubjects);
    }
  }, [formData.standard]);

  useEffect(() => {
    if (formData.subject) {
      getChapters(formData.subject).then(setChapters);
    }
  }, [formData.subject]);

  useEffect(() => {
    const fetchTopics = async () => {
      const topics = [];
      for (const chapterId of formData.chapters) {
        const chapterTopics = await getTopics(chapterId);
        topics.push(...chapterTopics);
      }
      setAvailableTopics(topics);
    };

    if (formData.chapters.length > 0) {
      fetchTopics();
    }
  }, [formData.chapters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChapterSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      chapters: selectedOptions,
    });
  };

  const handleTopicSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      topics: selectedOptions,
    });
  };

  const handleSubmit = async (e) => {
    setLoader(true)
    e.preventDefault();
   
    const topicIdsArray = formData.topics.map(topic => topic.trim());

    try {
      axios.defaults.withCredentials = true;

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/auto/genrated`, {
        topicIds: topicIdsArray,
        questionsPerTopic: parseInt(formData.questionsPerTopic)
      });

      console.log('Questions retrieved successfully:', response.data);
      setLoader(false)
      if (onClose) onClose(response?.data?.data);

    } catch (error) {
      console.error('Error retrieving questions:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg space-y-4">
      <div className="flex flex-row justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generate the Question</h2>
        <IoClose size={32} onClick={() => onClose(false)} />
      </div>
  
      {/* Standard Dropdown */}
      <div>
        <label htmlFor="standard" className="block text-sm font-medium text-gray-700">Standard</label>
        <select
          name="standard"
          value={formData.standard}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
        >
          <option value="">Select Standard</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(standard => (
            <option key={standard} value={standard}>{standard}</option>
          ))}
        </select>
      </div>
  
      {/* Subject Dropdown */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
        >
          <option value="">Select Subject</option>
          {subjects.map(subject => (
            <option key={subject._id} value={subject._id}>{subject.name}</option>
          ))}
        </select>
      </div>
  
      {/* Chapters Multi-Select */}
      <div>
        <label htmlFor="chapters" className="block text-sm font-medium text-gray-700">Chapters</label>
        <select
          name="chapters"
          multiple
          value={formData.chapters}
          onChange={handleChapterSelection}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
        >
          {chapters.map(chapter => (
            <option key={chapter._id} value={chapter._id}>{chapter.name}</option>
          ))}
        </select>
      </div>
  
      {/* Topics Multi-Select */}
      <div>
        <label htmlFor="topics" className="block text-sm font-medium text-gray-700">Topics</label>
        <select
          name="topics"
          multiple
          value={formData.topics}
          onChange={handleTopicSelection}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
        >
          {availableTopics.map(topic => (
            <option key={topic._id} value={topic._id}>{topic.name}</option>
          ))}
        </select>
      </div>
  
      {/* Questions Per Topic */}
      <div>
        <label htmlFor="questionsPerTopic" className="block text-sm font-medium text-gray-700">Questions Per Topic</label>
        <input
          type="number"
          name="questionsPerTopic"
          value={formData.questionsPerTopic}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
          required
        />
      </div>
  
      <button
        type="submit"
        className="flex justify-center items-center bg-gray-800 text-white w-full p-2 rounded-md shadow-md hover:bg-gray-900 transition"
      >
        {loader ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          </>
        ) : (
          "Retrieve Questions"
        )}
      </button>
    </form>
  );
  
};

export default CreateTestForm;
