import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      alert(error.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Create your workspace"
      title="Start tracking portfolio performance with a cleaner setup."
      description="Create an account to manage holdings, review pricing, inspect risk, and export reports from one consistent interface."
    >
      <div>
        <span className="app-badge">New account setup</span>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
          Create account
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
          Set up your account and start using the portfolio, risk, and reporting
          tools.
        </p>

        {success && (
          <div className="mt-6 rounded-2xl border border-[rgba(74,222,128,0.22)] bg-[rgba(34,197,94,0.08)] px-4 py-3 text-sm text-[#bbf7d0]">
            Account created successfully. Redirecting to login.
          </div>
        )}

        <div className="mt-8 flex overflow-hidden rounded-2xl border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)]">
          <Link
            to="/login"
            className="w-1/2 px-4 py-3 text-center text-sm font-medium text-[#cbbca5] transition hover:text-[#f7f2e8]"
          >
            Sign in
          </Link>
          <button className="w-1/2 bg-[rgba(211,155,52,0.12)] px-4 py-3 text-sm font-semibold text-[#f7f2e8]">
            Create account
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <Input label="Full name" placeholder="Enter your full name" onChange={setName} />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            onChange={setEmail}
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            onChange={setPassword}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            onChange={setConfirmPassword}
          />

          <button
            type="submit"
            disabled={loading || success}
            className="app-button-primary mt-2 w-full px-6 py-3 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/demo-login")}
          className="app-button-secondary mt-3 w-full px-6 py-3 text-sm font-semibold text-[#f7f2e8]"
        >
          <Sparkles size={18} className="text-[#d39b34]" />
          Enter demo mode
        </button>

        <p className="mt-5 text-center text-sm text-[#9d8c73]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#e2b768]">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function Input({ label, type = "text", placeholder, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#cbbca5]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="app-input px-4 py-3"
      />
    </div>
  );
}

function PasswordInput({ label, placeholder, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#cbbca5]">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="app-input w-full px-4 py-3 pr-11"
        />

        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d8c73] transition hover:text-[#f7f2e8]"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );
}
