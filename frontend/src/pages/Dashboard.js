import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, tasksResponse] = await Promise.all([
          axios.get('http://localhost:5000/auth/user', { withCredentials: true }),
          axios.get('http://localhost:5000/tasks', { withCredentials: true }),
        ]);
        setUser(userResponse.data.user);
        setTasks(tasksResponse.data);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const pending = tasks.filter((task) => task.status === 'Pending').length;
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
  const done = tasks.filter((task) => task.status === 'Done').length;

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
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center transform transition-all animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Welcome, {user?.displayName || 'User'}!
          </h1>
          <p className="text-gray-600 text-lg">
            Let’s conquer your tasks today!
          </p>
        </div>

        {/* Task Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold">Total Tasks</h2>
            </div>
            <p className="text-4xl font-semibold">{tasks.length}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all animate-slide-up delay-100">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold">Pending</h2>
            </div>
            <p className="text-4xl font-semibold">{pending}</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all animate-slide-up delay-200">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-2xl font-bold">In Progress</h2>
            </div>
            <p className="text-4xl font-semibold">{inProgress}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all animate-slide-up delay-300">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold">Completed</h2>
            </div>
            <p className="text-4xl font-semibold">{done}</p>
          </div>
        </div>

        {/* View Tasks Button */}
        <div className="text-center mt-8">
          <Link
            to="/tasks"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all active:scale-95"
          >
            View All Tasks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;