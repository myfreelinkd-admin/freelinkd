"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function PortfolioSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const portfolios = [
    {
      title: "Sagawa Group Website",
      author: "Group Pemburu Ijazah",
      description:
        "Sagawa Group is a Food & Beverage franchise specializing in authentic Japanese cuisine. We offer a modern dining experience that honors traditional flavors, creating a unique culinary destination for customers.",
      image: "/assets/img/sgw.png",
    },
    {
      title: "G7KAIH - SMKN 31",
      author: "Alvin",
      description:
        "A modern platform to support and track the 7 kebiasaan Anak Indonesia Hebat initiative.",
      image: "/assets/img/7kaih.png",
    },
    {
      title: "AWA Construction",
      author: "Group Pemburu Ijazah",
      description:
        "AWA Construction is a subsidiary of Sagawa Group, specializing in construction and building projects with a commitment to quality, precision, and timely delivery. Leveraging the integrity and excellence of its parent company, AWA Construction brings reliable infrastructure solutions to support both commercial and community development.",
      image: "/assets/img/awacons.png",
    },
    {
      title: "Sagawa Group Website",
      author: "Group Pemburu Ijazah",
      description:
        "Sagawa Group is a Food & Beverage franchise specializing in authentic Japanese cuisine. We offer a modern dining experience that honors traditional flavors, creating a unique culinary destination for customers.",
      image: "/assets/img/sgw.png",
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(scrollLeft / maxScroll);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !barRef.current || !scrollRef.current) return;
      e.preventDefault();

      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;

      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      scrollRef.current.scrollLeft = maxScroll * percentage;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleBarMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (barRef.current && scrollRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const { scrollWidth, clientWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) * percentage;
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 400; // Adjust scroll amount as needed
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section id="portfolio" className="py-12 md:py-20 bg-(--background)">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Portfolio Freelancer
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Explore the impressive portfolios of our talented freelancers. Each
            project showcases their skills, creativity, and dedication to
            delivering exceptional results.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="group/btn absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg text-gray-800 hover:bg-(--primary) hover:text-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 block cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 transition-transform duration-300" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="group/btn absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg text-gray-800 hover:bg-(--primary) hover:text-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 block cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 transition-transform duration-300" />
          </button>

          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 md:gap-8 pb-12 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {portfolios.map((item, index) => (
              <div
                key={index}
                className="min-w-[85vw] md:min-w-95 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 snap-center flex flex-col overflow-hidden border border-gray-100"
              >
                {/* Image Container */}
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                    priority={index === 0}
                  />
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col grow text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mb-6">
                    {item.author}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator / Progress Bar */}
          <div
            ref={barRef}
            className="w-full h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden max-w-xs mx-auto cursor-pointer relative"
            onMouseDown={handleBarMouseDown}
          >
            <div
              className="h-full bg-(--primary) rounded-full absolute top-0 left-0"
              style={{
                width: "33.33%",
                left: `${scrollProgress * (100 - 33.33)}%`,
                transition: isDragging ? "none" : "left 0.1s ease-out",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
