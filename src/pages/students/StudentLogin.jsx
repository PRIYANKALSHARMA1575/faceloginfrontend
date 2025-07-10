import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentLogin.css";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [loginMethod, setLoginMethod] = useState("face");
  const [password, setPassword] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [loadingModels, setLoadingModels] = useState(true);

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68");
await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition");

        setLoadingModels(false);
      } catch (err) {
        console.error("Error loading face-api models:", err);
      }
    };
    loadModels();
  }, []);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleLogin = async () => {
  try {
    let descriptorArray = null;

    if (loginMethod === "face" && capturedImage) {
      const img = await faceapi.fetchImage(capturedImage);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected");
        return;
      }

      descriptorArray = Array.from(detection.descriptor);
    }

    const body = {
      username,
      loginMethod,
      password,
      descriptor: descriptorArray,
    };

    const res = await axios.post("http://localhost:5000/api/students/login", body);

    if (res.data.message === "Login successful") {
      alert("Login successful!");
      navigate("/StudentDashboard");
    } else {
      alert("Login failed: " + res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Login error");
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Student Login</h2>

        {loadingModels ? (
          <p>Loading face models...</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />

            {loginMethod === "text" && (
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            )}

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

            {loginMethod === "face" && (
              <>
                {!capturedImage ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="webcam"
                    />
                    <button onClick={captureImage} className="capture-button">Take Snap</button>
                  </>
                ) : (
                  <>
                    <img src={capturedImage} alt="Captured" className="preview-image" />
                    <button onClick={() => setCapturedImage(null)} className="capture-button">Retake</button>
                  </>
                )}
              </>
            )}

            <button onClick={handleLogin} className="login-button">Login</button>

            <p className="register-link">
              Not registered? <Link to="/StudentRegistration">Register here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
