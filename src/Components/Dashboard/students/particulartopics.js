import React, { useEffect, useState } from 'react';
import Header from '../../Navbar/header';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowBack } from "react-icons/io";
import Loading from '../../Loading/Loading';
import Suggestion from './Suggestion.js';

const Particulartopics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/topics/${id}`)
      .then(res => {
        setData(res.data.data);
      })
      .catch(err => console.log(err));
  }, [id, navigate]);

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />

      <div className='p-6 '>
        {/* Back Button and Title */}
        <div className="flex flex-row items-center mb-6">
          <button className='px-2' onClick={() => { navigate(-1) }}>
            <IoIosArrowBack color='#1f2937' />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">{data && data?.name}</h1>
        </div>

        {/* Main Content */}
        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section: Topic Details */}
            <div className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
              <div className='border-4 border-gray-200 rounded-xl p-4'>
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">Standard:</span> {data?.subject?.standard}
                </div>
                <div className="mb-4 text-gray-700">
                  <span className="font-semibold">Chapter:</span> {data?.chapter?.name}
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">Subject:</span> <Link to={`/subject/${data?.subject?._id}`} className="text-blue-600 hover:underline">{data?.subject?.name}</Link>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">Topic Level:</span> {data?.topic_level}
                </div>
              </div>  

              <div className='border-4 border-gray-200 rounded-xl p-4 mt-4'>
                <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: data?.description }}></div>
              </div>

              {/* Questions Section */}
              <div className='border-4 border-gray-200 rounded-xl p-4 mt-4'>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions</h2>
                <ul className="list-disc list-inside text-gray-700 px-4">
                  {data?.questions.map((question) => (
                    <li key={question._id}>{question.questionText}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section: Related Topics & Suggestions */}
            <div className="space-y-6">
              {/* Related Topics Section */}
              <div className="border-4 border-gray-200 rounded-xl p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Topics</h2>
                <ul className="list-disc list-inside text-gray-700 px-4">
                  {data?.RelatedTopic.map((topic) => (
                    <li key={topic._id}>
                      <a href={`/topic/${topic._id}`} className="text-blue-600 hover:underline">{topic.name}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions Section */}
              <div className='border-4 border-gray-200 rounded-xl p-4'>
                <div className="max-h-[90vh] overflow-y-scroll">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggestions</h2>
                  <Suggestion topicId={id} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Particulartopics;
