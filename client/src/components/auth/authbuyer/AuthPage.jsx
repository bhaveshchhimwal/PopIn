import React, { useState, useEffect } from "react";
import Logo from "../../logo/Logo.jsx";
import { FcGoogle } from "react-icons/fc";
import axios from "../../../utils/axiosInstance.js";
import { handleGoogleLogin } from "./functions/googleLogin.js";
import { LoginFormUI } from "./UI/LoginFormUI.jsx";
import { RegisterFormUI } from "./UI/RegisterFormUI.jsx";
import { createAuthHandler } from "./functions/authHandler.js";
import { useToast } from "../../../context/ToastContext.jsx";
import { BuyerHero } from "./UI/BuyerHero.jsx";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../../assets/profile.png";

function LoginForm({ onSuccess, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = createAuthHandler({
    endpoint: "/user/login",
    getPayload: () => ({ email, password }),
    onSuccess: (data) => {
      showToast?.("Logged in successfully!", "success");
      navigate("/events", { replace: true });
      onSuccess?.(data);
    },
    showToast,
  });

  return (
    <LoginFormUI
      email={email}
      password={password}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleLogin}
      onSwitchMode={() => setMode("register")}
      onGoogleLogin={() => handleGoogleLogin(showToast, navigate)}
    />
  );
}

function RegisterForm({ onSuccess, setMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = createAuthHandler({
    endpoint: "/user/signup",
    getPayload: () => ({ name, email, password }),
    validate: () => {
      if (password !== confirmPassword) {
        showToast?.("Passwords do not match", "error");
        return false;
      }
      return true;
    },
    onSuccess: (data) => {
      showToast?.("Registration successful!", "success");
      navigate("/events", { replace: true });
      onSuccess?.(data);
    },
    showToast,
  });

  return (
    <RegisterFormUI
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      onNameChange={(e) => setName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      onSubmit={handleRegister}
      onGoogleLogin={() => handleGoogleLogin(showToast, navigate)}
      onSwitchMode={() => setMode("login")}
    />
  );
}

export default function AuthLayout({ defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const heading = mode === "login" ? "Login —" : "Create account —";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/user/me", { withCredentials: true });
        navigate("/events", { replace: true });
      } catch {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center px-4 py-2 shadow-sm bg-white">
        <Logo />
        <nav className="flex items-center space-x-3">
          <a
            href="/"
            className="text-slate-600 hover:text-slate-900 text-sm md:text-base"
          >
            Home
          </a>
          <img src={profileIcon} alt="Login" className="w-6 h-6" />
        </nav>
      </header>

      <main className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-md mt-10 md:mt-20 space-y-6">
          <BuyerHero />
          <h1 className="text-xl md:text-2xl font-serif text-slate-800 text-center">
            {heading}
          </h1>
          {mode === "login" ? (
            <LoginForm onSuccess={() => {}} setMode={setMode} />
          ) : (
            <RegisterForm onSuccess={() => {}} setMode={setMode} />
          )}
        </div>
      </main>

      <footer className="text-center py-3 text-gray-600 text-sm bg-white">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
}
