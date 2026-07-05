import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SchoolsPage } from "./pages/SchoolsPage";
import { CampusesPage } from "./pages/CampusesPage";
import { AdminsPage } from "./pages/AdminsPage";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotificationsPage } from "./pages/NotificationsPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/schools", element: <SchoolsPage /> },
      { path: "/campuses", element: <CampusesPage /> },
      { path: "/admins", element: <AdminsPage /> },
      { path: "/subscriptions", element: <SubscriptionsPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
