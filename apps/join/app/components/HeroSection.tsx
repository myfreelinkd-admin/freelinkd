"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col lg:flex-row overflow-hidden pt-16 lg:pt-0">
      {/* Left Content: Text & Buttons */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-20 py-8 lg:py-0 bg-(--background) z-10 order-1 lg:order-1">
        <motion.div
          className="max-w-xl flex flex-col gap-4 lg:gap-8 lg:-mt-16 text-center lg:text-left items-center lg:items-start"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-blue-50 text-[#081f5c] text-xs lg:text-sm font-semibold w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-current" />
            <span>Exclusive Freelancer Network</span>
          </motion.div>

          <h1 className="text-3xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
            Unlock Your <br />
            <span className="relative inline-block">
              Skill
              <svg
                className="absolute w-full h-2 lg:h-3 -bottom-1 left-0 text-(--primary)"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
            </span>{" "}
            <br />
            Potential
          </h1>

          <p className="text-sm lg:text-lg text-gray-600 leading-relaxed max-w-sm lg:max-w-none">
            Join an exclusive network where top-tier talent collaborates with
            innovative companies on vetted, professionally managed projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Join our Network */}
            <Link
              href="/form"
              className="group relative px-6 py-3 lg:px-8 lg:py-4 font-semibold rounded-[10px_20px_10px_20px] overflow-hidden transition-all hover:shadow-lg cursor-pointer border border-[#ff6f00] bg-[#ff6f00] flex justify-center items-center w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-[#ff6f00] transition-colors duration-500">
                Join our Network
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Freelancer Benefits */}
            <Link
              href="#benefits"
              className="group relative px-6 py-3 lg:px-8 lg:py-4 font-semibold rounded-[10px_20px_10px_20px] overflow-hidden transition-all cursor-pointer border border-[#081f5c] bg-transparent flex justify-center items-center w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-[#081f5c] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2 text-[#081f5c] group-hover:text-white transition-colors duration-500">
                Freelancer Benefits
              </span>
            </Link>
          </div>

          {/* Professional Addition: Key Highlights */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:gap-4 mt-2 lg:mt-4 text-left">
            {[
              "Vetted Projects",
              "Weekly Payments",
              "Global Network",
              "Career Growth",
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-gray-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Content: Image */}
      <motion.div
        className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-screen order-2 lg:order-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/assets/img/hire.jpg"
          alt="Freelancer working professionally"
          fill
          className="object-cover"
          priority
        />

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-(--background) lg:bg-linear-to-r lg:to-transparent lg:from-(--background) block" />

        {/* Bottom Floating Card */}
        <motion.div
          className="absolute bottom-6 left-6 right-6 lg:right-auto lg:bottom-24 lg:left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-xs mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#081f5c]/10 flex items-center justify-center text-[#081f5c]">
              <Star className="w-6 h-6 fill-current text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Average Rating
              </p>
              <p className="text-lg font-bold text-[#081f5c]">4.9 / 5.0</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
