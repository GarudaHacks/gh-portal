import Auth from "./components/Auth";
// @ts-ignore
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Ticket from "./pages/Ticketing";
import Mentorship from "./pages/Mentorship";
import Faq from "./pages/Faq";
import Ticketing from "./pages/Ticketing";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user } = useAuth();
	return user ? children : <Navigate to="/auth" />;
};

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/auth"
						element={<Auth />}
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
						path="*"
						element={<Navigate to="/auth" />}
					/>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
