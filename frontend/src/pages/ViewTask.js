import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ViewTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, taskResponse] = await Promise.all([
          axios.get('http://localhost:5000/auth/user', { withCredentials: true }),
          axios.get(`http://localhost:5000/tasks/${id}`, { withCredentials: true }),
        ]);
        setUser(userResponse.data.user);
        setTask(taskResponse.data);
      } catch (err) {
        setError('Failed to load task. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${id}`, {
          withCredentials: true,
        });
        navigate('/tasks');
      } catch (err) {
        setError('Failed to delete task. Please try again.');
      }
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

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="text-gray-600 text-xl">Task not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 animate-fade-in">
          {task.title}
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto animate-slide-up">
          <div className="space-y-4">
            <div>
              <strong className="text-gray-700">Description:</strong>
              <p className="text-gray-600">{task.description || 'N/A'}</p>
            </div>
            <div>
              <strong className="text-gray-700">Deadline:</strong>
              <p className="text-gray-600">
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <strong className="text-gray-700">Assigned To:</strong>
              <p className="text-gray-600">{task.assignedTo || 'N/A'}</p>
            </div>
            <div>
              <strong className="text-gray-700">Status:</strong>
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-medium ml-2 ${
                  task.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : task.status === 'In Progress'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {task.status}
              </span>
            </div>
            <div>
              <strong className="text-gray-700">Created At:</strong>
              <p className="text-gray-600">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <strong className="text-gray-700">Updated At:</strong>
              <p className="text-gray-600">
                {new Date(task.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-4 justify-end">
            <Link
              to={`/tasks/edit/${id}`}
              className="flex items-center gap-2 bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-700 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828L14.172 4.172a2 2 0 012.828 0z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H8V5a2 2 0 012-2z" />
              </svg>
              Delete
            </button>
            <Link
              to="/tasks"
              className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;