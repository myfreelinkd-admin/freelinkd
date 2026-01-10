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
  };
  error?: string;
}

export default function AdminSignup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading and feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Username validation
    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      // Success
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side: Signup Form Section */}
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
              Create an account to start your journey
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(sanitizeInput(e.target.value));
                    if (validationErrors.username) {
                      setValidationErrors((prev) => ({ ...prev, username: undefined }));
                    }
                  }}
                  placeholder="Username"
                  disabled={isLoading}
                  className={`block w-full px-8 py-5 bg-white border-2 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none transition-all duration-300 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.username 
                      ? "border-red-300 focus:border-red-400" 
                      : "border-gray-200 focus:border-(--primary)"
                  }`}
                />
              </div>
              {validationErrors.username && (
                <p className="text-red-500 text-sm px-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(sanitizeInput(e.target.value));
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="Email"
                  disabled={isLoading}
                  className={`block w-full px-8 py-5 bg-white border-2 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none transition-all duration-300 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.email 
                      ? "border-red-300 focus:border-red-400" 
                      : "border-gray-200 focus:border-(--primary)"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-sm px-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(sanitizeInput(e.target.value));
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="Password"
                  disabled={isLoading}
                  className={`block w-full px-8 py-5 bg-white border-2 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none transition-all duration-300 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.password 
                      ? "border-red-300 focus:border-red-400" 
                      : "border-gray-200 focus:border-(--primary)"
                  }`}
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
              {validationErrors.password && (
                <p className="text-red-500 text-sm px-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-(--secondary) hover:bg-(--secondary)/95 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-xl shadow-(--secondary)/20 hover:shadow-(--secondary)/30 active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/admin/login"
                  className="text-(--primary) font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Image Section */}
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
    </div>
  );
}
