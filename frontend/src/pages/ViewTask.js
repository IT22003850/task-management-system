import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ViewTask = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((response) => setUser(response.data.user));
    axios
      .get(`http://localhost:5000/tasks/${id}`, { withCredentials: true })
      .then((response) => setTask(response.data));
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
        <div className="bg-white p-6 rounded shadow">
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <p>
            <strong>Deadline:</strong>{' '}
            {new Date(task.deadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Assigned To:</strong> {task.assignedTo}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Created At:</strong>{' '}
            {new Date(task.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{' '}
            {new Date(task.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;