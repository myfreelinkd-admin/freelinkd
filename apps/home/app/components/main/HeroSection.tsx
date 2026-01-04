"use client";

import Image from "next/image";

const stats = [
  { label: "Freelancer", value: "2K+" },
  { label: "SMEs Joined", value: "500+" },
  { label: "Projects", value: "5K+" },
  { label: "Rating", value: "4.5" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-end pb-20 md:pb-32"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/freelancer.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-xl text-center group hover:bg-black/40 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-1 group-hover:text-(--secondary) transition-colors duration-300">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-300 uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
