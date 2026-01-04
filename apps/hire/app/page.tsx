import { SecondaryNavbar } from "./components/layout/secondary-navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import Services from "./components/Services";
import Partner from "./components/Partner";
import RatingSection from "./components/Rating";
import CallAction from "./components/CallAction";
import { Footer } from "./components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-(--background)">
      <SecondaryNavbar title="Hire Freelancer" />
      <HeroSection />
      <AboutSection />
      <Services />
      <RatingSection />
      <CallAction />
      <Partner />
      <Footer />
    </main>
  );
}
