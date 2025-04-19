import React from "react";

function About() {
  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">About MyDoctor</h1>
        <p className="text-lg text-gray-800 mb-4">
          MyDoctor is a revolutionary health system that helps users diagnose diseases based on their symptoms.  
          Simply enter your symptoms in our AI-powered chatbot, and it will analyze your inputs to provide a possible diagnosis.
        </p>
        <p className="text-lg text-gray-800 mb-4">
          If a diagnosis is unclear,can not be diagnosed or requires further medical attention, MyDoctor will direct you to the nearest hospital for expert care.
        </p>
        <p className="text-lg text-gray-800 mb-6">
          Additionally, MyDoctor provides medicine recommendations for diagnosed conditions, helping you take the next step in treatment.
        </p>

        <a
          href="/chatbot"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Try the Chatbot Now
        </a>
      </div>
    </section>
  );
}

export default About;
