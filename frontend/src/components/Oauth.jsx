import React from 'react';

const OAuthButton = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/login'; // Redirect to backend login
  };

  return (
    <button onClick={handleLogin} className='pt-5 pl-6 bg-red-400'>
      Connect GitHub
    </button>
  );
};



export default OAuthButton;
