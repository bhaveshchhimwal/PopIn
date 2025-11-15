import React from "react";
import { FcGoogle } from "react-icons/fc";

export function RegisterFormUI({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onGoogleLogin,
  onSwitchMode,
}) {
  return (
    <form
      className="space-y-5 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4 sm:px-6 md:px-0"
      onSubmit={onSubmit}
    >
      {/* Full Name */}
      <input
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="Full name"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-md px-4 py-3 sm:py-3.5 text-base placeholder-slate-400 transition-all duration-150"
        required
      />

      {/* Email */}
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-md px-4 py-3 sm:py-3.5 text-base placeholder-slate-400 transition-all duration-150"
        required
      />

      {/* Password */}
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-md px-4 py-3 sm:py-3.5 text-base placeholder-slate-400 transition-all duration-150"
        required
      />

      {/* Confirm Password */}
      <input
        type="password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        placeholder="Confirm password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-md px-4 py-3 sm:py-3.5 text-base placeholder-slate-400 transition-all duration-150"
        required
      />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-slate-500 text-sm">or</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-md inline-flex items-center justify-center gap-2 transition-all duration-150 shadow-sm hover:shadow-md"
      >
        <FcGoogle className="text-xl sm:text-2xl" />
        Continue with Google
      </button>

      {/* Switch to Login */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 text-sm sm:text-base">
        <button
          type="button"
          onClick={onSwitchMode}
          className="underline underline-offset-2 hover:text-slate-900 transition-colors"
        >
          Already have an account? Login
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-md transition-all duration-150 shadow-sm hover:shadow-md"
      >
        Create account
      </button>
    </form>
  );
}
