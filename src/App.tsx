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
import Ticketing from "./pages/Ticketing";
import Application from "./pages/Application";
import { UserApplicationStatus } from "./types/applicationStatus";
import Rsvp from "./pages/Rsvp";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, applicationStatus } = useAuth();
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

  // Check if the current route is a restricted page
  const isRestrictedPage = ["/schedule", "/ticket", "/mentorship"].includes(
    location.pathname
  );
  const canAccessRestrictedPages =
    applicationStatus === UserApplicationStatus.ACCEPTED ||
    applicationStatus === UserApplicationStatus.CONFIRMED_RSVP;

  if (isRestrictedPage && !canAccessRestrictedPages) {
    return <Navigate to="/home" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/auth" element={<Auth />} />
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
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket"
            element={
              <ProtectedRoute>
                <Ticketing />
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
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <Faq />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rsvp"
            element={
              <ProtectedRoute>
                <Rsvp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
