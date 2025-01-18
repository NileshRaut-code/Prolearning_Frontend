import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./Components/Login/login.js";
import Editor from "./Components/Editor/editor.js";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import { Signup } from "./Components/Login/Signup.js";
import { Provider } from "react-redux";
import appstore from "./utils/appstore.js";
import { Profile } from "./Components/Profile/profile.js";
import Auth from "./Components/Auth/auth.js";
import Home from "./Components/Home/Home.js";
import Student from "./Components/Dashboard/students/student.js";
import Logout from "./Components/Login/Logout.js";
import { Navigate } from "react-router-dom";
import Chapters from "./Components/Dashboard/students/Chapters.js";
import Particulartopics from "./Components/Dashboard/students/particulartopics.js";
import Topics from "./Components/Dashboard/students/topics.js";
import RoleAuth from "./Components/Auth/roleauth.js";
import Parents from "./Components/Dashboard/parents/Parents.js";
import Teacher from "./Components/Dashboard/teacher/Teacher.js";
import CreateTopic from "./Components/Dashboard/teacher/CreateTopic.js"
import Studeymaterial from "./Components/Dashboard/studymaterial/Studeymaterial.js";
import Testhome from "./Components/Dashboard/students/test/Testhome.js";
import CommunityHome from "./Components/Dashboard/community/communityHome.js";
import PerformanceHome from "./Components/Dashboard/performance/PerformanceHome.js";
import { Chaptertest } from "./Components/Dashboard/students/test/Chaptertest.js";
import HomeResult from "./Components/Dashboard/students/results/HomeResult.js";
import {Stdtest} from "./Components/Dashboard/students/test/Stdtest.js";
import TestComponent from "./Components/Dashboard/teacher/create/PTestcreate.js";
import Chapteradd from "./Components/Dashboard/teacher/create/Chapteradd.js";
import Createsubject from "./Components/Dashboard/teacher/create/Sujectadd.js";
import { Physicaltest } from "./Components/Dashboard/students/test/physical test/Physicaltest.js";
import Physicaltestupload from "./Components/Dashboard/students/test/physical test/Physicaltestupload.js";
import { TCHome } from "./Components/Dashboard/teacher/TestCheck/TCHome.js";
import TestCheckHome from "./Components/Dashboard/teacher/TestCheck/TestCheckHome.js";
import Ptestres from "./Components/Dashboard/students/results/Ptestres.js";
import TopicEditor from "./Components/Editor/topicEditor.js";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />
  },
  {
    path: "/",
    element: <App />,
    children:[ {
      path:"/login",
      element:(<Auth aut={false}><Login/></Auth>)
     },
    
     {
      path:"/signup",
      element:<Signup/>
     },
     {
      path:"/create/topic/:id",
      element:<RoleAuth aut={true} role={"TEACHER"} ><Editor/></RoleAuth>
     },
     {
      path:"/topic/:id",
      element:<Particulartopics/>
     },

     {
      path:"/chapter/:id",
      element:<Topics/>
     },
     {
      path:"/subject/:id",
      element:<Chapters/>
     },
     {
      path:"/profile",
      element:(<Auth aut={true}><Profile/></Auth>)
     },
     {
      path:"/logout",
      element:(<Auth aut={true}><Logout/></Auth>)
     },
     {
      path:"/home",
      element:(<Home/>)
     },
     {
      path:"/student/dashboard",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Student/></RoleAuth>)
     },
     {
      path:"/parent/dashboard",

      element:(<RoleAuth aut={true} role={"PARENT"} ><Parents/></RoleAuth>)
     },
     {
      path:"/teacher/dashboard",

      element:(<RoleAuth aut={true} role={"PARENT"} ><Teacher/></RoleAuth>)
     },
     {
      path:"/edit/topic/:id",
      element:(<RoleAuth aut={true} role={"TEACHER"}><TopicEditor/></RoleAuth>)
     },
     {
      path:"/student/test",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Stdtest/></RoleAuth>)
     },
     //this will required sime changes
     {
      path:"/student/chaptertest/:Id",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Chaptertest/></RoleAuth>)
     },
     //this will not changes
     {
      path:"/student/test/:testId",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Testhome/></RoleAuth>)
     },
     {
      path:"/student/community",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><CommunityHome/></RoleAuth>)
     },
     {
      path:"/student/performance",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><PerformanceHome/></RoleAuth>)
     },
     {
      path:"/student/test/result/:id",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><HomeResult/></RoleAuth>)
     },
     {
      path:"/student/ptest/result/:id",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Ptestres/></RoleAuth>)
     },
     
     {
      path:"/student/physical-test",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Physicaltest/></RoleAuth>)
     },
     {
      path:"/student/physical-test/:id",

      element:(<RoleAuth aut={true} role={"STUDENT"} ><Physicaltestupload/></RoleAuth>)
     },
     
     {
      path:"/create/topic",

      element:(<RoleAuth aut={true} role={"TEACHER"} ><CreateTopic/></RoleAuth>)
     },
     {
      path:"/teacher/create/ptest",

      element:(<RoleAuth aut={true} role={"TEACHER"} ><TestComponent/></RoleAuth>)
     },
     {
      path:"/teacher/check/ptest/:id",

      element:(<RoleAuth aut={true} role={"TEACHER"} ><TestCheckHome/></RoleAuth>)
     },
     {
      path:"/teacher/check/ptest",

      element:(<RoleAuth aut={true} role={"TEACHER"} ><TCHome/></RoleAuth>)
     },
     
     {
      path:"/teacher/create/subject",

      element:(<RoleAuth aut={true} role={"TEACHER"} ><Createsubject/></RoleAuth>)
     },
     {
      path:"/teacher/create/chapter",

      element:(<RoleAuth aut={true} role={"TEACHER"} ><Chapteradd/></RoleAuth>)
     },
    
    ]
  },
//http://localhost:8000/UNDEFINED/dashboard
{
  path: "/undefined/dashboard",
  element: <Navigate to="/home" replace />
},
{
  path: "/studymaterial",
  element: <Auth aut={true}><Studeymaterial/></Auth>
},
      {
        path: "*",
        element: <h1>Not Found</h1>,
      },
    
  
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={appstore}>
    <RouterProvider router={routes} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
