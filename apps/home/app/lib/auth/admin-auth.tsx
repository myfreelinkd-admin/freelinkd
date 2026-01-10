"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// Admin user type
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

// Auth context type
interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: AdminUser, remember?: boolean) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

// Create context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY = "admin_user";
const AUTH_KEY = "admin_logged_in";

/**
 * Admin Auth Provider
 * Manages authentication state for admin users
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAndLoadUser();
  }, []);

  // Load user from storage
  const checkAndLoadUser = () => {
    try {
      // Check localStorage first, then sessionStorage
      let userData = localStorage.getItem(STORAGE_KEY);
      let isLoggedIn = localStorage.getItem(AUTH_KEY);

      if (!userData || !isLoggedIn) {
        userData = sessionStorage.getItem(STORAGE_KEY);
        isLoggedIn = sessionStorage.getItem(AUTH_KEY);
      }

      if (userData && isLoggedIn === "true") {
        const parsedUser = JSON.parse(userData) as AdminUser;
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      // Clear invalid data
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  // Clear auth data from storage
  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  };

  // Login - store user data
  const login = (userData: AdminUser, remember: boolean = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(userData));
    storage.setItem(AUTH_KEY, "true");
    setUser(userData);
  };

  // Logout - clear user data
  const logout = () => {
    clearAuthData();
    setUser(null);
    router.push("/admin/login");
  };

  // Check if authenticated
  const checkAuth = (): boolean => {
    if (user) return true;

    try {
      const localUser = localStorage.getItem(STORAGE_KEY);
      const localAuth = localStorage.getItem(AUTH_KEY);
      const sessionUser = sessionStorage.getItem(STORAGE_KEY);
      const sessionAuth = sessionStorage.getItem(AUTH_KEY);

      return (!!localUser && localAuth === "true") || (!!sessionUser && sessionAuth === "true");
    } catch {
      return false;
    }
  };

  const value: AdminAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/**
 * Hook to use admin auth context
 */
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AdminProtectedRoute({ 
  children, 
  redirectTo = "/admin/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Double check with storage
      const hasAuth = checkAuth();
      if (!hasAuth) {
        // Save intended destination for redirect after login
        sessionStorage.setItem("admin_redirect_after_login", pathname);
        router.replace(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname, checkAuth]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-(--primary) border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-(--primary) border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}

/**
 * Hook to get redirect URL after login
 */
export function useLoginRedirect() {
  const getRedirectUrl = (): string => {
    try {
      const savedUrl = sessionStorage.getItem("admin_redirect_after_login");
      if (savedUrl) {
        sessionStorage.removeItem("admin_redirect_after_login");
        return savedUrl;
      }
    } catch {
      // Ignore storage errors
    }
    return "/admin/dashboard";
  };

  return { getRedirectUrl };
}
