import React from "react";
import { FaSignOutAlt } from "react-icons/fa"; 

function Logout({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-300"
    >
      <FaSignOutAlt className="text-lg" /> Logout
    </button>
  );
}

export default Logout;
