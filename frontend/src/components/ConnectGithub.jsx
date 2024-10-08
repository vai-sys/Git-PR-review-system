import React from 'react';

function ConnectGitHub() {
  const handleConnect = () => {
 
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liXVE5rpUyQpYS2d&scope=repo`;
  };

  return (
    <div>
      <button onClick={handleConnect}>Connect GitHub</button>
    </div>
  );
}

export default ConnectGitHub;
