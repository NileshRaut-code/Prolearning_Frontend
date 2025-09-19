import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Stdtest = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new test dashboard
    navigate('/student/test-dashboard', { replace: true });
  }, [navigate]);

  return null; // This component just redirects
};
