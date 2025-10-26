
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
    <form className="space-y-5 max-w-xl" onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Email"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />

      <div className="flex items-center justify-between text-slate-700 text-sm md:text-base">
        <span />
        <button
          type="button"
          onClick={onSwitchMode}
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
