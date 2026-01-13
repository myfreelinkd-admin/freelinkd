"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UMKMProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both localStorage and sessionStorage
    const localAuth = localStorage.getItem("umkm_logged_in");
    const sessionAuth = sessionStorage.getItem("umkm_logged_in");

    if (localAuth === "true" || sessionAuth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/umkm/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
