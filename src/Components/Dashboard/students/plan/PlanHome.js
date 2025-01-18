import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Loading from '../../../Loading/Loading'
import Header from '../../../Navbar/header'
import { Link } from 'react-router-dom'

const PlanHome = () => {
  const studentId = useSelector(store => store.user.data._id)
  const [plans, setPlans] = useState(null)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/plan/student/${studentId}`)
      .then(res => setPlans(res.data))
      .catch(err => console.log(err))
  }, [studentId])

  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
      <div className='p-2'>
        <h1 className='text-2xl font-bold mb-4'>Learning Plans</h1>
        {plans ? (
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {plans.map((plan,index) => (
              <div key={plan._id} className='border rounded-lg p-4 shadow-lg'>
                <h2 className='text-xl font-semibold mb-2'>Learning plan no :{index+1}</h2>
                {/* <p className='mb-2'>{plan.recommendedTopics[0].topicId.description}</p> */}
                <Link to={`/STUDENT/plan/${plan._id}`} className='text-blue-500 hover:underline'>View Details</Link>
              </div>
            ))}
          </div>
        ) : <Loading />}
      </div>
    
    </div>
  )
}

export default PlanHome