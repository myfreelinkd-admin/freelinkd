import Navbar from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import HeroSection from "./components/main/HeroSection";
import AboutSection from "./components/main/AboutSection";
import PortfolioSection from "./components/main/PortfolioSection";
import FeatureSection from "./components/main/FeatureSection";
import ContactSection from "./components/main/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <div>
        <AboutSection />
        <PortfolioSection />
        <FeatureSection />
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
