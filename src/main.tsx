import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { inject } from "@vercel/analytics";

// Initialize Vercel Analytics
inject();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Toaster />
		<App />
	</StrictMode>
);
