"use client";

import { useResetPasswordForm } from "./logic-pass";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Headphones,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export const ResetPasswordSection = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    success,
    passwordStrength,
  } = useResetPasswordForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 bg-[#f9fcff]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 md:p-12 border border-gray-100 flex flex-col items-center text-center space-y-8"
      >
        {/* Icon Header */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
          <Lock className="w-10 h-10 text-[#081f5c]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081f5c]">
            Create New Password
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Please enter user type, your email, and new password below to secure
            your account.
          </p>
        </div>

        {success && (
          <div className="w-full p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-left">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* New Password */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold uppercase text-gray-600 ml-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter Your Password"
                required
                className="w-full px-6 py-3 rounded-full border border-gray-300 focus:border-[#081f5c] focus:ring-2 focus:ring-[#081f5c]/20 outline-none transition-all placeholder:text-gray-400 text-gray-700 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold uppercase text-gray-600 ml-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-Enter Your Password"
                required
                className="w-full px-6 py-3 rounded-full border border-gray-300 focus:border-[#081f5c] focus:ring-2 focus:ring-[#081f5c]/20 outline-none transition-all placeholder:text-gray-400 text-gray-700 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          <div className="bg-blue-50/50 p-4 rounded-xl space-y-3 text-left border border-blue-100">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700">
                Password Strength:{" "}
                {passwordStrength < 50
                  ? "Weak"
                  : passwordStrength < 100
                    ? "Medium"
                    : "Strong"}
              </span>
              <span className="text-gray-500 text-xs">{passwordStrength}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out rounded-full ${
                  passwordStrength < 50
                    ? "bg-red-500"
                    : passwordStrength < 100
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle
                className={`w-3 h-3 ${passwordStrength === 100 ? "text-green-500" : "text-gray-300"}`}
              />
              <span>Great job! Your password is secure.</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#081f5c] hover:bg-[#061744] cursor-pointer text-white font-bold py-3.5 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-gray-100 w-full">
          <p className="text-xs text-gray-400 mb-4">
            Didn&apos;t request this change?
          </p>
          <div className="flex items-center justify-center gap-8">
            <Link
              href="/report"
              className="flex items-center gap-2 text-[#081f5c] font-semibold text-sm hover:underline"
            >
              <Headphones className="w-4 h-4" />
              Contact Support
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <button className="flex items-center gap-2 text-red-500 font-semibold text-sm hover:underline">
              <AlertTriangle className="w-4 h-4" />
              Report Issue
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
