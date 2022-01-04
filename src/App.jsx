import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useAuthContext } from "./contexts/AuthContext";

function App() {
  const { currentUser } = useAuthContext();

  return (
    <div>
      <Routes>
        <Route path="/" element={currentUser ? <HomePage /> : <LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
