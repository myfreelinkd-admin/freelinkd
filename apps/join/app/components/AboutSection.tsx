"use client";

import React from "react";
import { Star, Users, TrendingUp, ShieldCheck } from "lucide-react";

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

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full py-24 px-6 lg:px-20 bg-(--background) relative overflow-hidden"
    >
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#081f5c] mb-6">
            Your Freelance Career, Elevated
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Go beyond simple gigs. Join a curated platform designed to connect
            you with high-value clients and accelerate your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(8,31,92,0.1)] transition-all duration-500 ease-in-out cursor-pointer border border-gray-100 hover:border-blue-100 flex flex-col h-full animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="mb-8 relative">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
