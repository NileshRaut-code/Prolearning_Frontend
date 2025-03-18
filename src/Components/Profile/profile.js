import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import Header from '../Navbar/header';
import Loading from "../Loading/Loading"
export const Profile = () => {
    const data=useSelector(store=>store.user.data)
    const [isSideNavOpen, setIsSideNavOpen] = useState(false)

    console.log(data);
  return (

    <div className={`${isSideNavOpen? 'sm:ml-64': ''}`} >
   <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen}/>
   {/* <div>{data?.role}</div><Link to={'/topic/66753fd74fb9256286cc58a1'}>Add New Topic</Link> */}
{ data ? <div className='h-screen m-2'> <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden ">
      <div className="flex items-center  p-4">
        <img className="w-16 h-16 rounded-full mr-4" src={data?.avatar} alt={`${data?.fullName}'s avatar`} />
        <div>
          <h2 className="text-xl font-semibold">{data?.fullName}</h2>
          <p className="text-gray-600">@{data?.username}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <p className="text-gray-600"><span className="font-bold">Role:</span> {data?.role}</p>
          <p className="text-gray-600"><span className="font-bold">Email:</span> {data?.email}</p>
          <p className="text-gray-600"><span className="font-bold">Phone:</span> {data?.phoneno}</p>
          <p className="text-gray-600"><span className="font-bold">Joined:</span> {new Date(data?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div></div> : <Loading/>}

   </div>
  

  )
}
