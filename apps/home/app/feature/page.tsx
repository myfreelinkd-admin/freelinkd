import { SecondaryNavbar } from "../components/layout/secondary-navbar";
import ListSection from "../components/feature/ListSection";
import { Footer } from "../components/layout/footer";

export default function FeaturePage() {
  return (
    <main className="min-h-screen bg-white">
      <SecondaryNavbar title="Featured" />
      <div className="pb-32">
        <ListSection />
      </div>
      <Footer />
    </main>
  );
}
