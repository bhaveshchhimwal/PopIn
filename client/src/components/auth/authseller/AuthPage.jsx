import React, { useState } from "react";
import { SellerLoginFormUI } from "./UI/LoginFormUI.jsx";
import { SellerRegisterFormUI } from "./UI/RegisterFormUI.jsx";
import { createAuthHandler } from "./functions/authHandler.js";
import { useToast } from "../../../context/ToastContext.jsx";
import Logo from "../../logo/Logo.jsx";
import { SellerHero } from "./UI/SellerHero.jsx";
export function SellerLoginForm({ onSuccess, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const handleLogin = createAuthHandler({
    endpoint: "/admin/login",
    getPayload: () => ({ workEmail: email, password }),
    onSuccess: (data) => {
      showToast?.("Logged in successfully!", "success");
      onSuccess?.(data);
    },
    showToast,
  });

  return (
    <SellerLoginFormUI
      email={email}
      password={password}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleLogin}
      onSwitchMode={() => setMode("register")}
    />
  );
}
export function SellerRegisterForm({ onSuccess, setMode }) {
  const [orgName, setOrgName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();

  // Optional validation
  const validate = () => {
    if (password !== confirmPassword) {
      showToast?.("Passwords do not match!", "error");
      return false;
    }
    return true;
  };

  const handleRegister = createAuthHandler({
    endpoint: "/admin/signup",
    getPayload: () => ({
      organizationName: orgName,
      fullName: fullName,
      workEmail: email,
      password,
    }),
    validate,
    onSuccess: (data) => {
      showToast?.("Account created successfully!", "success");
      onSuccess?.(data);
    },
    showToast,
  });

  return (
    <SellerRegisterFormUI
      orgName={orgName}
      fullName={fullName}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      onOrgChange={(e) => setOrgName(e.target.value)}
      onFullNameChange={(e) => setFullName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      onSubmit={handleRegister}
      onSwitchMode={() => setMode("login")}
    />
  );
}

export default function AuthLayoutSeller({ defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const heading = mode === "login" ? "Login —" : "Create account —";

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">

      <header className="flex justify-between items-center px-4 py-2 shadow-sm bg-white sticky top-0 z-10">
        <Logo />
        <nav className="flex items-center space-x-3">
          <a href="/" className="text-slate-600 hover:text-slate-900 text-sm sm:text-base">Home</a>
          <img src="/src/assets/profile.png" alt="Login" className="w-6 h-6 sm:w-8 sm:h-8" />
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 mt-10 sm:mt-16">
        <div className="w-full max-w-md space-y-6"> {/* match form width */}
          <SellerHero /> {/* now same width as form */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-800 text-center sm:text-left">
            {heading}
          </h1>
          {mode === "login" ? (
            <SellerLoginForm onSuccess={() => { }} setMode={setMode} />
          ) : (
            <SellerRegisterForm onSuccess={() => { }} setMode={setMode} />
          )}
        </div>
      </main>


      <footer className="text-center py-3 sm:py-4 bg-gray-50 text-gray-600 text-sm sm:text-base mt-auto">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
}

