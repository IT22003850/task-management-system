import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/auth/user', {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true,
      });
      navigate('/login');
    } catch (err) {
      navigate('/login'); // Navigate even if logout fails
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 animate-fade-in">
          Settings
        </h1>
        {user && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.photos?.[0]?.value || 'https://via.placeholder.com/80'}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
                <p className="text-gray-600">{user.emails[0].value}</p>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Display Name</label>
                  <input
                    type="text"
                    value={user.displayName}
                    disabled
                    className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Email</label>
                  <input
                    type="email"
                    value={user.emails[0].value}
                    disabled
                    className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 hover:scale-105 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;