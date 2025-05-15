import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((response) => setUser(response.data.user));
    axios
      .get('http://localhost:5000/tasks', { withCredentials: true })
      .then((response) => setTasks(response.data));
  }, []);

  const pending = tasks.filter((task) => task.status === 'Pending').length;
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
  const done = tasks.filter((task) => task.status === 'Done').length;

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.displayName || 'User'}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="text-xl">Total Tasks</h2>
            <p className="text-2xl">{tasks.length}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <h2 className="text-xl">Pending</h2>
            <p className="text-2xl">{pending}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h2 className="text-xl">Completed</h2>
            <p className="text-2xl">{done}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;