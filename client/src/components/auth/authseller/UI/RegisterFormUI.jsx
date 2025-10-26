
export function SellerRegisterFormUI({
  orgName,
  fullName,
  email,
  password,
  confirmPassword,
  onOrgChange,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onSwitchMode,
}) {
  return (
    <form className="space-y-5 max-w-xl" onSubmit={onSubmit}>
      <input
        type="text"
        value={orgName}
        onChange={onOrgChange}
        placeholder="Organization name"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="text"
        value={fullName}
        onChange={onFullNameChange}
        placeholder="Full name"
        className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
        required
      />
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Work email"
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
      <input
        type="password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        placeholder="Confirm password"
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
