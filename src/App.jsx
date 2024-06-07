import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Files from "./pages/Files.jsx";
import { SupabaseAuthProvider, useSupabaseAuth } from "./integrations/supabase/auth.jsx";
import Navbar from "./components/Navbar.jsx";

function PrivateRoute({ children }) {
  const { session } = useSupabaseAuth();
  return session ? children : <Navigate to="/" />;
}

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/files" element={<PrivateRoute><Files /></PrivateRoute>} />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  );
}

export default App;