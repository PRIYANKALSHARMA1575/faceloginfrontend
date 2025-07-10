import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";

export default function NavigationBar() {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">MyEdApp</div>
      <ul className="nav-links">
        <li><Link to="/StudentDashboard">Dashboard</Link></li>
        <li><Link to="/MyClassrooms">Classrooms</Link></li>
        <li><Link to="/QuizBot">Quiz Bot</Link></li>
        <li><Link to="/ProgressBoard">Progress</Link></li>
        <li><Link to="/StudentProfile">Profile</Link></li>
        <li><Link to="/Notifications">Notifications</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
}
