import { SecondaryNavbar } from "@repo/ui/secondary-navbar";
import { ResetPasswordSection } from "../components/reset-password/reset-pass";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f9fcff]">
      <SecondaryNavbar title="Reset Password" href="/" />
      <ResetPasswordSection />
    </main>
  );
}
