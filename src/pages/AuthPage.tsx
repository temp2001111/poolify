import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      // Redirect to the page they were trying to access, or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return <AuthForm isSignUp={isSignUp} onToggleMode={toggleMode} />;
};

export default AuthPage;