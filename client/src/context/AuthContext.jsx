import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };
   const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user"); // Clear user from localStorage
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);
 
  return (
    <AuthContext.Provider value={{ currentUser,updateUser,logout }}>
      {children}
    </AuthContext.Provider>
  );
};