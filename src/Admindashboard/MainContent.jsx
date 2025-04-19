import React from "react";

function MainContent({ searchQuery }) {
  const userStats = [
    { title: "Total Users", value: "1,234" },
    { title: "Active Users", value: "987" },
    { title: "New Users (This Month)", value: "56" },
  ];

  const commonDiseases = [
    { name: "Flu", cases: "450" },
    { name: "Cold", cases: "320" },
    { name: "Allergies", cases: "210" },
  ];

  const chronicDiseases = [
    { name: "Diabetes", cases: "150" },
    { name: "Hypertension", cases: "130" },
    { name: "Asthma", cases: "90" },
  ];

  const filteredUserStats = userStats.filter((stat) =>
    stat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCommonDiseases = commonDiseases.filter((disease) =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredChronicDiseases = chronicDiseases.filter((disease) =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-4">Number of Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredUserStats.length > 0 ? (
          filteredUserStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No user stats match your search</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Common Diseases</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        {filteredCommonDiseases.length > 0 ? (
          <ul>
            {filteredCommonDiseases.map((disease, index) => (
              <li key={index} className="mb-2">
                {disease.name} - {disease.cases} cases
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No common diseases match your search</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Chronic Diseases</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        {filteredChronicDiseases.length > 0 ? (
          <ul>
            {filteredChronicDiseases.map((disease, index) => (
              <li key={index} className="mb-2">
                {disease.name} - {disease.cases} cases
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No chronic diseases match your search</p>
        )}
      </div>
    </main>
  );
}

export default MainContent;