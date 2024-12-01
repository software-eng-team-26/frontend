import { Link } from 'react-router-dom';

export function AuthButtons() {
  return (
    <div className="space-x-4">
      <Link
        to="/signin"
        className="text-gray-600 hover:text-gray-900"
      >
        Sign In
      </Link>
      <Link
        to="/signup"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Sign Up
      </Link>
    </div>
  );
} 