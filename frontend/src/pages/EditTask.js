import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    status: 'Pending',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, taskResponse] = await Promise.all([
          axios.get('http://localhost:5000/auth/user', { withCredentials: true }),
          axios.get(`http://localhost:5000/tasks/${id}`, { withCredentials: true }),
        ]);
        setUser(userResponse.data.user);
        const taskData = taskResponse.data;
        setTask({
          ...taskData,
          deadline: taskData.deadline
            ? new Date(taskData.deadline).toISOString().split('T')[0]
            : '',
        });
      } catch (err) {
        setError('Failed to load task. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!task.title.trim()) errors.title = 'Title is required';
    if (!task.description.trim()) errors.description = 'Description is required';
    if (!task.deadline) errors.deadline = 'Deadline is required';
    if (!task.assignedTo.trim()) errors.assignedTo = 'Assigned To is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);
      await axios.put(`http://localhost:5000/tasks/${id}`, task, {
        withCredentials: true,
      });
      setTimeout(() => {
        navigate('/tasks', { state: { message: 'Task updated successfully!' } });
      }, 500); // Brief delay for UX
    } catch (err) {
      setError('Error updating task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setTask({ ...task, [field]: e.target.value });
    setFormErrors({ ...formErrors, [field]: '' }); // Clear error on input change
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
          Edit Task
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto animate-slide-up"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={task.title}
                onChange={handleInputChange('title')}
                className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                required
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={task.description}
                onChange={handleInputChange('description')}
                className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                rows="4"
                required
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Deadline</label>
              <input
                type="date"
                value={task.deadline}
                onChange={handleInputChange('deadline')}
                className={`w-full border ${formErrors.deadline ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                required
              />
              {formErrors.deadline && (
                <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Assigned To</label>
              <input
                type="text"
                value={task.assignedTo}
                onChange={handleInputChange('assignedTo')}
                className={`w-full border ${formErrors.assignedTo ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                required
              />
              {formErrors.assignedTo && (
                <p className="text-red-500 text-sm mt-1">{formErrors.assignedTo}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                value={task.status}
                onChange={handleInputChange('status')}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex gap-4 justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </button>
            <Link
              to="/tasks"
              className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;