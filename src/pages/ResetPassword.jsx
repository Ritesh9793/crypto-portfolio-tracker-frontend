import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthShell from "../components/AuthShell";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <AuthShell
        badge="Reset unavailable"
        title="The reset link is incomplete."
        description="Open the password reset link again from your email to continue."
      >
        <div className="rounded-2xl border border-[rgba(239,68,68,0.2)] bg-[rgba(127,29,29,0.14)] p-5 text-sm text-[#fecaca]">
          Invalid or missing reset token.
        </div>
      </AuthShell>
    );
  }

  const handleReset = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.error(
        "This backend currently supports forgot-password requests only. Reset completion is not available yet.",
      );
    }, 250);
  };

  return (
    <AuthShell
      badge="Choose a new password"
      title="Reset your password and return to the workspace."
      description="Use a strong password so you can get back to your portfolio, reports, and risk review securely."
    >
      <div>
        <span className="app-badge">Password reset</span>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
          Reset password
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
          The frontend can collect the new password, but the current backend README
          only documents `POST /api/auth/forgot-password` and does not expose a
          reset completion endpoint yet.
        </p>

        <div className="mt-5 rounded-2xl border border-[rgba(250,204,21,0.18)] bg-[rgba(113,63,18,0.14)] p-4 text-sm leading-6 text-[#fde68a]">
          When the backend adds the reset completion API, this screen can be wired
          back to submit the token and new password.
        </div>

        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-[#cbbca5]">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="app-input px-4 py-3"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="app-button-primary w-full px-6 py-3 disabled:opacity-60"
          >
            {loading ? "Checking backend support..." : "Reset password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="mt-5 text-sm font-medium text-[#e2b768] transition hover:text-[#f7f2e8]"
        >
          Back to forgot password
        </button>
      </div>
    </AuthShell>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#cbbca5]">{label}</label>
      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d8c73]"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="app-input w-full py-3 pl-11 pr-11"
          placeholder="Enter a new password"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d8c73] transition hover:text-[#f7f2e8]"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );
}
