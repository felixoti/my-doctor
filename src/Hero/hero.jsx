import React from "react";

function Hero() {
  return (
    <section id="hero" className="h-screen flex items-center justify-center text-center bg-gray-900">
      <div className="p-6">
        <h1 className="text-4xl font-bold text-white">Welcome to MyDoctor</h1>
        <p className="mt-4 text-gray-300 text-lg">
          Your health is our priority. Get world-class medical services from the current technology.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}

export default Hero;

