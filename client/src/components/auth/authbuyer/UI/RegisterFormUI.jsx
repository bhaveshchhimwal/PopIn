
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
        <form className="space-y-5 max-w-xl" onSubmit={onSubmit}>
            <input
                type="text"
                value={name}
                onChange={onNameChange}
                placeholder="Full name"
                className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
                required
            />
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
            <input
                type="password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                placeholder="Confirm password"
                className="w-full border border-slate-300 focus:border-slate-700 focus:ring-0 px-4 py-3 text-base placeholder-slate-400"
                required
            />

            <div className="flex items-center gap-4">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-slate-500 text-sm">or</span>
                <div className="h-px bg-slate-200 flex-1" />
            </div>

            <button
                type="button"
                onClick={onGoogleLogin}
                className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-base py-3 inline-flex items-center justify-center gap-2"
            >
                <FcGoogle className="text-xl" />
                Continue with Google
            </button>

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
