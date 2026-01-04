import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

interface SocialLink {
  href: string;
  icon: FC<{ className?: string }>;
  label: string;
}

interface FooterLink {
  href: string;
  label: string;
}

export const Footer: FC = () => {
  const socialLinks: SocialLink[] = [
    {
      href: "https://facebook.com",
      icon: Facebook,
      label: "Facebook",
    },
    {
      href: "https://www.instagram.com/freelinkd/",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://twitter.com",
      icon: Twitter,
      label: "Twitter",
    },
    {
      href: "https://linkedin.com",
      icon: Linkedin,
      label: "LinkedIn",
    },
  ];

  const footerLinks: FooterLink[] = [{ href: "/faq", label: "F.A.Q" }];

  return (
    <div className="bg-(--primary) text-white w-full px-6 pt-16">
      <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        <div className="sm:col-span-2">
          <Link
            href="/"
            aria-label="Go home"
            title="Freelinkd"
            className="inline-flex items-center"
          >
            <Image
              src="/assets/freelinkd.svg"
              alt="Freelinkd Logo"
              width={120}
              height={80}
              className="max-h-20 w-auto"
              priority
            />
          </Link>
          <div className="mt-6 lg:max-w-sm">
            <p className="text-sm text-gray-200">
              Kickstart your professional journey with meaningful projects.
              Build your portfolio, earn an income, and connect with innovative
              SMEs ready to hire emerging talent.
            </p>
            <p className="mt-4 text-sm text-gray-200">
              Tap into a verified network of ambitious, digitally native
              students and Gen Z professionals. The fresh perspective your
              project needs is on Freelinkd.
            </p>
          </div>
        </div>

        {/* Kontak */}
        <div className="space-y-2 text-sm">
          <p className="text-base font-bold tracking-wide text-white">
            Contacts
          </p>
          <div className="flex">
            <p className="mr-1 text-gray-200">Phone:</p>
            <a
              href="tel:+6282210724470"
              className="transition-colors duration-300 text-gray-100 hover:text-gray-300"
            >
              +62 822-1072-4470
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-gray-200">Email:</p>
            <a
              href="mailto:info.freelinkd@gmail.com"
              className="transition-colors duration-300 text-gray-100 hover:text-gray-300"
            >
              info.freelinkd@gmail.com
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-gray-200">Address:</p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 text-gray-100 hover:text-gray-300"
            >
              Jl. H. R. Rasuna Said No.22 Kav. C
            </a>
          </div>
        </div>

        {/* Social */}
        <div>
          <span className="text-base font-bold tracking-wide text-white">
            Social
          </span>
          <div className="flex mt-4 space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group"
                >
                  <IconComponent className="w-5 h-5 text-gray-300 hover:text-white transition-colors group-hover:scale-110 transform duration-200" />
                </a>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Connect with fellow creators and independent professionals. Follow
            us to grow your network.
          </p>
        </div>
      </div>

      {/* Bagian Bawah */}
      <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t border-gray-600 lg:flex-row max-w-7xl mx-auto">
        <p className="text-sm text-gray-300">
          &copy; Copyright 2026 Freelinkd. All rights reserved.
        </p>
        <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-gray-300 hover:text-gray-100 transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
