"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  const router = useRouter();

  const handleRoleSelection = (selectedRole: "freelancer" | "umkm") => {
    if (selectedRole === "freelancer") {
      router.push("/freelancer/login");
    } else if (selectedRole === "umkm") {
      router.push("/umkm/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 rounded-bl-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-50/50 rounded-tr-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <div className="relative w-48 h-12 mx-auto mb-6">
            <Image
              src="/assets/freelinkd.svg"
              alt="Freelinkd Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--primary)] mb-4 tracking-tight">
            Welcome to Freelinkd
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Join the platform connecting top talent with growing businesses. How
            would you like to continue?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => handleRoleSelection("freelancer")}
              className="w-full h-full group relative overflow-hidden bg-white border border-gray-200 hover:border-[var(--primary)] p-8 md:p-10 rounded-3xl transition-all duration-300 hover:shadow-xl text-left flex flex-col items-start gap-6 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors">
                  I am a Student / Freelancer
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  I want to find projects, and build my portfolio.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center text-[var(--primary)] font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Continue as Freelancer{" "}
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
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
              className="w-full h-full group relative overflow-hidden bg-white border border-gray-200 hover:border-[var(--secondary)] p-8 md:p-10 rounded-3xl transition-all duration-300 hover:shadow-xl text-left flex flex-col items-start gap-6 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[var(--secondary)] transition-colors">
                  I am an SME / UMKM
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  I want to hire talent, post projects, and grow my business.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center text-[var(--secondary)] font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Continue as SME{" "}
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </div>
            </button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-gray-400"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </div>
    </div>
  );
}
