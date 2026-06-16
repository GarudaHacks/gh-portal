import Auth from "./components/Auth";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Mentorship from "./pages/Mentorship";
import Faq from "./pages/Faq";
import { UserApplicationStatus } from "./types/applicationStatus";
import Rsvp from "./pages/Rsvp";
import MentoringPage from "./pages/Mentoring";
import BookMentorshipPage from "./pages/BookMentorship";
import AllSchedulePage from "./pages/AllSchedules";
import MentorshipDetailPage from "./pages/MentorshipDetail";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import DiscordCallback from "./components/DiscordCallback";
import Application from "./pages/Application";
import Account from "./pages/Account";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, applicationStatus, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const mentorAllowedRoutes = ["/home", "/mentoring", "/schedules", "/mentoring/*", "/mentors/*"];

  if (role === "mentor" && !mentorAllowedRoutes.includes(location.pathname)) {
    return <Navigate to="/home" />;
  }

  if (role !== "mentor") {
    const isRestrictedPage = ["/schedule", "/ticket", "/mentorship"].includes(
      location.pathname
    );
    const canAccessRestrictedPages =
      applicationStatus === UserApplicationStatus.ACCEPTED ||
      applicationStatus === UserApplicationStatus.CONFIRMED_RSVP;

    if (isRestrictedPage && !canAccessRestrictedPages) {
      return <Navigate to="/home" />;
    }
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Routes>
            <Route path="/auth/discord/callback" element={<DiscordCallback />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/application"
              element={
                <ProtectedRoute>
                  <Application />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentorship"
              element={
                <ProtectedRoute>
                  <Mentorship />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/mentors/:mentorId"
              element={
                <ProtectedRoute>
                  <BookMentorshipPage />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/mentoring"
              element={
                <ProtectedRoute>
                  <MentoringPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentoring/:id"
              element={
                <ProtectedRoute>
                  <MentorshipDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedules"
              element={
                <ProtectedRoute>
                  <AllSchedulePage />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <Faq />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/rsvp"
              element={
                <ProtectedRoute>
                  <Rsvp />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
