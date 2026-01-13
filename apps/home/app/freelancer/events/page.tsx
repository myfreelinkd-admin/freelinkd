import Sidebar from "@/app/components/dashboard/freelancer/layout/sidebar";
import Navbar from "@/app/components/dashboard/freelancer/layout/navbar";
import Events from "@/app/components/dashboard/freelancer/contents/events/events";
import FreelancerProtectedRoute from "@/app/components/auth/freelancer-protected-route";

export default function EventsPage() {
  return (
    <FreelancerProtectedRoute>
      <div className="min-h-screen flex bg-(--background)">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 max-w-400 mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-(--primary)">
                Upcoming Events
              </h1>
              <p className="text-gray-400 mt-1 font-medium">
                Expand your network, learn new skills, and grow your freelance
                career.
              </p>
            </div>

            <Events />
          </main>
        </div>
      </div>
    </FreelancerProtectedRoute>
  );
}
