import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { debounce } from 'lodash'; // For search debouncing

const TaskList = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, tasksResponse] = await Promise.all([
          axios.get('http://localhost:5000/auth/user', { withCredentials: true }),
          axios.get(`http://localhost:5000/tasks?search=${search}&status=${status}`, {
            withCredentials: true,
          }),
        ]);
        setUser(userResponse.data.user);
        setTasks(tasksResponse.data);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [search, status]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${id}`, {
          withCredentials: true,
        });
        setTasks(tasks.filter((task) => task._id !== id));
      } catch (err) {
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Task Report', 20, 10);
    autoTable(doc, {
      head: [['Title', 'Description', 'Deadline', 'Assigned To', 'Status']],
      body: tasks.map((task) => [
        task.title,
        task.description || '',
        task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A',
        task.assignedTo || 'N/A',
        task.status,
      ]),
    });
    doc.save('tasks.pdf');
  };

  // Debounce search input
  const handleSearch = debounce((value) => {
    setSearch(value);
  }, 300);

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
          Task List
        </h1>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-4">
            <Link
              to="/tasks/add"
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Link>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by title..."
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Task Count */}
        <div className="mb-4 text-gray-600 text-lg">
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 text-left font-semibold">Title</th>
                <th className="p-4 text-left font-semibold">Deadline</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className="border-t hover:bg-gray-50 transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">{task.title}</td>
                  <td className="p-4">
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        task.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : task.status === 'In Progress'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Link
                      to={`/tasks/view/${task._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
                    <Link
                      to={`/tasks/edit/${task._id}`}
                      className="text-yellow-600 hover:text-yellow-800 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;