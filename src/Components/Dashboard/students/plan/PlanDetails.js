
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Loading from '../../../Loading/Loading'
import Header from '../../../Navbar/header'
import { Link } from 'react-router-dom'
const PlanDetails = () => {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/plan/${id}`)
      .then(res => setPlan(res.data))
      .catch(err => console.log(err))
  }, [id])

return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-100 min-h-screen`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      <div className='p-4'>
        {plan ? (
          <div className='bg-white shadow-md rounded-lg p-6'>
            {plan.recommendedTopics.map((rec, index) => (
              <div key={index} className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>{rec.topicName}</h1>
                <Link to={`/topic/${rec.topicId._id}`} className='text-blue-500 hover:underline'>Read Topic</Link>
                <button 
                  className='ml-4 text-blue-500 hover:underline' 
                  onClick={() => document.getElementById(`qna-${index}`).classList.toggle('hidden')}
                >
                  View Q&A
                </button>
                <div id={`qna-${index}`} className='hidden mt-4 bg-gray-50 p-4 rounded-lg'>
                  {rec.aiGeneratedQnA.map((qna, qnaIndex) => (
                    <div key={qnaIndex} className='mb-4'>
                      {/* <strong ></strong>  */}
                      <p className='text-gray-600'><strong className='text-gray-700 text-bold'>Q: {qnaIndex+1} </strong>{qna.question}</p>
                      {/* <strong className='block text-gray-700 mt-2'>A:</strong> 
                      <p className='text-gray-600'>{qna.answer}</p> */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>Loading...</p>
        )}
      </div>
    </div>
);
}

export default PlanDetails