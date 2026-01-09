"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Building2, Loader2, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sanitizeInput } from "@/app/utils/sanitize";

// Business type options for UMKM
const BUSINESS_TYPES = [
  "Retail & E-commerce",
  "Food & Beverage",
  "Fashion & Apparel",
  "Health & Beauty",
  "Technology & IT Services",
  "Professional Services",
  "Creative & Design",
  "Education & Training",
  "Manufacturing",
  "Agriculture",
  "Transportation & Logistics",
  "Other",
] as const;

interface FormData {
  username: string;
  email: string;
  phone: string;
  businessType: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

interface FormSectionProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function FormSection({ onSubmit }: FormSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    businessType: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : sanitizeInput(value),
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.username.trim()) {
      return "Username is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (!formData.businessType) {
      return "Please select your business type";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    if (!formData.agreedToTerms) {
      return "You must agree to the Terms and Conditions";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch("/api/umkm/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            businessType: formData.businessType,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }
      }

      setSuccess(true);
      setFormData({
        username: "",
        email: "",
        phone: "",
        businessType: "",
        password: "",
        confirmPassword: "",
        agreedToTerms: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 relative z-10">
      {/* Logo Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative flex items-center justify-center">
          <Image
            src="/assets/freelinkd-logo.svg"
            alt="Freelinkd Logo"
            width={240}
            height={60}
            className="h-auto w-auto max-w-60"
            priority
          />
        </div>
        <p className="text-gray-500 font-medium text-base max-w-70">
          Create an SME account to join Freelinkd
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          Registration successful! Redirecting to login...
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Field */}
        <div className="relative group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="block w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#081f5c] transition-all duration-300 font-medium shadow-sm"
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div className="relative group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="block w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#081f5c] transition-all duration-300 font-medium shadow-sm"
            disabled={loading}
          />
        </div>

        {/* Phone Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (optional)"
            className="block w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#081f5c] transition-all duration-300 font-medium shadow-sm"
            disabled={loading}
          />
        </div>

        {/* Business Type Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="block w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 focus:outline-none focus:border-[#081f5c] transition-all duration-300 font-medium shadow-sm appearance-none cursor-pointer"
            disabled={loading}
          >
            <option value="" disabled>
              Business Type
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Password Field */}
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="block w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#081f5c] transition-all duration-300 font-medium shadow-sm"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="relative group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="block w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#081f5c] transition-all duration-300 font-medium shadow-sm"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreedToTerms"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-[#081f5c] border-gray-300 rounded focus:ring-[#081f5c] cursor-pointer"
            disabled={loading}
          />
          <label
            htmlFor="agreedToTerms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-[#081f5c] font-semibold hover:underline"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#081f5c] font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#081f5c] hover:bg-[#0a2a7a] text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-[#081f5c]/20 hover:shadow-[#081f5c]/30 active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/umkm/login"
              className="text-[#081f5c] font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
