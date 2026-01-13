"use client";

import React from "react";
import { Star, Users, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Star,
    title: "Curated Opportunities",
    description:
      "Access high-value projects from vetted clients that match your expertise and career goals.",
  },
  {
    icon: Users,
    title: "Professional Network",
    description:
      "Connect with a community of top-tier freelancers and industry experts to collaborate and grow.",
  },
  {
    icon: TrendingUp,
    title: "Accelerated Growth",
    description:
      "Take your career to the next level with resources and projects designed for professional advancement.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Transparent",
    description:
      "Enjoy peace of mind with secure payment systems and transparent project management tools.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full py-12 lg:py-24 px-4 lg:px-20 bg-(--background) relative overflow-hidden"
    >
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl lg:text-5xl font-extrabold text-[#081f5c] mb-4 lg:mb-6">
            Your Freelance Career, Elevated
          </h2>
          <p className="text-sm lg:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:max-w-none">
            Go beyond simple gigs. Join a curated platform designed to connect
            you with high-value clients and accelerate your professional growth.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-3xl p-6 lg:p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(8,31,92,0.1)] transition-all duration-500 ease-in-out cursor-pointer border border-gray-100 hover:border-blue-100 flex flex-col h-full"
              whileHover={{ y: -5 }}
            >
              <div className="mb-6 lg:mb-8 relative">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6 group-hover:scale-110">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#081f5c] mb-4 group-hover:text-(--primary) transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed grow">
                {feature.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-8 w-12 h-1 bg-gray-100 group-hover:w-full group-hover:bg-(--primary) transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
