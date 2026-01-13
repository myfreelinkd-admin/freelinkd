import type { Metadata } from "next";
import { Poppins, Unbounded } from "next/font/google";
import "./globals.css";
import Chatbot from "./components/bot/Chatbot";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.freelinkd.com"),
  applicationName: "Freelinkd",
  title: {
    default: "Join as a Freelancer | Freelinkd",
    template: "%s | Freelinkd",
  },
  description:
    "Freelinkd connects businesses with vetted freelance professionals for technology, creative, marketing, and operations projects.",
  keywords: [
    "freelancers",
    "hire freelancers",
    "freelance platform",
    "SME",
    "freelinkd",
    "remote talent",
    "freelance marketplace",
    "hire remote workers",
    "freelancer connections",
    "professional services",
    "remote work solutions",
    "contract work",
    "freelance jobs",
    "SME support",
    "business solutions",
    "bakrie university",
    "universitas bakrie",
    "about freelinkd",
    "hire talent",
    "join freelinkd",
    "freelinkd event",
    "freelinkd services",
    "freelinkd contact",
    "community",
    "freelinkd community",
    "post projects",
    "collaborate at scale",
    "top freelancers",
    "vetted professionals",
    "business growth",
    "talent acquisition",
    "project outsourcing",
    "digital nomads",
    "gig economy",
    "work from anywhere",
    "flexible work solutions",
    "creative professionals",
    "tech freelancers",
    "marketing freelancers",
    "design freelancers",
    "writing freelancers",
    "development freelancers",
    "consulting services",
    "freelance consulting",
    "business networking",
    "professional networking",
    "freelinkd blog",
    "industry insights",
    "freelance tips",
    "career advice",
    "freelinkd reviews",
    "client testimonials",
    "success stories",
    "freelinkd partners",
    "affiliate program",
    "referral program",
    "freelinkd support",
    "customer service",
    "help center",
    "faqs",
  ],
  authors: [
    {
      name: "Freelinkd Team",
      url: "https://www.freelinkd.com",
    },
  ],
  creator: "Freelinkd Team",
  publisher: "Freelinkd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Join as a Freelancer | Freelinkd",
    description:
      "Freelinkd connects businesses with vetted freelance professionals for technology, creative, marketing, and operations projects.",
    url: "https://www.freelinkd.com/join",
    siteName: "Freelinkd",
    images: [
      {
        url: "https://www.freelinkd.com/assets/logoid.png",
        width: 1200,
        height: 630,
        alt: "Freelinkd Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join as a Freelancer | Freelinkd",
    description:
      "Freelinkd is a trusted platform to find and manage top freelance talent in Indonesia.",
    images: ["https://www.freelinkd.com/assets/logoid.png"],
    creator: "@freelinkd",
    site: "@freelinkd",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=20241009", sizes: "32x32" },
      {
        url: "/favicon-96x96.png?v=20241009",
        sizes: "96x96",
        type: "image/png",
      },
      { url: "/favicon.svg?v=20241009", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=20241009",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "XaAh4-hK0ZXk8HjqWJgKRxRy1XiEoDa6Prh97ss3",
    yandex: "a8b99daeab6b99b7",
    other: {
      bing: "8C6C1DAD00F1E6AEF1F5D9A37EA3B6C4",
    },
  },
  category: "technology",
  alternates: {
    canonical: "https://www.freelinkd.com/join",
    types: {
      "application/rss+xml": [
        {
          url: "https://www.freelinkd.com/feed.xml",
          title: "Freelinkd RSS Feed",
        },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${unbounded.variable}`}>
      <body className="antialiased">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
