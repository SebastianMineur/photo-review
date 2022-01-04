import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoadingPage from "../pages/LoadingPage";

const AuthContext = createContext();

const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = (props) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const values = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? <LoadingPage /> : props.children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider as default };
