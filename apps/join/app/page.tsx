import HeroSection from "./components/HeroSection";
import Step from "./components/Step";
import AboutSection from "./components/AboutSection";
import CallAction from "./components/CallAction";
import { SecondaryNavbar } from "./components/layout/secondary-navbar";
import { Footer } from "./components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SecondaryNavbar title="Join as Freelancer" />
      <main>
        <HeroSection />
        <Step />
        <AboutSection />
        <CallAction />
      </main>
      <div className="w-full h-px bg-gray-100" />
      <Footer />
    </div>
  );
}
