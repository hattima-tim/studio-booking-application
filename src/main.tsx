import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import BookingsPage from "./pages/bookings.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
