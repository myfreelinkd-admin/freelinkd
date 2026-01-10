"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginBackground from "../design/background";
import { sanitizeInput } from "../../../utils/sanitize";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  error?: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Loading and feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validation state
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleNext = () => {
    // Validate email before showing password
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError(null);
    setShowPasswordField(true);
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showPasswordField) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validate
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Success - Store admin data in localStorage/sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("admin_user", JSON.stringify(data.data));
      storage.setItem("admin_logged_in", "true");

      setSuccess(`Welcome back, ${data.data?.username || "Admin"}! Redirecting to dashboard...`);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side: Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50">
        <div className="absolute inset-0 z-10 bg-black/5"></div>
        <Image
          src="/assets/img/featured.jpg"
          alt="Admin Workspace"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side: Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start pt-[12vh] p-8 md:p-16 lg:p-24 relative">
        <LoginBackground />
        <div className="w-full max-w-md space-y-12 relative z-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative flex items-center justify-center">
              <Image
                src="/assets/freelinkd-logo.svg"
                alt="Freelinkd Logo"
                width={240}
                height={60}
                className="h-auto w-auto max-w-70"
                priority
              />
            </div>
            <p className="text-gray-500 font-medium text-lg max-w-70">
              Sign in to access your dashboard and opportunities
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 min-h-100">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(sanitizeInput(e.target.value));
                    if (emailError) setEmailError(null);
                    if (error) setError(null);
                  }}
                  onKeyPress={handleEmailKeyPress}
                  placeholder="Email"
                  disabled={isLoading}
                  className={`block w-full px-8 py-5 bg-white border-2 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none transition-all duration-300 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    emailError 
                      ? "border-red-300 focus:border-red-400" 
                      : "border-gray-200 focus:border-(--primary)"
                  }`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  {!showPasswordField ? (
                    email.length > 0 && (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors animate-in fade-in zoom-in duration-300 cursor-pointer disabled:opacity-50"
                      >
                        <ArrowRight className="w-6 h-6 text-(--primary)" />
                      </button>
                    )
                  ) : (
                    <div className="p-2">
                      <ArrowRight className="w-6 h-6 text-(--primary)" />
                    </div>
                  )}
                </div>
              </div>
              {emailError && (
                <p className="text-red-500 text-sm px-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field (Conditional) */}
            <div
              className={`space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${
                showPasswordField
                  ? "max-h-40 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-4"
              }`}
            >
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(sanitizeInput(e.target.value));
                    if (error) setError(null);
                  }}
                  placeholder="Password"
                  disabled={isLoading}
                  className="block w-full px-8 py-5 bg-white border-2 border-gray-200 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none focus:border-(--primary) transition-all duration-300 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Eye className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div
              className={`flex items-center justify-between px-4 transition-all duration-700 delay-100 ${
                showPasswordField
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded-full transition-all duration-200 ${
                      rememberMe
                        ? "bg-(--primary) border-(--primary)"
                        : "border-gray-300 bg-white"
                    }`}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Remember Me
                </span>
              </label>
              <Link
                href="/reset-pass"
                className="text-sm font-medium text-gray-600 hover:text-(--primary) transition-colors"
              >
                Forget Password
              </Link>
            </div>

            {/* Submit Button */}
            <div
              className={`transition-all duration-700 delay-200 ${
                showPasswordField
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-(--secondary) hover:bg-(--secondary)/95 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-xl shadow-(--secondary)/20 hover:shadow-(--secondary)/30 active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div
              className={`text-center transition-all duration-700 delay-300 ${
                showPasswordField
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <p className="text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/admin/signup"
                  className="text-(--primary) font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
