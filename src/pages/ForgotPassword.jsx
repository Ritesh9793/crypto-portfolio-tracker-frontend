import { ArrowLeft, MailCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link sent. Check your email.");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Password recovery"
      title="Recover access without leaving the portfolio flow behind."
      description="Request a secure reset link and get back to your dashboard, exchange setup, and portfolio analysis."
    >
      {submitted ? (
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(34,197,94,0.1)] text-[#86efac]">
            <MailCheck size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
            Check your email
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
            A reset link was sent to <span className="text-[#f7f2e8]">{email}</span>.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="app-button-primary mt-8 w-full px-6 py-3"
          >
            <ArrowLeft size={18} />
            Back to login
          </button>
        </div>
      ) : (
        <div>
          <span className="app-badge">Reset access</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
            Forgot password
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
            Enter the email linked to your account and we will send a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#cbbca5]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="app-input px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="app-button-primary w-full px-6 py-3 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#e2b768] transition hover:text-[#f7f2e8]"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
        </div>
      )}
    </AuthShell>
  );
}
