import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // ✅ Import useLocation
import Chatbot from "./Chatbot/chatbot";
import Register from "./Register/register";
import Login from "./Login/login";
import Header from "./Header/header";
import Hero from "./Hero/hero";
import Footer from "./Footer/footer";
import Logout from "./Logout/logout";
import Support from "./Support/support";
import  Landingpage  from "./Landingpage/landingpage";
import About from "./About/about";
import AdminDashboard from "./Admindashboard/dashboard";
import Viewusers from "./Admindashboard/viewusers";
import ForgotPassword from "./Forgotpassword/forgotpassword";



function App() {
  const location = useLocation(); // ✅ useLocation is now properly defined

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scrollTo({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "smooth"; // ✅ Fix typo
  }, [location.pathname]); // ✅ Dependency array ensures effect runs on route change


  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />} /> 
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/viewuser" element={<AdminDashboard />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/header" element={<Header />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/users" element={<Viewusers />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/footer" element={<Footer />} /> 
      </Routes>
    </>
  );
}

export default App;
