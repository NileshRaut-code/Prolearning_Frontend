import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Teacher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new teacher dashboard
    navigate('/teacher/dashboard-new', { replace: true });
  }, [navigate]);

  return null; // This component just redirects
};

export default Teacher;


