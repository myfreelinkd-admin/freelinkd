import Sidebar from "@/app/components/dashboard/freelancer/layout/sidebar";
import Navbar from "@/app/components/dashboard/freelancer/layout/navbar";
import Community from "@/app/components/dashboard/freelancer/contents/community/community";

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex bg-(--background)">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-(--primary)">
              Freelancer Communities
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              Connect with experts, share knowledge, and find your tribe.
            </p>
          </div>

          <Community />
        </main>
      </div>
    </div>
  );
}
