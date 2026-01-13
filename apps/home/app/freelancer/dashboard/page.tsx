import Sidebar from "@/app/components/dashboard/freelancer/layout/sidebar";
import Navbar from "@/app/components/dashboard/freelancer/layout/navbar";
import Greetings from "@/app/components/dashboard/freelancer/contents/dashboard/greetings";
import PreviewPanel from "@/app/components/dashboard/freelancer/contents/dashboard/preview-panel";
import FreelancerProtectedRoute from "@/app/components/auth/freelancer-protected-route";
export default function Page() {
  return (
    <FreelancerProtectedRoute>
      <div className="min-h-screen flex bg-(--background)">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 max-w-400 mx-auto w-full">
            <Greetings />
            <PreviewPanel />
          </main>
        </div>
      </div>
    </FreelancerProtectedRoute>
  );
}
