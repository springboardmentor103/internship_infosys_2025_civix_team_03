import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage"; // Corrected import
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PetitionCreation from "./pages/PetitionCreation";
import PollsDashboard from "./pages/PollsDashboard";
import AllPetitions from "./pages/AllPetitions";
import PollCreation from "./pages/PollCreation";
import ReportsDashboard from "./pages/ReportsDashboard";
import PetitionDetails from "./pages/PetitionDetails";
import { PetitionProvider } from "./contexts/PetitionContext";
import ErrorBoundary from "./components/ErrorBoundary";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/all-petitions" element={<AllPetitions />} />
        <Route path="/polls" element={<PollsDashboard />} />
        <Route path="/poll-creation" element={<PollCreation />} />
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/petitions/:id" element={<PetitionDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/petitions"
          element={
            <ProtectedRoute>
              <PetitionCreation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetitionProvider>
          <AppContent />
        </PetitionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;