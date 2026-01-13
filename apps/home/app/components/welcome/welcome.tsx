"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  User,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome() {
  const router = useRouter();
  const [showUmkmModal, setShowUmkmModal] = useState(false);

  const handleRoleSelection = (selectedRole: "freelancer" | "umkm") => {
    if (selectedRole === "freelancer") {
      router.push("/freelancer/login");
    } else if (selectedRole === "umkm") {
      setShowUmkmModal(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 rounded-bl-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-50/50 rounded-tr-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full flex flex-col items-center justify-center p-4 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-16 text-center"
        >
          <div className="relative w-32 h-10 md:w-48 md:h-12 mx-auto mb-4 md:mb-6">
            <Image
              src="/assets/freelinkd.svg"
              alt="Freelinkd Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--primary)] mb-3 md:mb-4 tracking-tight">
            Welcome to Freelinkd
          </h1>
          <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto px-4 md:px-0">
            Join the platform connecting top talent with growing businesses. How
            would you like to continue?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => handleRoleSelection("freelancer")}
              className="w-full h-full group relative overflow-hidden bg-white border border-gray-200 hover:border-[var(--primary)] p-6 md:p-10 rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-xl text-left flex flex-col items-start gap-4 md:gap-6 cursor-pointer"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-50 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-[var(--primary)] transition-colors">
                  I am a Student / Freelancer
                </h3>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                  I want to find projects, and build my portfolio.
                </p>
              </div>
              <div className="mt-auto pt-2 md:pt-4 flex items-center text-[var(--primary)] font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-sm md:text-base">
                Continue as Freelancer{" "}
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 ml-2 rotate-180" />
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => handleRoleSelection("umkm")}
              className="w-full h-full group relative overflow-hidden bg-white border border-gray-200 hover:border-[var(--secondary)] p-6 md:p-10 rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-xl text-left flex flex-col items-start gap-4 md:gap-6 cursor-pointer"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-orange-50 text-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-[var(--secondary)] transition-colors">
                  I am an SME / UMKM
                </h3>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                  I want to hire talent, post projects, and grow my business.
                </p>
              </div>
              <div className="mt-auto pt-2 md:pt-4 flex items-center text-[var(--secondary)] font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-sm md:text-base">
                Continue as SME{" "}
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 ml-2 rotate-180" />
              </div>
            </button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-12 text-xs md:text-sm text-gray-400 text-center px-4"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>

        {/* Professional Modal for UMKM Selection */}
        <AnimatePresence>
          {showUmkmModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowUmkmModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowUmkmModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-[var(--secondary)]">
                    <Building2 className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    SME / UMKM Portal
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">
                    Access your dashboard or create a new account to get
                    started.
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <button
                    onClick={() => router.push("/umkm/login")}
                    className="w-full flex items-center justify-between p-3 md:p-4 bg-[var(--secondary)] hover:bg-[#e66400] text-white rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                        <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <span className="font-semibold text-base md:text-lg">
                        Login to Account
                      </span>
                    </div>
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => router.push("/umkm/register")}
                    className="w-full flex items-center justify-between p-3 md:p-4 bg-white border-2 border-gray-100 hover:border-[var(--secondary)] hover:bg-orange-50 text-gray-700 hover:text-[var(--secondary)] rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 group-hover:bg-white p-1.5 md:p-2 rounded-lg transition-colors">
                        <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <span className="font-semibold text-base md:text-lg">
                        Create New Account
                      </span>
                    </div>
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 rotate-180 group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
