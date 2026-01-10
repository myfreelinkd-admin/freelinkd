"use client";

import AdminLayoutWrapper from "@/app/components/dashboard/admin/layout/admin-layout-wrapper";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import Greetings from "@/app/components/dashboard/admin/contents/dashboard/greetings";
import PreviewCommunity from "@/app/components/dashboard/admin/contents/dashboard/preview-community";
import PreviewEvent from "@/app/components/dashboard/admin/contents/dashboard/preview-event";
import PreviewFreelancer from "@/app/components/dashboard/admin/contents/dashboard/preview-freelancer";

function DashboardContent() {
  return (
    <div className="min-h-screen flex bg-(--background)">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <Greetings />
          {/* Middle Section: Community & Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PreviewCommunity />
            <PreviewEvent />
          </div>

          {/* Bottom Section: Freelancer List */}
          <div className="mt-8">
            <PreviewFreelancer />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayoutWrapper>
      <DashboardContent />
    </AdminLayoutWrapper>
  );
}
