import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import LoginForm from "./components/AuthenticationForm/LoginForm";
import SignUpForm from "./components/AuthenticationForm/SignUpForm";
import { useState } from "react";
import RefreshHandler from "./util/RefreshHandler";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  return (
    <div className="app">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
