import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdvocatesList from './pages/AdvocatesList';
import Adminpage from './pages/Adminpage';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import AboutUs from './pages/Aboutus';



function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/find-lawyer" element={<div style={{padding: "100px"}}>Find Lawyer Page Content</div>} />
        <Route path="/legal-advice" element={<div style={{padding: "100px"}}>Legal Advice Page Content</div>} />
        <Route path="/legal-advice/documents" element={<div style={{padding: "100px"}}>Legal Documents Page Content</div>} />
        <Route path="/legal-advice/bare-acts" element={<div style={{padding: "100px"}}>Bare Acts Page Content</div>} />
        <Route path="/legal-advice/news" element={<div style={{padding: "100px"}}>Legal News Page Content</div>} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Partners" element={<Partners />} />

        <Route path="/AdvocatesList" element={<AdvocatesList />} /> 
        <Route path="/admin" element={<Adminpage />} />
<Route path="/signup" element={<Signup />} />    
  <Route path="/login" element={<Login />} />
  <Route path="/Aboutus" element={<AboutUs />} />
  <Route path="/Contact" element={<Contact />} />
  <Route path="/Partners" element={<Partners />} />

  <Route path="/advocate-dashboard" element={<AdvocateDashboard />} />        <Route path="/download" element={<div style={{padding: "100px"}}>Download Apps Page Content</div>} />
        
      </Routes>
    </div>
  );
}

export default App;
