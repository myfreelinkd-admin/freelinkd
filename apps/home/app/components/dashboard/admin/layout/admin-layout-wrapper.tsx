"use client";

import { ReactNode } from "react";
import {
  AdminAuthProvider,
  AdminProtectedRoute,
} from "@/app/lib/auth/admin-auth";

interface AdminLayoutWrapperProps {
  children: ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutWrapperProps) {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute redirectTo="/admin/login">
        {children}
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
}
