"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginBackground from "../design/background";
import { sanitizeInput } from "../../../utils/sanitize";

export default function AdminSignup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(sanitizeInput(e.target.value))}
                  placeholder="Username"
                  className="block w-full px-8 py-5 bg-white border-2 border-gray-200 rounded-full text-var(--primary) placeholder-gray-400 focus:outline-none focus:border-var(--primary) transition-all duration-300 font-medium text-lg shadow-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                  placeholder="Email"
                  className="block w-full px-8 py-5 bg-white border-2 border-gray-200 rounded-full text-var(--primary) placeholder-gray-400 focus:outline-none focus:border-var(--primary) transition-all duration-300 font-medium text-lg shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                  placeholder="Password"
                  className="block w-full px-8 py-5 bg-white border-2 border-gray-200 rounded-full text-var(--primary) placeholder-gray-400 focus:outline-none focus:border-var(--primary) transition-all duration-300 font-medium text-lg shadow-sm"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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

            {/* Submit Button */}
            <div className="pt-4">
              <button className="w-full py-5 bg-var(--secondary) hover:bg-var(--secondary)/95 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-xl shadow-var(--secondary)/20 hover:shadow-var(--secondary)/30 active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer">
                Sign Up
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/admin/login"
                  className="text-var(--primary) font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
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
