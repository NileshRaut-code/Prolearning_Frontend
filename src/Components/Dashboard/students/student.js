import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Student = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new student dashboard
    navigate('/student/dashboard-new', { replace: true });
  }, [navigate]);

  return null; // This component just redirects
};

export default Student;


