import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSignInAlt, FaComments, FaLifeRing } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="bg-blue-900 text-white py-4 px-6 shadow-md fixed top-0 left-0 right-0 w-full z-10">
      <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
        {/* Logo - Clicking opens a new browser tab */}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-2xl font-bold text-white"
        >
          MyDoctor
        </a>

        {/* Desktop Menu - Visible on larger screens */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/about" className="flex items-center gap-2 text-white hover:text-gray-300">
            <FaComments /> About
          </Link>
          <Link to="/chatbot" className="flex items-center gap-2 text-white hover:text-gray-300">
            <FaComments /> Chatbot
          </Link>
          <Link to="/login" className="flex items-center gap-2 text-white hover:text-gray-300">
            <FaSignInAlt /> Login
          </Link>
          <Link to="/support" className="flex items-center gap-2 text-white hover:text-gray-300">
            <FaLifeRing /> Help?
          </Link>
        </nav>

        {/* Hamburger Menu - Visible only on small screens */}
        <div className="relative menu-container md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl focus:outline-none">
            <FiMenu />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
              <ul className="py-2 text-gray-900">
                <li><Link to="/about" className="block px-4 py-2 hover:bg-gray-200">About</Link></li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200">
                  <FaComments /> <Link to="/chatbot">Chatbot</Link>
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200">
                  <FaSignInAlt /> <Link to="/login">Login</Link>
                </li>
                <li><Link to="/logout" className="block px-4 py-2 hover:bg-gray-200">Logout</Link></li>
                <hr className="my-2 border-gray-300" />
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200">
                  <FaLifeRing /> <Link to="/support">Help?</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
