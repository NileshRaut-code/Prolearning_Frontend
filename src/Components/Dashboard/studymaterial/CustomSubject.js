import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../Loading/Loading";
import mathicon from  "../../../images/icons/icons/mathematics.png"
import phyicon from  "../../../images/icons/icons/web-analytics.png"
import bioicon from  "../../../images/icons/icons/technology.png"
import chemicon from  "../../../images/icons/icons/chemistry-class (1).png"
import hindicon from  "../../../images/icons/icons/language.png"
import maricon from  "../../../images/icons/icons/hindu (1).png"
import geoicon from  "../../../images/icons/icons/geography.png"
import histicon from  "../../../images/icons/icons/evolution (1).png"
import engicon from  "../../../images/icons/icons/english.png"

const CustomSubject = () => {
  const [id, setId] = useState(10);
  const [data, setdata] = useState();

  // Updated image mapping
  const imageMapping = {
    math: mathicon,
    science: "https://us.123rf.com/450wm/captainvector/captainvector2208/captainvector220805169/189725517-science-subject-icon.jpg?ver=6",
    physics: phyicon,
    chemistry: chemicon,
    geography: geoicon,
    history: histicon,
    biology: bioicon,
    marathi: maricon,
    hindi: hindicon,
    english: engicon,
  };

  const handleDropdownChange = (event) => {
    setId(event.target.value);
  };

  useEffect(() => {
    function getdata() {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/subjects/standard/${id}`)
        .then((res) => {
          if (res.data.data.standards[0]) {
            setdata(res.data.data.standards[0]);
          } else {
            setdata("No Data");
          }
        })
        .catch((err) => console.log(err));
    }
    getdata();
  }, [id]);

  return (
    <>
      <div className="p-2 m-2">
        Select Standard{" "}
        <select value={id} onChange={handleDropdownChange}>
          {[...Array(10).keys()].map((value) => (
            <option key={value + 1} value={value + 1}>
              {value + 1}
            </option>
          ))}
        </select>
      </div>

      {data ? (
        data === "No Data" ? (
          <div className="p-10 m-6 gap-2 flex flex-row justify-center items-center">
            <h1>No Subjects are Present for This Standard</h1>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2 m-2 sm:flex-row items-center justify-between">
            {data.subjects.map((datas, index) => (
              <div
                className="flex flex-col items-center justify-center sm:w-[10%]"
                key={index}
              >
                <Link to={`/subject/${datas?._id}`}>
                  <img
                    src={
                      imageMapping[datas?.name.toLowerCase()] ||
                      mathicon
                    }
                    alt="subject"
                  />
                  <div className="flex justify-center items-center">
                    {data && <h3>{datas?.name}</h3>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default CustomSubject;
