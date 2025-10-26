import React, { useState } from "react";
import Logo from "../../logo/Logo.jsx";
import { FcGoogle } from "react-icons/fc";
import axios from "../../../utils/axiosInstance.js";
import { useEffect } from "react";
import { handleGoogleLogin } from "./functions/googleLogin.js";
import { LoginFormUI } from "./UI/LoginFormUI.jsx";
import { RegisterFormUI } from "./UI/RegisterFormUI.jsx";
import { createAuthHandler } from "./functions/authHandler.js";
import { useToast } from "../../../context/ToastContext.jsx";
function LoginForm({ onSuccess, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast(); 
  const handleLogin = createAuthHandler({
    endpoint: "/user/login",
    payload: { email, password },
    onSuccess: () => console.log("Redirect or update state"),
    showToast, // pass the toast function
  });

  return (
    <LoginFormUI
      email={email}
      password={password}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleLogin}
      onSwitchMode={() => setMode("register")}
      onGoogleLogin={() => handleGoogleLogin(showToast)}
    />
  );
}
function RegisterForm({ onSuccess, setMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const { showToast } = useToast(); 
  const handleRegister = createAuthHandler({
    endpoint: "/user/signup",
    getPayload: () => ({ name, email, password }), // send only actual password
    validate: () => {
      if (password !== confirmPassword) {
        showToast?.("Passwords do not match", "error"); // frontend toast
        return false; // prevent submission
      }
      return true;
    },
    onSuccess: () => console.log("Registration success!"),
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
      onGoogleLogin={() => handleGoogleLogin(showToast)}
      onSwitchMode={() => setMode("login")}
    />
  );
}

export default function AuthLayout({ defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const heading = mode === "login" ? "Login —" : "Create account —";

  return (
    <div className="font-sans min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-1 md:px-6 py-1 shadow-sm">
        <Logo />
        <nav className="flex items-center space-x-4">
          <a href="/" className="text-slate-600 hover:text-slate-900">Home</a>
          <img src="/src/assets/profile.png" alt="Login" className="w-6 h-6" />
        </nav>
      </header>
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-14 md:mt-20">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-5">{heading}</h1>
          {mode === "login" ? (
            <LoginForm onSuccess={() => { }} setMode={setMode} />
          ) : (
            <RegisterForm onSuccess={() => { }} setMode={setMode} />
          )}
        </div>
      </main>
      <footer className="text-center py-2 bg-gray-50 text-gray-600">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
}

