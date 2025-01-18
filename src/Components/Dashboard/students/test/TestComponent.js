import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../../../Loading/Loading';

const TestComponent = () => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { testId } = useParams();
  const studentId = useSelector(store => store?.user?.data?._id);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        axios.defaults.withCredentials = true;

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/chapter-tests/${testId}`);
        setTest(response.data.data);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [testId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const answersArray = Object.keys(answers).map(questionId => ({
      questionId,
      answer: answers[questionId]
    }));

    const payload = {
      testId,
      studentId,
      answers: answersArray
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chapters/chapter-tests/results`, payload);
      console.log('Test submitted successfully:', response.data);
      navigate(`/student/test/result/${response.data.data._id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (!test) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{test.testName}</h2>
      {test.questions.map(question => (
        <div key={question._id} className="mb-6">
          <p className="text-lg font-medium text-gray-700 mb-2">{question.questionText}</p>
          <div className="space-y-2">
            {question.options.map(option => (
              <label key={option} className="flex items-center space-x-2 text-gray-700">
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  onChange={() => handleAnswerChange(question._id, option)}
                  className="form-radio text-gray-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Submit Test
      </button>
    </div>
  );
};

export default TestComponent;
