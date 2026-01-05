import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Chatbot from "./components/bot/Chatbot";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Freelinkd",
  description: "Connect with Top Freelancers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
