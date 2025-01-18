import React, { useState } from 'react'
import Header from '../../Navbar/header.js'
import Subjects from './Subjects.js'
// import PieChart from './subcomponents/PieChart.js'

const Student = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(true)



  return (
    <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} px-4`} >
      <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
     
      <Subjects />

     
      {/* <div className='grid sm:grid-cols-3 p-2 space-x-4 grid-cols-1 m-8'>  */}


   


    </div>



  )
}

export default Student


