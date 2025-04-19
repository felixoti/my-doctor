import React from "react";
import { useOutletContext } from "react-router-dom";

function Users() {
  const { searchQuery } = useOutletContext();

  const users = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user, index) => (
              <li key={index} className="mb-2">
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No users found</p>
        )}
      </div>
    </main>
  );
}

export default Users;