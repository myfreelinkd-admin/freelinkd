"use client";

import { SecondaryNavbar } from "../components/layout/secondary-navbar";
import FAQ from "../components/faq/faq";
import { Footer } from "../components/layout/footer";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SecondaryNavbar title="Frequently Asked Questions" />
      <main className="flex-grow">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
