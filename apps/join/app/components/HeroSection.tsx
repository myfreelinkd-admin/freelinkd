"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Content: Text & Buttons */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-20 py-12 lg:py-0 bg-(--background) z-10">
        <div className="max-w-xl flex flex-col gap-8 animate-fade-in-up lg:-mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#081f5c] text-sm font-semibold w-fit">
            <Star className="w-4 h-4 fill-current" />
            <span>Exclusive Freelancer Network</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
            Unlock Your <br />
            <span className="relative inline-block">
              Skill
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-(--primary)"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>{" "}
            <br />
            Potential
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            Join an exclusive network where top-tier talent collaborates with
            innovative companies on vetted, professionally managed projects.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Join our Network */}
            <Link
              href="/form"
              className="group relative px-8 py-4 font-semibold rounded-[10px_20px_10px_20px] overflow-hidden transition-all hover:shadow-lg cursor-pointer border border-[#ff6f00] bg-[#ff6f00]"
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
              className="group relative px-8 py-4 font-semibold rounded-[10px_20px_10px_20px] overflow-hidden transition-all cursor-pointer border border-[#081f5c] bg-transparent"
            >
              <div className="absolute inset-0 bg-[#081f5c] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2 text-[#081f5c] group-hover:text-white transition-colors duration-500">
                Freelancer Benefits
              </span>
            </Link>
          </div>

          {/* Professional Addition: Key Highlights */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              "Vetted Projects",
              "Weekly Payments",
              "Global Network",
              "Career Growth",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content: Image */}
      <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen">
        <Image
          src="/assets/img/hire.jpg"
          alt="Freelancer working professionally"
          fill
          className="object-cover"
          priority
        />

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-(--background) via-transparent to-transparent lg:block hidden" />

        {/* Bottom Floating Card */}
        <div className="absolute bottom-24 left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 animate-fade-in-up delay-300 max-w-xs">
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
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
