import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return <AuthForm isSignUp={isSignUp} onToggleMode={toggleMode} />;
};

export default AuthPage;