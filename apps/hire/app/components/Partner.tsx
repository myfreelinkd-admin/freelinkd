"use client";

import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    name: "Sagawa Group",
    logo: "/assets/img/sagawa_logo.svg",
    url: "https://sagawagroup.id",
    width: 180,
    height: 60,
  },
  {
    name: "SMKN 31 Jakarta",
    logo: "/assets/img/smkn31.svg",
    url: "https://www.smkn31jakarta.sch.id/",
    width: 80,
    height: 80,
  },
  {
    name: "AWA Construction",
    logo: "/assets/img/awa_contruction_logo.svg",
    url: "https://awa-construction.vercel.app/",
    width: 160,
    height: 60,
  },
];

export default function Partner() {
  return (
    <section className="w-full py-16 bg-[--background] border-y border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#ff6f00] uppercase">
              Trusted By
            </h2>
            <h2 className="text-4xl font-bold text-[#081f5c]">
              Our Strategic Partners
            </h2>
          </div>

          {/* Partners Grid */}
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 hover:opacity-100 transition-opacity duration-500">
            {partners.map((partner) => (
              <Link
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 bg-[#081f5c]/5 rounded-full blur-2xl scale-0 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative filter grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.width}
                    height={partner.height}
                    className="object-contain h-12 md:h-16 w-auto"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
