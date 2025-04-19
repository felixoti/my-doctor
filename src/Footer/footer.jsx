import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white py-8 w-full mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between">
        
        <div className="mb-6 md:mb-0 md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">About Us</h2>
          <p className="text-sm">
            <strong>Name:</strong> MyDoctor<br />
            <strong>Mission:</strong> To provide seamless and efficient services through modern technology.<br />
            <strong>Values:</strong> Integrity, Innovation, Customer Satisfaction.
          </p>
        </div>

        <div className="mb-6 md:mb-0 md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-sm">
            📧 Email: mydoctor@gmail.com <br />
            📞 Phone: +254712244717 <br />
            📍 Location: Nairobi
          </p>
        </div>

        <div className="md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Need Help</h2>
          <ul className="text-sm">
            <li><a href="/support" className="hover:underline">Contact Support</a></li>
            <li><a href="/chatbot" className="hover:underline">Policy</a></li>
          </ul>
        </div>

        <div className="md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <ul className="text-sm">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/chatbot" className="hover:underline">Chatbot</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-6 border-t border-gray-400 pt-4">
        &copy; {new Date().getFullYear()} MyDoctor. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
