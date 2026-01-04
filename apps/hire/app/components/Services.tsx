"use client";

import {
  Calculator,
  ChartNoAxesCombined,
  Languages,
  Pencil,
  Figma,
  CodeXml,
} from "lucide-react";

const features = [
  {
    title: "Financial Reports",
    description:
      "Professional financial analysis and reporting services tailored for SMEs handling Excel-based bookkeeping, external audit preparation, and the creation of accurate balance sheets and income statements.",
    icon: Calculator,
    color: "blue",
  },
  {
    title: "Business Strategy",
    description:
      "Strategic advisory powered by data: we help businesses analyze performance, build reliable sales forecasts, and make forward looking decisions with actionable insights.",
    icon: ChartNoAxesCombined,
    color: "orange",
  },
  {
    title: "Translation Services",
    description:
      "Accurate and context aware translation for academic, business, and diplomatic needs covering scientific papers, journals, proposals, and official documents.",
    icon: Languages,
    color: "blue",
  },
  {
    title: "Copywriting",
    description:
      "Precision-crafted content for impact: from academic writing support to SEO-optimized marketing copy and engaging video scripts that align with your voice.",
    icon: Pencil,
    color: "orange",
  },
  {
    title: "Design & Animation",
    description:
      "End-to-end visual solutions from intuitive UI/UX and interior space planning to dynamic animated videos that transform concepts into immersive experiences.",
    icon: Figma,
    color: "blue",
  },
  {
    title: "Web Development",
    description:
      "Custom digital solutions built for business: responsive landing pages and functional web applications designed to streamline operations and scale with growth.",
    icon: CodeXml,
    color: "orange",
  },
];

export default function Services() {
  return (
    <section className="w-full py-24 px-6 lg:px-20 bg-[#f9fcff] relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#081f5c 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#081f5c] mb-6">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Find the exact skill you need, right when you need it. From web
            development to digital marketing, browse our service categories to
            connect with the perfect professional for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-4xl p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_-10px_rgba(8,31,92,0.15)] transition-all duration-500 ease-out cursor-pointer border border-gray-100 hover:border-blue-200 flex flex-col h-full overflow-hidden"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="mb-10 relative">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 shadow-sm group-hover:shadow-xl">
                  <feature.icon size={36} strokeWidth={1.5} />
                </div>
                {/* Decorative elements around icon */}
                <div className="absolute -top-3 -left-3 w-20 h-20 bg-blue-100/40 rounded-2xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-100/50 rounded-full -z-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
              </div>

              <h3 className="text-2xl font-bold text-[#081f5c] mb-5 group-hover:text-(--primary) transition-colors duration-300 text-[1.35rem]">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-10 grow text-[1.05rem]">
                {feature.description}
              </p>

              {/* Hover Background Pattern */}
              <div className="absolute -bottom-6 -right-6 opacity-0 group-hover:opacity-[0.07] transition-all duration-700 pointer-events-none transform group-hover:scale-150 group-hover:-rotate-12">
                <feature.icon size={180} strokeWidth={1} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
