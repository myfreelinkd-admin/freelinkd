"use client";

import AdminLayoutWrapper from "@/app/components/dashboard/admin/layout/admin-layout-wrapper";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import AdminManageCommunity from "@/app/components/dashboard/admin/contents/community/community";

function CommunityContent() {
  return (
    <div className="flex h-screen bg-[#f9fcff] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <AdminManageCommunity />
        </main>
      </div>
    </div>
  );
}

export default function AdminCommunityPage() {
  return (
    <AdminLayoutWrapper>
      <CommunityContent />
    </AdminLayoutWrapper>
  );
}
