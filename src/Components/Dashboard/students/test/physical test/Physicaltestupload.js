import React ,{useState ,useEffect,useRef} from 'react'
import Header from '../../../../Navbar/header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
const Physicaltestupload = () => {
  const navigate=useNavigate()
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const {id}=useParams()
    const [data,Setdata]=useState('')
    const [res,Setresdata]=useState('')
    const handleDownloadPDF = () => {
      const doc = new jsPDF();
  
      doc.setFontSize(18);
      doc.text(`${data.name} - Test Paper`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Teacher: ${data.teacher.fullName}`, 20, 30);
      doc.text(`Subject: ${data.subject}`, 20, 40);
      doc.text(`Grade: ${data.standard}`, 20, 50);
      doc.text(`Total Marks: ${data.score}`, 20, 60);
  doc.line(0,70,10000,70)
      data.questions.forEach((item, index) => {
        doc.text(`Q${index + 1}: ${item.question}`, 20, 80 + (index * 10));
        doc.text(`Marks: ${item.score}`, 180, 80 + (index * 10));
      });
  
      doc.save(`${data.name}_Test_Paper.pdf`);
    };
  const [pdffile,setpdffile]=useState('')
    const stdid=useSelector(store=>store.user.data._id)
    const [err,seterr]=useState('')
    useEffect(() => {
        function testdata(){
            axios.defaults.withCredentials = true;
            axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/${id}`).then(res=>Setdata(res.data.data)).catch(err=>console.log(err))
            // http://localhost:8001/api/physicaltest/already_check/
            axios.get(`${process.env.REACT_APP_API_URL}/api/physicaltest/already_check/${id}`).then(res=>Setresdata(res.data.data)).catch(err=>console.log(err))
        }
        testdata()
    }, [id])

    function submittest() {
       
        if(!pdffile){
          seterr("Pdf File Required to Submit Test")
          setTimeout(() => {
            seterr('')
          }, 3000);
          return
        }
    else{
      console.log("data");

    

const formData = new FormData();
formData.append('studentId', stdid);
formData.append('teacherId', data.teacher._id,);
formData.append('testId',id);
formData.append('pdf', pdffile);
      axios.defaults.withCredentials = true;
      axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies`,
        formData
      )
      .then((res) => {seterr("Succesfully Submitted Test");
        setTimeout(() => {
          navigate('/student/physical-test')
        }, 3000);
      })
      .catch((err) => console.log(err));
      seterr("some Error Caught while Submitting Test")
    }
        
    }
    
  return (
    <>
  
          <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
          <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
   {data && <div  className='flex justify-center items-center'>
    <div  className="bg-background rounded-lg border p-6 w-full max-w-3xl ">
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-muted-foreground"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          <h1 className="text-2xl font-bold">{data.name}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{data.teacher.fullName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        </svg>
        <span>{data.subject}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path>
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path>
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>
        </svg>
        <span>Grade {data.standard}</span>
      </div>
    </div>
    <div className="grid gap-4 bg-muted p-4 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-muted-foreground"
          >
            <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path>
            <path d="M16 8 2 22"></path>
            <path d="M17.5 15H9"></path>
          </svg> */}
          
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
          </svg>
          <span>Total Marks :{data.score}</span>
        </div>
      </div>
     
     <div>

     
      {  data.questions.map((items,index)=>{
            return (<div key={index} className='flex flex-row justify-between my-2'><div key={index}><span className='text-gray-500'>Q.{index+1}</span> {items.question}  </div><div>Marks: {items.score}</div></div>)
        })}
   
     </div>
     
    </div>
     
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <input 
        //ref={pdffile}
       // value={pdffile}
       onChange={(e)=>{
        setpdffile(e.target.files[0])
       }}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
          type="file"
          id="pdf-upload"
          accept="application/pdf"
        />
      </div>
   <button onClick={submittest} className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" x2="12" y1="3" y2="15"></line>
        </svg>
        <span>Submit as PDF</span>
      </button>
      <button onClick={handleDownloadPDF} className="justify-center rounded-md border bg-background h-10 px-4 py-2">
                    Download Test Paper as PDF
                  </button>
    </div>
    {err &&      <p className='text-green-500 mt-2'>{err}</p>
  } 
  </div>
</div>
    </div>}
    <div className='flex justify-center items-center'>
    <div className="bg-background rounded-lg border p-6 w-full max-w-3xl ">
   <div> {res &&<><h2>Already Submited</h2> <Link to={`/student/ptest/result/${res?._id}`}>Check The Result</Link></>}</div>
          </div></div></div>
    </> 
  )
}

export default Physicaltestupload