import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import AiAssistant from "./components/AiAssistant";
import DemoBadge from "./components/DemoBadge";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { DemoProvider } from "./context/DemoContext";
import Dashboard from "./pages/Dashboard";
import Exchange from "./pages/Exchange";
import ForgotPassword from "./pages/ForgotPassword";
import Holdings from "./pages/Holdings";
import Login from "./pages/Login";
import PnLReports from "./pages/PnLReports";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import RiskAlerts from "./pages/RiskAlerts";
import Trades from "./pages/Trades";
import AddExchange from "./pages/AddExchange";

function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <DemoBadge />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/risk-alerts" element={<RiskAlerts />} />
          <Route path="/pnl-reports" element={<PnLReports />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AiAssistant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-exchange"
            element={
              <ProtectedRoute>
                <AddExchange />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;
