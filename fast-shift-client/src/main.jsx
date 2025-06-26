import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./routes/Routes.jsx";
import { RouterProvider } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./AuthContext/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

//  Create QueryClient instance
const queryClient = new QueryClient();

//  Initialize AOS (Animate On Scroll)
AOS.init();

//  Render the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
   <Toaster position="top-center" reverseOrder={false} />
          <div className="font-urbanist max-w-7xl mx-auto">
            <RouterProvider router={router} />
          </div>

      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
