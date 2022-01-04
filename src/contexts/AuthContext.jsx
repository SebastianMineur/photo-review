import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fake delay for checking auth state
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const values = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? <p>Loading...</p> : props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
