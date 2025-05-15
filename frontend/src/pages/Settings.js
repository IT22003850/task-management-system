import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((response) => setUser(response.data.user));
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        {user && (
          <div className="bg-white p-6 rounded shadow">
            <p>
              <strong>Name:</strong> {user.displayName}
            </p>
            <p>
              <strong>Email:</strong> {user.emails[0].value}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;