import { SecondaryNavbar } from "@repo/ui/secondary-navbar";
import { ReportSection } from "../components/report/report-section";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#f9fcff]">
      <SecondaryNavbar title="Report Issue" href="/" />
      <ReportSection />
    </main>
  );
}
