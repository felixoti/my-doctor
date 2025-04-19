import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import MainContent from "./MainContent";

function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Static Sidebar */}
      <div className="fixed w-64 h-full">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Static Header */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Main Content */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          <MainContent searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;