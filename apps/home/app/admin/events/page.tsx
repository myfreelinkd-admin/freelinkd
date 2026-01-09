import EventsManagement from "@/app/components/dashboard/admin/event/events-section";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";

export default function AdminEventsPage() {
  return (
    <div className="flex min-h-screen bg-[#f9fcff]">
      <Sidebar />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <EventsManagement />
        </main>
      </div>
    </div>
  );
}
