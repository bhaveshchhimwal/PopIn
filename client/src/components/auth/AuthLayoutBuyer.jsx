import React, { useState } from "react";
import Logo from "../logo/Logo";
import { FcGoogle } from "react-icons/fc";
import axios from "../../utils/axiosInstance.js";

// -------- Login Form --------
function LoginForm({ onSuccess, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/user/login", { email, password });
      console.log("Login success:", data);
      onSuccess?.();
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth logic here
      console.log("Google login clicked");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <form className="space-y-5 max-w-xl" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />

      <div className="flex items-center justify-between text-slate-700 text-sm md:text-base">
        <button
          type="button"
          onClick={() => setMode("register")}
          className="underline underline-offset-2 hover:text-slate-900"
        >
          Create account
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-base py-3"
      >
        Login
      </button>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-base py-3 inline-flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>
    </form>
  );
}

// -------- Register Form --------
function RegisterForm({ onSuccess, setMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      // Replace with your API endpoint
      const { data } = await axios.post("http://localhost:8080/user/signup", {
        name,
        email,
        password,
        confirmPassword
      });
      console.log("Register success:", data);
      onSuccess?.();
    } catch (err) {
      console.error("Register error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth logic here
      console.log("Google register clicked");
    } catch (err) {
      console.error("Google OAuth error:", err);
    }
  };

  return (
    <form className="space-y-5 max-w-xl" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
        minLength={6}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
        minLength={6}
      />

      <div className="flex items-center gap-4">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-slate-500 text-sm">or</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-base py-3 inline-flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>

      <div className="flex items-center justify-between text-slate-700 text-sm md:text-base">
        <span />
        <button
          type="button"
          onClick={() => setMode("login")}
          className="underline underline-offset-2 hover:text-slate-900"
        >
          Already have an account? Login
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-base py-3"
      >
        Create account
      </button>
    </form>
  );
}

// -------- Auth Layout --------
export default function AuthLayout({ defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const heading = mode === "login" ? "Login —" : "Create account —";

  return (
    <div className="font-sans min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-1 md:px-6 py-1 shadow-sm">
        <Logo />
        <nav className="flex items-center space-x-4">
          <a href="/" className="text-slate-600 hover:text-slate-900">
            Home
          </a>
          <img src="/src/assets/profile.png" alt="Login" className="w-6 h-6" />
        </nav>
      </header>

      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-14 md:mt-20">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-5">
            {heading}
          </h1>
          {mode === "login" ? (
            <LoginForm onSuccess={() => {}} setMode={setMode} />
          ) : (
            <RegisterForm onSuccess={() => {}} setMode={setMode} />
          )}
        </div>
      </main>

      <footer className="text-center py-2 bg-gray-50 text-gray-600">
        © {new Date().getFullYear()} PopIn. All rights reserved.
      </footer>
    </div>
  );
}
