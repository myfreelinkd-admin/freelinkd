"use client";

import { useReportForm } from "./logic-report";
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export const ReportSection = () => {
  const { formData, handleChange, handleSubmit, loading, error, success } =
    useReportForm();

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 bg-[#f9fcff]">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#081f5c]"
          >
            Contact Support
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Having trouble resetting your password or accessing your account?
            Fill out the form below and our team will get back to you within 24
            hours.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100"
        >
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>
                Opening WhatsApp... Please send the message to complete your
                report!
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-[#081f5c] font-bold text-sm uppercase tracking-wide"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-[#081f5c] focus:ring-2 focus:ring-[#081f5c]/20 outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[#081f5c] font-bold text-sm uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-[#081f5c] focus:ring-2 focus:ring-[#081f5c]/20 outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-[#081f5c] font-bold text-sm uppercase tracking-wide"
              >
                Description Of Issue
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe the issue you're experiencing in detail. Include any error messages you've seen..."
                className="w-full px-6 py-4 rounded-3xl border border-gray-300 focus:border-[#081f5c] focus:ring-2 focus:ring-[#081f5c]/20 outline-none transition-all min-h-37.5 resize-y placeholder:text-gray-400"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ff6f00] hover:bg-[#ff9100] cursor-pointer text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Submit
                    <div className="">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
