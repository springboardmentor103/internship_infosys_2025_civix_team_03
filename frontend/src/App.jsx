
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage";
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
import { PetitionProvider } from "./PetitionContext";
import OfficialsDashboardPage from "./pages/OfficialsDashboardPage";

function App() {
  return (
    <PetitionProvider>
      <Routes>
         <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/petitions" element={<PetitionCreation />} /> 
        <Route path="/all-petitions" element={<AllPetitions />} />
         <Route path="/polls" element={<PollsDashboard />} />
         <Route path="/poll-creation" element={<PollCreation />} />
          <Route path="/reports" element={<ReportsDashboard/>} />
            <Route path="/petitions/:id" element={<PetitionDetails />} />
            <Route path="/officials-dashboard" element={<OfficialsDashboardPage />} />

      </Routes>
      </PetitionProvider>
   
  );
}

export default App;
