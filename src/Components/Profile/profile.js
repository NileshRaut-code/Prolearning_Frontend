import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Header from '../Navbar/header';
import Loading from "../Loading/Loading";

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
        <div className={`${isSideNavOpen ? 'sm:ml-64' : ''}`}>
            <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />

            {data ? (
                <div className='h-screen m-2'>
                    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="flex items-center p-4">
                            <img className="w-16 h-16 rounded-full mr-4" src={data?.avatar} alt={`${data?.fullName}'s avatar`} />
                            <div>
                                <h2 className="text-xl font-semibold">{data?.fullName}</h2>
                                <p className="text-gray-600">@{data?.username}</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-600"><span className="font-bold">Role:</span> {data?.role}</p>
                            <p className="text-gray-600"><span className="font-bold">Email:</span> {data?.email}</p>
                            <p className="text-gray-600"><span className="font-bold">Phone:</span> {data?.phoneno}</p>
                            <p className="text-gray-600"><span className="font-bold">Joined:</span> {new Date(data?.createdAt).toLocaleDateString()}</p>
                            
                            {/* Show Change Standard Dropdown only for Students */}
                            {data?.role === "STUDENT" && (
                                <div className="mt-4">
                                    <label className="block font-bold mb-2">Change Standard:</label>
                                    <select
                                        value={selectedStandard}
                                        onChange={handleStandardChange}
                                        className="w-full border rounded-lg p-2"
                                        disabled={loading}
                                    >
                                        <option value="">Select Standard</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                    {loading && <p className="text-blue-500 mt-2">Updating...</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
};
