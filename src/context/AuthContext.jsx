import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (authResponse) => {
    if (!authResponse?.token) {
      return;
    }

    setToken(authResponse.token);
    setIsAuthenticated(true);
    localStorage.setItem("token", authResponse.token);

    if (authResponse.refreshToken) {
      localStorage.setItem("refreshToken", authResponse.refreshToken);
    }
    if (authResponse.email) {
      localStorage.setItem("userEmail", authResponse.email);
    }
    if (authResponse.name) {
      localStorage.setItem("userName", authResponse.name);
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
