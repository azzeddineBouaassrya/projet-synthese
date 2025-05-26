import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fonction de connexion simulée
  const login = async (email, password) => {
    // Simulation d'une API de connexion
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const isAdmin = email.includes("admin");
          const userData = {
            id: 1,
            name: isAdmin ? "Administrateur" : "Utilisateur",
            email,
            role: isAdmin ? "admin" : "user",
          };
          setUser(userData);
          resolve();
        } else {
          reject(new Error("Identifiants invalides"));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};