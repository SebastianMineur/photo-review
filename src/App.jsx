import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuthContext } from "./contexts/AuthContext";

function App() {
  const { currentUser } = useAuthContext();

  return (
    <div>
      <Routes>
        <Route path="/" element={currentUser ? <HomePage /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
