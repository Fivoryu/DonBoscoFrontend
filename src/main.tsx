// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  useRoutes,
} from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Routes } from "./Routes";
import { AuthProvider } from "./app/contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  // hook interno que monta todas las rutas
  const element = useRoutes(Routes);
  return element;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
