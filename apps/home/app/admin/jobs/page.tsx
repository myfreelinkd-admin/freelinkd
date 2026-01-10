"use client";

import AdminLayoutWrapper from "@/app/components/dashboard/admin/layout/admin-layout-wrapper";
import AdminManageProjects from "@/app/components/dashboard/admin/project/manage-projects";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";

function JobsContent() {
  return (
    <div className="flex bg-gray-50/50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
           <AdminManageProjects />
        </main>
      </div>
    </div>
  );
}

export default function AdminJobsPage() {
  return (
    <AdminLayoutWrapper>
      <JobsContent />
    </AdminLayoutWrapper>
  );
}
