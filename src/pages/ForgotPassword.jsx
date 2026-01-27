
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

/* Background */
const AnimatedBackground = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-slate-950" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,55,72,0.4)_0%,_rgba(15,23,42,0.9)_100%)]" />
    <div className="absolute w-[700px] h-[700px] -top-40 -right-40 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
    <div className="absolute w-[600px] h-[600px] -bottom-40 -left-40 bg-sky-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
  </div>
);

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link sent. Check your email.");
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatedBackground />

      <Toaster position="top-right" />

      <motion.div
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {submitted ? (
          <div className="text-center space-y-4">
            <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Check your email</h2>
            <p className="text-slate-400">
              A reset link was sent to{" "}
              <span className="from-purple-500 to-violet-600 font-semibold">{email}</span>
            </p>

            <motion.button
              type="button"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Login
            </motion.button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <EnvelopeIcon className="w-12 h-12 from-pink-500 to-pink-400 mx-auto mb-3" />
              <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
              <p className="text-slate-400 text-sm">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <EnvelopeIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div> 

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-violet-700 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-slate-400 hover:text-violet-600 font-semibold"
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
