import React ,{useState} from 'react'

import Community from './subcomponents/Community.js'
import { RiEdit2Fill } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Calender from 'react-simple-calender';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

export const Studentph = () => {
    const data = [
        { name: 'Geeksforgeeks', students: 400 },
        { name: 'Technical scripter', students: 700 },
        { name: 'Geek-i-knack', students: 200 },
        { name: 'Geek-o-mania', students: 1000 }
      ];
    
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
      const onPieEnter = (_, index) => {
        setActiveIndex(index);
      };
      const [date, setDate] = useState(new Date());
      const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div className='grid sm:grid-cols-3 p-2 space-x-8 grid-cols-1 m-8 '>
    <div className='p-2 border rounded-xl shadow-xl '><Community /></div>
    <div className='p-2 border rounded-xl shadow-sm '>
      <h2 className="mr-10 pl-8 text-2xl font-bold mt-4 text-gray-800">Monthly Performance Bar</h2>
      <div className='flex justify-center items-center'><PieChart width={300} height={350}>
        <Pie
          activeIndex={activeIndex}
          data={data}
          dataKey="students"
          outerRadius={150}
          fill="green"
          onMouseEnter={onPieEnter}
          style={{ cursor: 'pointer', outline: 'none' }} // Ensure no outline on focus
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <div className='flex flex-col'>
      <div className='flex flex-row items-center'>
        <div className='flex flex-row p-2'><FaCircle color="#FFEBE0"/><p>Best Scoring Subject</p></div>
          </div>
            <p>Less Scoring Subject</p>
        </div>
      </div>
      {/*           
      <PieChart /> */}
    </div>
    <div className='flex justify-center pt-6 border rounded-xl shadow-xl'>
      <h2 className=" mr-10 pl-8 text-2xl font-bold text-gray-800">Schedule Planner</h2>
      <div className='rounded-xl p-4 shadow-xl'>
      <Calender
        preselectedDates={[
          '2024-03-20',
          '2024-03-23'
        ]}
        disabledDates={[
          '2024-03-28',
          '2024-03-29',
          '2024-04-2'
        ]}
        multiselect={false}
        onChange={(params) => { setDate(params.date); console.log(JSON.stringify(params)) }}
        titleFormat={'MMMM YYYY'}
        daysFormat={2}

      />
        </div>

      <div className='flex flex-row items-center'>
        <button className='flex flex-row bg-[#FFEBE0] p-2 m-2 rounded-xl gap-2'>
          <RiEdit2Fill size={25} /> Edit Schedule
        </button>
        <button className='flex flex-row bg-[#FF725E] p-2 m-2 rounded-xl gap-2'>
          <FaPlus size={22} color='white' /> Edit Schedule
        </button></div>

    </div>

  </div>
  )
}
