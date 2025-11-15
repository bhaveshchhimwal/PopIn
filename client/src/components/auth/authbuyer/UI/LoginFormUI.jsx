import React from "react";
import { FcGoogle } from "react-icons/fc";

export function LoginFormUI({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
  onGoogleLogin,
}) {
  return (
    <form
      className="space-y-5 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4 sm:px-6 md:px-0"
      onSubmit={onSubmit}
    >
      {/* Email Input */}
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-md px-4 py-3 sm:py-3.5 text-base placeholder-slate-400 transition-all duration-150"
        required
      />

      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-md px-4 py-3 sm:py-3.5 text-base placeholder-slate-400 transition-all duration-150"
        required
      />

      {/* Switch to Register */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 text-sm sm:text-base">
        <button
          type="button"
          onClick={onSwitchMode}
          className="underline underline-offset-2 hover:text-slate-900 transition-colors"
        >
          Create account
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-md transition-all duration-150 shadow-sm hover:shadow-md"
      >
        Login
      </button>

      {/* Google Login */}
      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-md inline-flex items-center justify-center gap-2 transition-all duration-150 shadow-sm hover:shadow-md"
      >
        <FcGoogle className="text-xl sm:text-2xl" />
        Continue with Google
      </button>
    </form>
  );
}
