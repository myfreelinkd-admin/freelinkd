"use client";

import Image from "next/image";

const features = [
  {
    title: "Hire Freelancer",
    description: "Hire freelancer blablabla",
    image: "/assets/img/hire.jpg",
  },
  {
    title: "Join Freelancer",
    description: "Join freelancer blablabla",
    image: "/assets/img/join.jpg",
  },
  {
    title: "E-learning",
    description: "Join freelancer blablabla",
    image: "/assets/img/e-learning.jpg",
  },
  {
    title: "Events",
    description: "Event blablabla",
    image: "/assets/img/events.png",
  },
  {
    title: "Community",
    description: "Community blablabla",
    image: "/assets/img/community.jpg",
  },
];

export default function ListSection() {
  return (
    <section className="py-8 md:py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-base md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Your gateway to freelancing, learning, events, and community
          everything you need to grow and connect.
        </p>
      </div>

      <div className="h-100 md:h-125 overflow-y-auto pr-4 space-y-4 overscroll-contain [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative w-full h-24 md:h-28 rounded-2xl overflow-hidden shadow-md transition-all duration-300 shrink-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
              <div className="flex flex-col justify-center h-full text-white z-10 max-w-[70%] md:max-w-[60%]">
                <h3 className="text-xl md:text-3xl font-bold drop-shadow-md mb-2">
                  {feature.title}
                </h3>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                  <p className="overflow-hidden text-sm md:text-base text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="z-10 opacity-100 visible">
                <button className="bg-(--secondary) hover:bg-orange-600 text-white font-semibold px-5 py-2 text-sm rounded-[10px_20px_10px_20px] transition-colors duration-300 flex items-center gap-2 cursor-pointer">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
