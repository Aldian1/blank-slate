import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Files from "./pages/Files.jsx";
import { SupabaseAuthProvider, useSupabaseAuth } from "./integrations/supabase/auth.jsx";
import Navbar from "./components/Navbar.jsx";

function PrivateRoute({ children }) {
  const { session } = useSupabaseAuth();
  return session ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/files" element={<Files />} />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  );
}

export default App;