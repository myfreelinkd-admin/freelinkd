"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function FeatureSection() {
  return (
    <section id="featured" className="py-12 md:py-20 bg-(--background)">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Featured
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Discover our flagship services in one place! From hiring top
            freelancers to joining our talent network, accessing e-learning
            resources, attending exclusive events, and connecting with a vibrant
            community all designed to accelerate your professional growth and
            collaboration.
          </p>
        </motion.div>

        {/* Featured Card */}
        <motion.div 
          className="relative w-full h-87.5 md:h-125 rounded-2xl overflow-hidden group cursor-pointer shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Image */}
          <Image
            src="/assets/img/featured.jpg"
            alt="Featured Services"
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />

          {/* Overlay - Darkens on hover */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500" />

          {/* Content */}
          <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Text Content */}
              <div className="max-w-2xl text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Our Featured
                </h3>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-gray-200 text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      Your gateway to freelancing, learning, events, and
                      community everything you need to grow and connect.
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <motion.div 
                className="shrink-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href="/feature"
                  className="group bg-(--secondary) hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-[10px_20px_10px_20px] transition-colors duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
