import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Header from '../Navbar/header';
import Loading from "../Loading/Loading";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaUserTag, 
  FaGraduationCap,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShield,
  FaCog,
  FaBell,
  FaLock
} from 'react-icons/fa';

export const Profile = () => {
    const data = useSelector(store => store.user.data);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [selectedStandard, setSelectedStandard] = useState(data?.standard || "");
    const [loading, setLoading] = useState(false);

    const handleStandardChange = async (e) => {
        const newStandard = e.target.value;
        setSelectedStandard(newStandard);

        try {
            setLoading(true);
            axios.defaults.withCredentials=true
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/change-standard`, { standard: newStandard });
            console.log("Standard updated:", response.data);
            setLoading(false);
            alert("Standard updated successfully!");
        } catch (error) {
            setLoading(false);
            console.error("Error updating standard:", error);
            alert("Failed to update standard. Try again.");
        }
    };

    return (
        <div className={`${isSideNavOpen ? 'sm:ml-64' : ''} bg-gray-50 min-h-screen`}>
            <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />

            {data ? (
                <div className='p-6 max-w-4xl mx-auto'>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full bg-white text-gray-800 flex items-center justify-center text-2xl font-bold mr-6">
                                {data?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{data?.fullName}</h1>
                                <p className="text-blue-100">@{data?.username}</p>
                                <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mt-2">
                                    {data?.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
                            Profile Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FaEnvelope className="text-gray-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold">{data?.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FaPhone className="text-gray-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-semibold">{data?.phoneno}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FaUserTag className="text-gray-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Role</p>
                                    <p className="font-semibold">{data?.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FaCalendarAlt className="text-gray-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Joined</p>
                                    <p className="font-semibold">{new Date(data?.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Standard Selection for Students */}
                        {data?.role === "STUDENT" && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <FaGraduationCap className="mr-2 text-blue-500" />
                                    Change Standard
                                </label>
                                <select
                                    value={selectedStandard}
                                    onChange={handleStandardChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    <option value="">Select Standard</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                        <option key={num} value={num}>Standard {num}</option>
                                    ))}
                                </select>
                                {loading && <p className="text-blue-500 mt-2 text-sm">Updating...</p>}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
};
