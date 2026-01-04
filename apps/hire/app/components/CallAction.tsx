"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallAction() {
  return (
    <section className="relative w-full py-24 px-6 lg:px-20 bg-(--primary) overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight font-unbounded">
            Post It. Build It. <span className="text-[#ff6f00]">Ship It.</span>
          </h2>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            No ghosting. No fluff. Just skilled humans who{" "}
            <br className="hidden md:block" />
            actually deliver.
          </p>

          {/* Button */}
          <div className="flex justify-center mb-12 animate-fade-in-up delay-300">
            <Link
              href="/form"
              className="group relative px-10 py-5 font-bold rounded-[10px_25px_10px_25px] overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,111,0,0.4)] cursor-pointer border border-[#ff6f00] bg-[#ff6f00]"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-3 text-white group-hover:text-[#ff6f00] text-lg transition-colors duration-500">
                Join our Network
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
