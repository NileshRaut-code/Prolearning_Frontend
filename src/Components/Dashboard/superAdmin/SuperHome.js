import React ,{useState} from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import Header from '../../Navbar/header';
import UserManagement from './UserTable';
const SuperHome = () => {
  //const userdata=useSelector(store=>store.user.data);
 const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  return (
    <>
   <div className={`${isSideNavOpen? 'sm:ml-64': ''}`} >
   <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen}/>

      <UserManagement/>

      </div>
    </>
  );
};

export default SuperHome;
