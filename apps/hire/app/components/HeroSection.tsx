"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Text Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-20 py-12 lg:py-0 bg-(--background) z-10">
        <div className="max-w-xl flex flex-col gap-8 animate-fade-in-up lg:-mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#081f5c] text-sm font-semibold w-fit">
            <Star className="w-4 h-4 fill-current" />
            <span>Results-Driven Talent</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
            Unlock Your <br />
            <span className="relative inline-block">
              Business
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
            Access a curated network of vetted professionals to deliver
            measurable results fast. Expert talent, flexible terms, clear
            outcomes.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Post a Project */}
            <Link
              href="/form"
              className="group relative px-8 py-4 font-semibold rounded-[10px_20px_10px_20px] overflow-hidden transition-all hover:shadow-lg cursor-pointer border border-[#ff6f00] bg-white"
            >
              <div className="absolute inset-0 bg-[#ff6f00] translate-y-0 group-hover:-translate-y-full transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-[#ff6f00] transition-colors duration-500">
                Post a Project
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {/* How it Works */}
            <Link
              href="#our-commitment"
              className="group relative px-8 py-4 font-semibold rounded-[10px_20px_10px_20px] overflow-hidden transition-all cursor-pointer border border-[#081f5c] bg-transparent"
            >
              <div className="absolute inset-0 bg-[#081f5c] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2 text-[#081f5c] group-hover:text-white transition-colors duration-500">
                <PlayCircle className="w-5 h-5" />
                How it Works
              </span>
            </Link>
          </div>

          {/* Partners */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-3">
              {[
                { name: "Sagawa", logo: "/assets/img/sagawa_logo.svg" },
                { name: "SMKN 31", logo: "/assets/img/smkn31.svg" },
                { name: "AWA", logo: "/assets/img/awa_contruction_logo.svg" },
              ].map((partner, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden text-[10px] font-bold text-gray-400">
                +99
              </div>
            </div>
            <p>Trusted by 1000+ Companies</p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen">
        <Image
          src="/assets/img/hire.jpg"
          alt="Professional working on laptop"
          fill
          className="object-cover"
          priority
        />
        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-(--background) via-transparent to-transparent lg:block hidden" />

        {/* Floating Card Overlay */}
        <div className="absolute bottom-24 left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 animate-fade-in-up delay-200 max-w-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Project Success
              </p>
              <p className="text-lg font-bold text-(--primary)">
                98% Satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
