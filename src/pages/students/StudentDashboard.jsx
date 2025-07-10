import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import NavigationBar from "../../components/NavigationBar";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Example: Check profile completeness on mount
  useEffect(() => {
    // In real app: fetch student profile from backend
    const profileComplete = false; // simulate incomplete profile

    if (!profileComplete) {
      setShowProfilePrompt(true);
      setNotification({
        message: "Please complete your profile to get started!",
        type: "warning"
      });
    }
  }, []);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="dashboard-container">
      <NavigationBar />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}

      <div className="dashboard-content">
        <h2>Welcome to your Student Dashboard! 🎓</h2>
        <p>Manage your classes, progress, quizzes, and more here.</p>
        {showProfilePrompt && (
          <button
            className="complete-profile-btn"
            onClick={() => navigate("/StudentProfile")}
          >
            Complete Profile
          </button>
        )}
      </div>
    </div>
  );
}
