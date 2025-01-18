import React,{Usestate} from 'react';
import Calender from 'react-simple-calender';


function Calendar () {
    const [date, setDate] = Usestate(new Date());

return(
    <div className="bg-white w-full pt-4 rounded-lg shadow-md flex items-center justify-center">
      <h2 className="mb-4 mr-10 pl-8 text-2xl font-bold text-gray-800">Calendar</h2>
</div>

)
}

export default  Calendar;