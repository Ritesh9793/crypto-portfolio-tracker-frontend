import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { DemoContext } from "../context/DemoContext";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const { isDemo } = useContext(DemoContext);

  if (!token && !isDemo) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

