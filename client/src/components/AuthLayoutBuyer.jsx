import React, { useState } from "react";
import Logo from "../Logo";
import { FcGoogle } from "react-icons/fc";

<button
  type="button"
  className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-base py-3 inline-flex items-center justify-center gap-2"
>
  <FcGoogle className="text-xl" />
  Continue with Google
</button>


function LoginForm({ onSuccess, setMode }) {
  return (
    <form
      className="space-y-5 max-w-xl"
      onSubmit={(e) => { e.preventDefault(); onSuccess?.(); }}
    >
      <input
        type="email"
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="password"
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
    </form>
  );
}

function RegisterForm({ onSuccess, setMode }) {
  return (
    <form
      className="space-y-5 max-w-xl"
      onSubmit={(e) => { e.preventDefault(); onSuccess?.(); }}
    >
      <input
        type="text"
        placeholder="Full name"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
        minLength={6}
      />
      <input
        type="password"
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
          <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-5">
            {heading}
          </h1>
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
