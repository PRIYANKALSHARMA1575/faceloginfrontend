import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js";
import "./MentorRegistration.css";

export default function MentorRegistration() {
  const [username, setUsername] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [age, setAge] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loginMethod, setLoginMethod] = useState("face");
  const [password, setPassword] = useState("");
  const [loadingModels, setLoadingModels] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition");
      setLoadingModels(false);
    };
    loadModels();
  }, []);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleAddSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const handleRegister = async () => {
    try {
      let descriptor = null;

      if (loginMethod === "face" && capturedImage) {
        const img = await faceapi.fetchImage(capturedImage);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          alert("No face detected. Please try again.");
          return;
        }

        descriptor = Array.from(detection.descriptor);
      }

      await axios.post("http://localhost:5000/api/mentors/register", {
        username,
        officialName,
        age,
        subjects,
        loginMethod,
        password,
        descriptor,
      });

      alert("Mentor registered successfully!");
      navigate("/MentorLogin");
    } catch (error) {
      console.error(error);
      alert("Error during registration");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Mentor Registration</h2>
        {loadingModels ? (
          <p>Loading face models...</p>
        ) : (
          <>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Official Name</label>
              <input
                type="text"
                placeholder="Enter official name"
                value={officialName}
                onChange={(e) => setOfficialName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Subjects</label>
              <div className="subject-input-group">
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="form-input"
                />
                <button onClick={handleAddSubject}>Add</button>
              </div>
              <ul>
                {subjects.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>

            <div className="method-select">
              <label>
                <input
                  type="radio"
                  value="face"
                  checked={loginMethod === "face"}
                  onChange={() => setLoginMethod("face")}
                />
                Face
              </label>
              <label>
                <input
                  type="radio"
                  value="text"
                  checked={loginMethod === "text"}
                  onChange={() => setLoginMethod("text")}
                />
                Text
              </label>
            </div>

            {loginMethod === "text" && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            {loginMethod === "face" && (
              <>
                {!capturedImage ? (
                  <div className="camera-wrapper">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="webcam-view"
                    />
                  </div>
                ) : (
                  <div className="camera-wrapper">
                    <img src={capturedImage} alt="Captured" className="preview-image" />
                  </div>
                )}
                {!capturedImage ? (
                  <button onClick={captureImage} className="capture-button">
                    Take Snap
                  </button>
                ) : (
                  <button onClick={() => setCapturedImage(null)} className="capture-button">
                    Retake
                  </button>
                )}
              </>
            )}

            <button onClick={handleRegister} className="register-button">
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
