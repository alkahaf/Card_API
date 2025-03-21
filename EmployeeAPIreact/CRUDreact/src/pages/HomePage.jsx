import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Employee Management System</h1>
      <Link to="/employees" className="bg-blue-500 text-white px-4 py-2 rounded">Go to Employee Management</Link>
    </div>
  );
};

export default HomePage;
