import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "./components/Login";
import { SignupScreen } from "./components/Signup";
import { ConcertRecommendations } from "./components/Concert";
import './styles/index.css';

function App() {
const [currentScreen, setCurrentScreen] = useState("login");

  const handleLogin = () => {
    setCurrentScreen("recommendations");
  };

  const handleGoToSignup = () => {
    setCurrentScreen("signup");
  };

  const handleGoToLogin = () => {
    setCurrentScreen("login");
  };

  const handleSignupComplete = () => {
    setCurrentScreen("recommendations");
  };

  return (
    <BrowserRouter>
      <div className="size-full">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />

          <Route
            path="/recommendations"
            element={<ConcertRecommendations />}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
