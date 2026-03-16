import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Add from "./pages/Add";
import View from "./pages/View";
import Report from "./pages/Report";

// Protected Route
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Default → Login */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Pages */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Navbar />
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/add"
        element={
          <PrivateRoute>
            <Navbar />
            <Add />
          </PrivateRoute>
        }
      />

      <Route
        path="/view"
        element={
          <PrivateRoute>
            <Navbar />
            <View />
          </PrivateRoute>
        }
      />

      <Route
        path="/report"
        element={
          <PrivateRoute>
            <Navbar />
            <Report />
          </PrivateRoute>
        }
      />

      {/* Any unknown URL → Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
