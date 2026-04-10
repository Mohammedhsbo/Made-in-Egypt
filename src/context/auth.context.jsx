import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.base";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const getMe = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setUser(null);
    setLoading(false);
    return;
  }

  try {
    const res = await api.get("/auth/me");
    setUser(res.data.data.user);
  } catch (err) {
    console.log(err);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getMe();
  }, []);

  
  const login = (userData) => {
    setUser(userData);
  };


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};