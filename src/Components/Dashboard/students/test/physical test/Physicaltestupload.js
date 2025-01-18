import React, { useState, useEffect } from 'react';
import Header from '../../../../Navbar/header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IoIosArrowBack } from 'react-icons/io';
import { IoMdMore } from 'react-icons/io';
import { jsPDF } from 'jspdf';

const Physicaltestupload = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, Setdata] = useState('');
  const [res, Setresdata] = useState('');
  const [pdffile, setpdffile] = useState('');
  const stdid = useSelector((store) => store.user.data._id);
  const [err, seterr] = useState('');
  const [recentFiles, setRecentFiles] = useState([]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${data.name} - Test Paper`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Teacher: ${data.teacher.fullName}`, 20, 30);
    doc.text(`Subject: ${data.subject}`, 20, 40);
    doc.text(`Grade: ${data.standard}`, 20, 50);
    doc.text(`Total Marks: ${data.score}`, 20, 60);
    doc.line(10, 70, 200, 70);

    data.questions.forEach((item, index) => {
      doc.text(`Q${index + 1}: ${item.question}`, 20, 80 + index * 10);
      doc.text(`Marks: ${item.score}`, 180, 80 + index * 10);
    });

    doc.save(`${data.name}_Test_Paper.pdf`);
  };

  const fetchRecentFiles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/recent-files`
      );
      setRecentFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching recent files:', error);
    }
  };

  useEffect(() => {
    async function testdata() {
      try {
        axios.defaults.withCredentials = true;
        const testResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/${id}`
        );
        Setdata(testResponse.data.data);

        const resResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/physicaltest/already_check/${id}`
        );
        Setresdata(resResponse.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    testdata();
  }, [id]);

  const submittest = () => {
    if (!pdffile) {
      seterr('PDF File Required to Submit Test');
      setTimeout(() => seterr(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('studentId', stdid);
    formData.append('teacherId', data.teacher._id);
    formData.append('testId', id);
    formData.append('pdf', pdffile);

    axios.defaults.withCredentials = true;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies`,
        formData
      )
      .then(() => {
        seterr('Successfully Submitted Test');
        setTimeout(() => navigate('/student/physical-test'), 3000);
      })
      .catch((error) => {
        console.error(error);
        seterr('Some Error Caught while Submitting Test');
      });
  };

  return (
    <>
      <Header />
      {/* Navigation and Test Info */}
      <div className="m-2 font-semibold text-xl flex flex-row">
        <button className="pl-48 pr-12" onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </button>
        <div
          className="flex flex-row bg-gray-100 rounded-xl place-content-center"
          style={{
            width: '860px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p className="text-slate-500 text-lg font-semibold">TEST NAME</p>
          <div className="flex flex-row">
            <p className="text-slate-500 text-lg font-semibold">DUE DATE</p>
            <button className="p-2">
              <IoMdMore style={{ fontWeight: 'bold' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-auto mx-auto bg-white rounded-xl mt-8 p-6 grid grid-cols-2 gap-6">
        {/* Questions Column */}
        <div className="pr-6">
          {/* Align the heading with the list */}
          <div className="pb-4">
            <p className="font-semibold text-lg">LIST OF QUESTIONS</p>
          </div>
          <ul className="pl-2"> {/* Add padding to align with heading */}
            {data.questions &&
              data.questions.map((item, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center rounded-xl py-4 px-4 ${index % 2 === 0
                    ? 'bg-white border border-sky-200'
                    : 'bg-gray-100'
                    }`}
                >
                  <span className="text-gray-700 text-sm font-medium">
                    {index + 1}. {item.question}
                  </span>
                  <span className="text-gray-500 text-sm">{item.score} Marks</span>
                </li>
              ))}
          </ul>
        </div>


        {/* Upload and Actions Section */}
        <div className="pl-6 mt-16 flex flex-col gap-4">
          <div className="bg-gray-100 p-2 rounded-lg shadow-md">
            <div className="flex flex-row items-center gap-8">
              <button
                onClick={() => document.getElementById('file-input').click()}
                className="bg-orange-500 text-white px-2 text-sm py-2 rounded-lg shadow-sm hover:shadow-xl"
              >
                New Upload
              </button>
              <button
                onClick={fetchRecentFiles}
                className="bg-white text-orange-500 px-2 text-sm py-2 rounded-lg shadow-sm hover:shadow-xl border border-white"
              >
                Recent
              </button>
            </div>
          </div>

          {/* Recent Files Section */}
          {recentFiles.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-4">Recent Uploads</h3>
              <ul className="space-y-2">
                {recentFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border px-4 py-2 rounded-lg"
                  >
                    <span>{file.name}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setpdffile(e.target.files[0])}
              className="block w-full text-sm text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={submittest}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
            >
              Submit Test
            </button>
          </div>

          {/* Error Message */}
          {err && (
            <div className="text-red-500 text-center mt-4 font-medium">
              {err}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Physicaltestupload;
