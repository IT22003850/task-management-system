import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-lg font-bold">
          Task Manager
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/tasks" className="text-white hover:text-gray-200">
            Tasks
          </Link>
          <Link to="/settings" className="text-white hover:text-gray-200">
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;