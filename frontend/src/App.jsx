// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaGithub } from 'react-icons/fa';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
//     const username = urlParams.get('user'); 

//     if (code) {
//       handleCallback(code);
//     } else if (username) {
//       setUser(username); 
//     }
//   }, []);

//   const handleCallback = async (code) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/auth/oauth/callback?code=${code}`);
//       console.log('Backend response:', response.data);
//       setUser(response.data.user);
//       window.history.replaceState({}, document.title, "/");
//     } catch (err) {
//       console.error('Detailed error:', err.response || err);
//       setError(err.response?.data?.message || 'Authentication failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = () => {
//     window.location.href = '/auth/login'; 
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-white mb-2">GitHub OAuth Demo</h1>
//           <p className="text-gray-400">Connect your GitHub account to get started</p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//           </div>
//         ) : user ? (
//           <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//             <div className="flex items-center justify-center mb-4">
//               <div className="bg-green-500 rounded-full p-2">
//                 <FaGithub className="text-white text-3xl" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-semibold text-white text-center mb-2">
//               Welcome, {user}!
//             </h2>
//             <p className="text-gray-400 text-center">
//               You've successfully connected your GitHub account.
//             </p>
//           </div>
//         ) : (
//           <button
//             onClick={handleLogin}
//             className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out"
//           >
//             <FaGithub className="text-xl mr-2" />
//             Connect with GitHub
//           </button>
//         )}

//         {error && (
//           <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
