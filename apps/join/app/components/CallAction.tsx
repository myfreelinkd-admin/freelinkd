"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface StatItemProps {
  target: number;
  label: string;
  suffix?: string;
}

const StatItem = ({ target, label, suffix = "" }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(
          Number.isInteger(target)
            ? Math.floor(start)
            : parseFloat(start.toFixed(1))
        );
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div ref={countRef} className="flex flex-col items-center">
      <span className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-blue-200 text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export default function CallAction() {
  return (
    <section className="relative w-full py-24 px-6 lg:px-20 bg-(--primary) overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

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

      <div className="container mx-auto relative z-10 text-center">
        <motion.div 
          className="max-w-4xl mx-auto mb-16 flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight font-unbounded">
            Freelance. Flex.
            <span className="text-[#ff6f00]"> Repeat.</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            Turn your skills into real impact and your side hustle into a
            career.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatItem target={2000} label="Freelancers" suffix="+" />
          <StatItem target={500} label="SMEs Joined" suffix="+" />
          <StatItem target={5000} label="Projects" suffix="+" />
          <StatItem target={4.5} label="Rating" suffix="" />
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div 
          className="pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-blue-200/60 text-sm font-medium flex flex-wrap justify-center gap-x-4 gap-y-2">
            <span>Free to join</span>
            <span className="hidden sm:inline">•</span>
            <span>No hidden fees</span>
            <span className="hidden sm:inline">•</span>
            <span>Fair evaluation based on skill</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
