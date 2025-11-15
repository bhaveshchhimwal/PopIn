import React from "react";

export function SellerLoginFormUI({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
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
        placeholder="Work email"
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 text-sm sm:text-base">
        <span className="hidden sm:block" /> 
        <button
          type="button"
          onClick={onSwitchMode}
          className="underline underline-offset-2 hover:text-slate-900 transition-colors"
        >
          Create account
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-md transition-all duration-150 shadow-sm hover:shadow-md"
      >
        Login
      </button>
    </form>
  );
}
