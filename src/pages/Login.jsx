import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userName", res.data.name);
        navigate("/dashboard");
      } else {
        alert("Login failed. No token received.");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <AuthShell
      badge="Access your workspace"
      title="Sign in to your crypto portfolio workspace."
      description="Continue to holdings, live pricing, risk review, exchange sync, and reporting from one minimalist dashboard."
    >
      <div>
        <span className="app-badge">Secure portfolio access</span>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
          Welcome back
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
          Sign in to continue reviewing your portfolio activity and market risk.
        </p>

        <div className="mt-8 flex overflow-hidden rounded-2xl border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)]">
          <button className="w-1/2 bg-[rgba(211,155,52,0.12)] px-4 py-3 text-sm font-semibold text-[#f7f2e8]">
            Sign in
          </button>
          <Link
            to="/register"
            className="w-1/2 px-4 py-3 text-center text-sm font-medium text-[#cbbca5] transition hover:text-[#f7f2e8]"
          >
            Create account
          </Link>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            onChange={setEmail}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            onChange={setPassword}
          />

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#e2b768] transition hover:text-[#f7f2e8]"
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="app-button-primary mt-2 w-full px-6 py-3">
            Sign in
          </button>
        </form>

        <button
          onClick={() => navigate("/demo-login")}
          className="app-button-secondary mt-3 w-full px-6 py-3 text-sm font-semibold text-[#f7f2e8]"
        >
          <Sparkles size={18} className="text-[#d39b34]" />
          Enter demo mode
        </button>

        <p className="mt-5 text-center text-sm text-[#9d8c73]">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-[#e2b768]">
            Register here
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
