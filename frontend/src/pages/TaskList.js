import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TaskList = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((response) => setUser(response.data.user));
    axios
      .get(`http://localhost:5000/tasks?search=${search}&status=${status}`, {
        withCredentials: true,
      })
      .then((response) => setTasks(response.data));
  }, [search, status]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        withCredentials: true,
      });
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Task Report', 20, 10);
    doc.autoTable({
      head: [['Title', 'Description', 'Deadline', 'Assigned To', 'Status']],
      body: tasks.map((task) => [
        task.title,
        task.description,
        new Date(task.deadline).toLocaleDateString(),
        task.assignedTo,
        task.status,
      ]),
    });
    doc.save('tasks.pdf');
  };

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Task List</h1>
        <div className="flex justify-between mb-4">
          <Link
            to="/tasks/add"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add Task
          </Link>
          <button
            onClick={generatePDF}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded mt-2"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Deadline</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">
                  {new Date(task.deadline).toLocaleDateString()}
                </td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">
                  <Link
                    to={`/tasks/view/${task._id}`}
                    className="text-blue-600 mr-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/tasks/edit/${task._id}`}
                    className="text-yellow-600 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600"
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
  );
};

export default TaskList;