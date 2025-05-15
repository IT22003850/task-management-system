import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          navigate('/dashboard');
        }
      })
      .catch(() => {
        // Silently handle errors (e.g., network issues)
      });
  }, [navigate]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all hover:shadow-2xl">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Task Manager
          </h1>
          <p className="text-gray-500 mt-2">Sign in to manage your tasks</p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.24 10.667H12V10.4h-.24c-.662 0-1.2.538-1.2 1.2v.8c0 .662.538 1.2 1.2 1.2h.48c.662 0 1.2-.538 1.2-1.2v-.8c0-.662-.538-1.2-1.2-1.2zm0-.8h.24c.994 0 1.8.806 1.8 1.8v.8c0 .994-.806 1.8-1.8 1.8h-.48c-.994 0-1.8-.806-1.8-1.8v-.8c0-.994.806-1.8 1.8-1.8h.24zM12 8.4c-1.986 0-3.6 1.614-3.6 3.6 0 1.986 1.614 3.6 3.6 3.6s3.6-1.614 3.6-3.6c0-1.986-1.614-3.6-3.6-3.6zm0 6.4c-1.546 0-2.8-1.254-2.8-2.8s1.254-2.8 2.8-2.8 2.8 1.254 2.8 2.8-1.254 2.8-2.8 2.8zm0-8.8c-2.982 0-5.4 2.418-5.4 5.4s2.418 5.4 5.4 5.4 5.4-2.418 5.4-5.4-2.418-5.4-5.4-5.4zm0 10c-2.542 0-4.6-2.058-4.6-4.6s2.058-4.6 4.6-4.6 4.6 2.058 4.6 4.6-2.058 4.6-4.6 4.6z"
            />
          </svg>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            &copy; 2025 Task Manager. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;