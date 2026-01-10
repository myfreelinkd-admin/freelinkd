"use client";

import AdminLayoutWrapper from "@/app/components/dashboard/admin/layout/admin-layout-wrapper";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import PreferencesAdmin from "@/app/components/dashboard/admin/preferences/preferences-admin";

function PreferencesContent() {
  return (
    <div className="flex bg-gray-50/50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <PreferencesAdmin />
        </main>
      </div>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <AdminLayoutWrapper>
      <PreferencesContent />
    </AdminLayoutWrapper>
  );
}
