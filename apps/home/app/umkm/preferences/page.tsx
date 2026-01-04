import Sidebar from "@/app/components/dashboard/umkm/layout/sidebar";
import Navbar from "@/app/components/dashboard/umkm/layout/navbar";
import Preferences from "@/app/components/dashboard/umkm/contents/preferences";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-(--background)">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <Preferences />
        </main>
      </div>
    </div>
  );
}
