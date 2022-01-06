import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AlbumPage from "./pages/AlbumPage";
import ReviewPage from "./pages/ReviewPage";
import Navbar from "./pages/partials/Navbar";
import { useAuthContext } from "./contexts/AuthContext";

function App() {
  const { currentUser } = useAuthContext();

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={currentUser ? <HomePage /> : <LoginPage />} />

        <Route
          path="/register"
          element={!currentUser ? <RegisterPage /> : <Navigate to="/" />}
        />

        <Route
          path="/albums/:albumId"
          element={currentUser ? <AlbumPage /> : <Navigate to="/" />}
        />

        <Route path="/review/:userId/:albumId" element={<ReviewPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
