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
  title: "Join Became Freelancers",
  description: "Freelinkd - Connect with Top Freelancers",
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
