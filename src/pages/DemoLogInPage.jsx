import { motion } from "framer-motion";
import { MdBuild, MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function DemoLogInPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="flex justify-center mb-4 text-yellow-400">
          <MdErrorOutline size={48} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Service Unavailable
        </h1>

        <p className="text-gray-400 mb-6">
          The demo environment is currently under maintenance.
          Please check back later.
        </p>

        <div className="flex justify-center mb-6 text-pink-500">
          <MdBuild size={40} />
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
