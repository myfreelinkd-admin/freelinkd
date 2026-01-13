"use client";

import { UserPlus, Search, Briefcase } from "lucide-react";
import { motion } from "motion/react";

export default function Step() {
  const steps = [
    {
      id: 1,
      title: "Showcase Your Expertise",
      description:
        "Create a professional profile highlighting your skills and experience.",
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Discover Vetted Projects",
      description:
        "Browse through high-quality projects from innovative companies.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Collaborate with Confidence",
      description:
        "Work on exciting projects and get paid securely and on time.",
      icon: <Briefcase className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-12 lg:py-24 bg-(--background) overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl lg:text-5xl font-extrabold text-[#081f5c] mb-4 lg:mb-6">
            Your Path to Premium Projects
          </h2>
          <p className="text-sm lg:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:max-w-none">
            Follow our simple three-step process to join our exclusive network
            of professional freelancers and start your journey today.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              >
                {/* Step Number & Icon Circle */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#081f5c] flex items-center justify-center text-white text-2xl font-bold shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {step.id}
                  </div>

                  {/* Floating Icon Badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#ff6f00] flex items-center justify-center text-white shadow-lg border-4 border-white transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="max-w-xs">
                  <h3 className="text-xl font-bold text-[#081f5c] mb-3 group-hover:text-[#ff6f00] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden w-0.5 h-12 bg-gray-100 my-6" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
