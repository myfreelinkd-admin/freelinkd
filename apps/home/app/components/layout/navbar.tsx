"use client";

import { useState, useEffect } from "react";
import { LogIn, Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Featured", href: "#featured" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine active section
      const scrollPosition = window.scrollY + 100;

      for (const link of navLinks) {
        const sectionId = link.href.substring(1);
        const element = document.getElementById(sectionId);

        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle smooth scrolling to sections
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove the # symbol
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offsetTop = targetElement.offsetTop;
      const navbarHeight = 80; // Approximate height of the navbar

      window.scrollTo({
        top: offsetTop - navbarHeight,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Determine navbar style based on state
  const isCapsule = isScrolled || isMobileMenuOpen;

  return (
    <>
      <nav
        className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          isCapsule
            ? "top-5 w-[95%] max-w-6xl bg-(--primary) shadow-xl rounded-full py-3 px-6"
            : "top-0 w-full bg-transparent py-6 px-6"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="#home"
                className="inline-block"
                onClick={(e) => scrollToSection(e, "#home")}
              >
                <Image
                  src="/assets/freelinkd.svg"
                  alt="Freelinkd Logo"
                  width={100}
                  height={40}
                  className="h-10 w-auto transition-all duration-300"
                  priority
                />
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`${isCapsule ? "text-white" : "text-white"} ${
                    activeSection === link.href.substring(1)
                      ? "text-(--secondary)"
                      : "hover:text-(--secondary)"
                  } transition-colors duration-200 font-medium cursor-pointer`}
                  onClick={(e) => scrollToSection(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Sign-in Button */}
            <div className="hidden md:block">
              <button className="group bg-(--secondary) hover:opacity-90 text-white font-semibold px-6 py-2 rounded-[10px_20px_10px_20px] flex items-center gap-2 transition-colors duration-200 cursor-pointer">
                Sign-in
                <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="focus:outline-none transition-colors duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-8 h-8 text-white" />
                ) : (
                  <Menu
                    className={`w-8 h-8 ${isScrolled ? "text-white" : "text-(--background)"}`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-6xl transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "top-24 opacity-100 visible"
            : "top-20 opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="bg-(--primary) rounded-3xl p-6 shadow-2xl flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 ${
                activeSection === link.href.substring(1)
                  ? "bg-(--secondary) font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {link.name}
            </a>
          ))}

          <div className="mt-4 pt-4 border-t border-white/10">
            <button className="w-full bg-(--secondary) hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer">
              SignIn
              <LogIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
