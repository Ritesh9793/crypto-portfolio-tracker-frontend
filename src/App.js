import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import AiAssistant from "./components/AiAssistant";
import DemoBadge from "./components/DemoBadge";
import ProtectedRoute from "./components/ProtectedRoute";
import { DemoProvider } from "./context/DemoContext";

import AddExchange from "./pages/AddExchange";
import Dashboard from "./pages/Dashboard";
import DemoLogInPage from "./pages/DemoLogInPage";
import Exchange from "./pages/Exchange";
import ForgotPassword from "./pages/ForgotPassword";
import Holdings from "./pages/Holdings";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PnLReports from "./pages/PnLReports";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import RiskAlerts from "./pages/RiskAlerts";
import Trades from "./pages/Trades";

function App() {
  return (
    <DemoProvider>
      <DemoBadge />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#22170a",
            color: "#f7f2e8",
            border: "1px solid rgba(226, 183, 104, 0.16)",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/demo-login" element={<DemoLogInPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/risk-alerts" element={<RiskAlerts />} />
          <Route path="/pnl-reports" element={<PnLReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-exchange" element={<AddExchange />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DemoProvider>
  );
}

export default App;
