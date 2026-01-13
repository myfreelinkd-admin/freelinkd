"use client";

import { ThumbsUp, HeartHandshake, BrainCircuit, Bot } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function AboutSection() {
  const features = [
    {
      title: "Quality Projects",
      description:
        "Every project you get through Freelinkd is carefully selected to ensure high quality and relevance to the specific needs of your business. With passionate young talents, we help MSMEs grow faster.",
      icon: ThumbsUp,
    },
    {
      title: "Effective Collaboration",
      description:
        "Freelinkd is not just a platform, but a collaboration space. We connect clients and freelancers with a transparent, easy, and efficient system - ensuring optimal work outcomes for both parties.",
      icon: HeartHandshake,
    },
    {
      title: "Creative Solutions",
      description:
        "We believe every business needs a touch of fresh ideas. Freelinkd brings creative and innovative solutions from the younger generation, designed to answer your business challenges in an effective and differentiated way.",
      icon: BrainCircuit,
    },
    {
      title: "Customer Support",
      description:
        "Our customer support team is available 24/7 to ensure that all your inquiries and issues are addressed promptly and efficiently.",
      icon: Bot,
    },
  ];

  return (
    <section id="about" className="py-12 md:py-20 bg-(--background)">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-5xl mx-auto mb-12 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10">
            About Freelinkd
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed text-center">
            Freelinkd offers students real-world work experience through a
            flexible framework designed to accommodate their academic schedules.
            This provides invaluable opportunities for building professional and
            industry networks. For Micro, Small, and Medium Enterprises (MSMEs),
            FreeLinkd is a gateway to acquiring high-quality, affordable talent
            with the fresh perspective of the millennial and Gen Z workforce.
            This facilitates optimal business development without the
            constraints of a long-term employment commitment.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-10 md:gap-y-16 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-6"
            >
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-full bg-(--primary) flex items-center justify-center shadow-lg transition-transform hover:scale-110 duration-300">
                  <feature.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-left md:text-left">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
