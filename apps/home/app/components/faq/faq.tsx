"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is Freelinkd?",
    answer:
      "Freelinkd is an innovative platform that bridges the gap between talented students seeking real-world work experience and Micro, Small, and Medium Enterprises (MSMEs) in need of quality talent for business development. We provide a flexible and mutually beneficial framework for both parties.",
  },
  {
    question: "Why focus specifically on students and Gen Z?",
    answer:
      "Quality is ensured through a multi-layered approach. First, our verification process serves as an initial filter for serious, committed talent. Second, our transparent review system allows you to see feedback from previous clients. Finally, we encourage clear and detailed project briefs to ensure that expectations are perfectly aligned from the very beginning.",
  },
  {
    question: "I am a student. Why should I join Freelinkd?",
    answer:
      "Freelinkd offers students a unique opportunity to gain real-world experience while working on meaningful projects. By joining our platform, you can connect with MSMEs looking for fresh talent and innovative ideas. This is your chance to build a portfolio, earn income, and make valuable industry connections all while contributing to exciting projects that align with your skills and interests.",
  },
  {
    question: "How does Freelinkd support its freelancers?",
    answer:
      "Freelinkd is committed to supporting its freelancers in several ways. We provide a user-friendly platform that connects you with potential clients and projects that match your skills. Our transparent review system allows you to build a strong profile based on client feedback, which can help you secure more opportunities. Additionally, we offer resources and guidance to help you succeed in your freelance career.",
  },
  {
    question: "How are payments processed?",
    answer:
      "To ensure fairness and security for both parties, we utilize an escrow system. When a client funds a project, the payment is held securely by Freelinkd. It is only released to the freelancer after the client has received and approved the final work. This system protects clients from unsatisfactory results and guarantees freelancers will be paid for their completed work.",
  },
  {
    question:
      "What happens if there is a disagreement or I am not satisfied with the work?",
    answer:
      "In the event of a disagreement or dissatisfaction with the work, Freelinkd encourages open communication between clients and freelancers to resolve issues amicably. If a resolution cannot be reached, our support team is available to mediate and help find a fair solution. Additionally, the escrow system provides a layer of protection for both parties, ensuring that payments are only released when the client is satisfied with the work delivered.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Answers to common questions about our platform and services.
          </p>
        </motion.div>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="py-2"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between py-6 text-left group transition-colors cursor-pointer"
                aria-expanded={openIndex === index}
              >
                <span
                  className={`text-lg sm:text-lg font-medium pr-8 transition-colors duration-300 ${
                    openIndex === index
                      ? "text-[var(--primary)]"
                      : "text-gray-800 group-hover:text-[var(--primary)]"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-colors duration-300 ${
                      openIndex === index
                        ? "text-[var(--primary)]"
                        : "text-gray-400 group-hover:text-[var(--primary)]"
                    }`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    <div className="pb-8 text-gray-600 leading-relaxed text-base pt-0">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 relative overflow-hidden rounded-3xl bg-[var(--primary)] text-white text-center p-12 sm:p-16 shadow-2xl"
        >
          {/* Subtle background flair */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--secondary)] opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 tracking-tight">
              Still have questions?
            </h3>
            <p className="mb-10 text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Can't find the answer you're looking for? Please contact our team.
            </p>
            <a
              href="https://freelinkd.com#contact"
              className="inline-flex items-center justify-center group bg-[var(--secondary)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-[10px_20px_10px_20px] gap-2 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
