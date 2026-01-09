"use client";

import Image from "next/image";
import { motion } from "motion/react";

const stats = [
  { label: "Freelancer", value: "2K+" },
  { label: "SMEs Joined", value: "500+" },
  { label: "Projects", value: "5K+" },
  { label: "Rating", value: "4.5" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" as const } 
  },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-end pb-20 md:pb-32"
    >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/assets/img/freelancer.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-xl text-center group hover:bg-black/40 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-1 group-hover:text-(--secondary) transition-colors duration-300">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-300 uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
