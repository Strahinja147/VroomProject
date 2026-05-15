import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

// DODAJ OVO:
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // OBMOTAJ SA AuthProvider
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={
           <ProtectedRoute>
           <AdminLayout />
           </ProtectedRoute> }/>
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/admin/index" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);