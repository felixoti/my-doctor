import React from "react";

function Sidebar() {
 return (
  <div className="w-64 bg-gray-800 text-white p-4">
    <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
    <ul>
      <li className="mb-4">
        <a href="#" className="hover:text-gray-300">
          Dashboard
        </a>
      </li>
      <li className="mb-4">
        <a href="users" className="hover:text-gray-300">
          Users
        </a>
      </li>
      <li className="mb-4">
        <a href="#" className="hover:text-gray-300">
          Settings
        </a>
      </li>
    </ul>
  </div>
 );
}
export default Sidebar;