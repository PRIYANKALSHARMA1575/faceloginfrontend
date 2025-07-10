import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-box">
        <h2>Welcome to Elevate</h2>
        <p>Choose your path to get started</p>
        <Link to="/StudentLogin">
          <button className="landing-button">Student Login</button>
        </Link>
        <Link to="/MentorLogin">
          <button className="landing-button">Mentor Login</button>
        </Link>
      </div>
    </div>
  );
}
