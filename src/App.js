import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Holdings from "./pages/Holdings";
import Login from "./pages/Login";
import PnLReports from "./pages/PnLReports";
import Pricing from "./pages/Pricing";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import RiskAlerts from "./pages/RiskAlerts";
import Trades from "./pages/Trades";

function App() {
  return (
    <>
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
      </Routes>
    </>
  );
}

export default App;
