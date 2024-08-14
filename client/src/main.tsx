import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "./context/SocketCoktext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
	<SocketProvider>
		<App />
		<Toaster closeButton />
	</SocketProvider>
);
