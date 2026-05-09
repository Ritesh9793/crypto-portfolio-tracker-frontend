import { AlertTriangle, ArrowLeft, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";

export default function DemoLogInPage() {
  const navigate = useNavigate();

  return (
    <AuthShell
      badge="Demo status"
      title="The demo environment is currently unavailable."
      description="The main portfolio application is ready, but the shared demo mode is under maintenance right now."
    >
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(250,204,21,0.1)] text-[#fcd34d]">
          <AlertTriangle size={30} />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
          Service unavailable
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
          The demo environment is under maintenance. Please use the normal login
          flow or return later.
        </p>

        <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(211,155,52,0.1)] text-[#d39b34]">
          <Wrench size={22} />
        </div>

        <button
          onClick={() => navigate("/login")}
          className="app-button-primary mt-8 w-full px-6 py-3"
        >
          <ArrowLeft size={18} />
          Back to login
        </button>
      </div>
    </AuthShell>
  );
}
