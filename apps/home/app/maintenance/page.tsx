"use client";

import { motion } from "motion/react";
import { Footer } from "../components/layout/footer";
import { Construction } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="bg-(--background) relative overflow-x-hidden flex flex-col font-sans min-h-screen">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_30%),radial-gradient(circle_at_bottom_left,var(--secondary)_0%,transparent_15%)] opacity-5"></div>

      {/* Floating Blobs (Subtle) */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-64 bg-(--primary) rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-40 right-10 w-72 h-72 bg-(--secondary) rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 py-20 w-full relative z-10">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          {/* Animated Main Illustration Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="mb-12 relative"
          >
            {/* Main Circle */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center bg-white rounded-full shadow-[0_20px_50px_rgba(8,31,92,0.15)] border border-[rgba(8,31,92,0.05)]">
              {/* Central Logo/Icon */}
              <div className="relative z-20 flex flex-col items-center justify-center">
                <Construction
                  className="w-20 h-20 md:w-24 md:h-24 text-(--primary) mb-2"
                  strokeWidth={1.2}
                />
              </div>

              {/* Pulsing Ring */}
              <div className="absolute inset-0 rounded-full border border-(--primary) opacity-5 animate-ping duration-[3s]" />
              <div className="absolute -inset-5 rounded-full border border-(--secondary) opacity-5 animate-ping duration-[4s] delay-700" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6 max-w-2xl px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-(--primary) tracking-tight leading-[1.1]">
              We&apos;re enhancing your <br className="hidden md:block" />
              <span className="relative inline-block">
                experience
                <motion.svg
                  viewBox="0 0 200 9"
                  className="absolute -bottom-2 left-0 w-full h-3 text-(--secondary) opacity-60"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <path
                    d="M2.00025 6.99996C36.48 3.99996 90.745 1.50002 198 4.99998"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed font-normal">
              Our system is currently undergoing scheduled maintenance to
              improve performance and security. We&apos;re working hard to
              maintain the high standards you expect from Freelinkd.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
            >
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-(--primary) mb-1">
                  Better Performance
                </h3>
                <p className="text-sm text-gray-500">
                  Optimizing our servers for faster load times.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-(--primary) mb-1">
                  New Features
                </h3>
                <p className="text-sm text-gray-500">
                  Integrating new tools for better collaboration.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-(--primary) mb-1">
                  Enhanced Security
                </h3>
                <p className="text-sm text-gray-500">
                  Updating security protocols to keep data safe.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
