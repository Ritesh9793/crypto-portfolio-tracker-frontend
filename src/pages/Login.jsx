import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Sparkles, Eye, EyeOff } from "lucide-react";

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
        alert("Login failed — No token received!");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };
  const handleTryDemo = () => {
    navigate("/demo-login");
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 flex-col gap-12 p-16 bg-gradient-to-br from-purple-900/40 via-black to-black">
        <div>
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-purple-600/20 text-purple-400 text-sm mb-6">
            🚀 Join CryptoVault
          </span>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Start Your <br />
            <span className="text-purple-400">Crypto Adventure</span>
          </h1>

          <p className="text-gray-400 max-w-md">
            Join thousands of investors who trust CryptoVault for professional
            portfolio management and insights.
          </p>
        </div>

        <div className="space-y-4">
          <Feature
            title="Secure & Private"
            desc="Bank-grade encryption for your data"
          />
          <Feature
            title="Smart Insights"
            desc="AI-powered portfolio recommendations"
          />
          <Feature
            title="Real-time Tracking"
            desc="Live updates across 500+ assets"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-6">
            Sign in to continue to your portfolio
          </p>

          {/* Toggle */}
          <div className="flex bg-white/10 rounded-lg mb-6 overflow-hidden">
            <button className="w-1/2 py-2 bg-black text-white font-semibold">
              Sign In
            </button>
            <Link
              to="/register"
              className="w-1/2 py-2 text-center text-gray-400 hover:text-white"
            >
              Create Account
            </Link>
          </div>

          {/* FORM */}
          {/* FORM */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              onChange={setEmail}
            />

            <PasswordInput
              label="Password"
              placeholder="••••••••"
              onChange={setPassword}
            />
            <p className="text-sm text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-purple-400 hover:underline"
              >
                Forgot password?
              </Link>
            </p>

            <button
              type="submit"
              className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {/* Demo Mode */}
          <button
            onClick={handleTryDemo}
            className="w-full mt-3 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="text-purple-400" />
            Enter Demo Mode
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Components */

function Feature({ title, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
        ⭐
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function Input({ label, type = "text", placeholder, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

function PasswordInput({ label, placeholder, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full p-3 pr-10 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {!show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

