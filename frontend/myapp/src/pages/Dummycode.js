import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "components/Navbar";             // Or adjust path to your Navbar component file
import Signup from "./pages/Signup";  
import Profile from './pages/Profile';
     // Ensure this matches your exact file path to Signup.js

// Dummy placeholders for other pages (replace with your actual imports)
const Home = () => <div style={{padding: "100px"}}>Home Page Content</div>;
const Login = () => <div style={{padding: "100px"}}>Login Page Content</div>;
const Download = () => <div style={{padding: "100px"}}>Download Apps Content</div>;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </Router>
  );
}

export default App;