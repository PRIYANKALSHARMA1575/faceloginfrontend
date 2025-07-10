import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/students/StudentLogin"
import MentorLogin from  "./pages/mentors/MentorLogin"
import StudentRegistration from  "./pages/students/StudentRegistration"
import MentorRegistration from "./pages/mentors/MentorRegistration"
import StudentDashboard from  "./pages/students/StudentDashboard"
import MentorDashboard from  "./pages/mentors/MentorDashboard"


function App(){
   return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/MentorLogin" element={<MentorLogin />} />
        <Route path="/StudentRegistration" element={<StudentRegistration />} />
        <Route path="/MentorRegistration" element={<MentorRegistration />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route pat="/MentorDashboard" element={<MentorDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;