"use client";

import Image from "next/image";
import FormSection from "./form-section";

// Background component for UMKM signup - SME/Business themed
const UMKMBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-white">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/60 z-10"></div>

      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#081f5c"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#081f5c]/5 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#ff6f00]/5 blur-3xl"></div>
    </div>
  );
};

export default function UMKMSignup() {
  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side: Signup Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start pt-[8vh] p-6 md:p-12 lg:p-16 relative overflow-y-auto">
        <UMKMBackground />
        <FormSection />
      </div>

      {/* Right Side: Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        {/* Overlay with gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#081f5c]/80 via-[#081f5c]/60 to-transparent"></div>

        {/* Background Image */}
        <Image
          src="/assets/img/featured.jpg"
          alt="SME Business Workspace"
          fill
          className="object-cover"
          priority
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12">
          <div className="space-y-6">
          </div>
        </div>
      </div>
    </div>
  );
}
