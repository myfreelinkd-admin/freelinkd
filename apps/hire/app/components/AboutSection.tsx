"use client";

import { ThumbsUp, HeartHandshake, BrainCircuit, Bot } from "lucide-react";
import { motion } from "motion/react";

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
      "Freelinkd is not just a platform, but a collaboration space. We connect clients and freelancers with a transparent, easy, and efficient system ensuring optimal work outcomes for both parties.",
    icon: HeartHandshake,
  },
  {
    title: "Creative Solutions",
    description:
      "We believe every business needs a touch of fresh ideas. Freelinkd brings creative and innovative solutions from the younger generation, designed to answer your business challenges.",
    icon: BrainCircuit,
  },
  {
    title: "Customer Support",
    description:
      "Our customer support team is available 24/7 to ensure that all your inquiries and issues are addressed promptly and efficiently, providing peace of mind for every project.",
    icon: Bot,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutSection() {
  return (
    <section
      id="our-commitment"
      className="w-full py-12 lg:py-24 px-4 lg:px-20 bg-(--background) relative overflow-hidden"
    >
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl lg:text-5xl font-extrabold text-[#081f5c] mb-4 lg:mb-6 px-4">
            Our Commitment
          </h2>
          <p className="text-sm lg:text-lg text-gray-600 leading-relaxed px-4">
            We connect talented freelancers with SMEs to deliver high-quality
            projects and flexible collaboration models. Explore how we can help
            you grow.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-3xl p-6 lg:p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(8,31,92,0.1)] transition-all duration-500 ease-in-out cursor-pointer border border-gray-100 hover:border-blue-100 flex flex-col h-full"
            >
              <div className="mb-8 relative">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6 group-hover:scale-110">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#081f5c] mb-4 group-hover:text-(--primary) transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed grow">
                {feature.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-8 w-12 h-1 bg-gray-100 group-hover:w-full group-hover:bg-(--primary) transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
