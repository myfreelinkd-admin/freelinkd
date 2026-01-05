"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleNext = () => {
    if (email.includes("@")) {
      setShowPasswordField(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side: Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50">
        <div className="absolute inset-0 z-10 bg-black/5"></div>
        <Image
          src="/assets/img/featured.jpg" // Using an existing image as placeholder
          alt="Admin Workspace"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side: Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start pt-[15vh] p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-md space-y-12">
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
          <div className="space-y-6 min-h-100">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="block w-full px-8 py-5 bg-white border-2 border-gray-200 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none focus:border-(--primary) transition-all duration-300 font-medium text-lg shadow-sm"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  {!showPasswordField ? (
                    email.length > 0 && (
                      <button
                        onClick={handleNext}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors animate-in fade-in zoom-in duration-300"
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="block w-full px-8 py-5 bg-white border-2 border-gray-200 rounded-full text-(--primary) placeholder-gray-400 focus:outline-none focus:border-(--primary) transition-all duration-300 font-medium text-lg shadow-sm"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-400" />
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
                href="/admin/forgot-password"
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
              <button className="w-full py-5 bg-(--primary) hover:bg-(--primary)/95 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-xl shadow-(--primary)/20 hover:shadow-(--primary)/30 active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer">
                Sign In
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              &copy; 2026 Freelinkd Admin Portal. All rights reserved.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-(--secondary)/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-(--primary)/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>
    </div>
  );
}
