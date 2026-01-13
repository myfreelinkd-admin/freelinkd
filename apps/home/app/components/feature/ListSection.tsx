"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const features = [
  {
    title: "Hire Freelancer",
    description:
      "Find the perfect talent for your projects. Connect with skilled professionals ready to work.",
    image: "/assets/img/hire.jpg",
    link: "https://hire.freelinkd.com",
  },
  {
    title: "Join Freelancer",
    description:
      "Start your freelancing journey today. Access opportunities and grow your career.",
    image: "/assets/img/join.jpg",
    link: "https://join.freelinkd.com",
  },
  {
    title: "E-learning",
    description:
      "Expand your skills with our curated courses. Learn from industry experts at your own pace.",
    image: "/assets/img/e-learning.jpg",
    link: "/maintenance",
  },
  {
    title: "Events",
    description:
      "Join upcoming webinars and networking events. Connect with the community.",
    image: "/assets/img/events.png",
    link: "/maintenance",
  },
  {
    title: "Community",
    description:
      "Be part of a thriving community. Share knowledge, get support, and grow network.",
    image: "/assets/img/community.jpg",
    link: "/maintenance",
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ListSection() {
  return (
    <section className="py-8 md:py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-base md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Your gateway to freelancing, learning, events, and community
          everything you need to grow and connect.
        </p>
      </motion.div>

      <motion.div
        className="h-auto md:h-125 md:overflow-y-auto pr-0 md:pr-4 space-y-4 md:space-y-4 overscroll-contain [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative w-full min-h-[140px] h-auto md:h-28 md:min-h-0 rounded-[10px_20px_10px_20px] overflow-hidden shadow-md transition-all duration-300 shrink-0"
          >
            <div className="absolute inset-0">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 md:bg-linear-to-r md:from-black/70 md:via-black/40 md:to-transparent opacity-90 transition-opacity duration-300" />
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-5 md:px-12 z-20 pointer-events-none">
              <div className="flex flex-col justify-center h-full text-white z-10 max-w-[65%] md:max-w-[60%] pointer-events-auto py-4 md:py-0">
                <h3 className="text-xl md:text-3xl font-bold drop-shadow-lg mb-2 md:mb-1 transition-transform duration-300 md:group-hover:-translate-y-1">
                  {feature.title}
                </h3>
                <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-all duration-300 ease-out">
                  <p className="overflow-hidden text-xs md:text-sm text-gray-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-3 md:line-clamp-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="z-10 opacity-100 visible pointer-events-auto pl-2">
                <Link
                  href={feature.link}
                  target={
                    feature.link.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    feature.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="bg-(--secondary) hover:bg-orange-600 text-white font-semibold px-4 py-2 md:px-5 md:py-2 text-xs md:text-sm rounded-[10px_20px_10px_20px] transition-colors duration-300 flex items-center gap-2 cursor-pointer relative z-30 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
