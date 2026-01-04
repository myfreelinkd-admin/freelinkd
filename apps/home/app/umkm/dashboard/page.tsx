import Sidebar from "@/app/components/dashboard/umkm/layout/sidebar";
import Navbar from "@/app/components/dashboard/umkm/layout/navbar";
import Greetings from "@/app/components/dashboard/umkm/contents/greetings";
import Projects from "@/app/components/dashboard/umkm/contents/projects";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-(--background)">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-400 mx-auto w-full">
          <Greetings />
          <Projects />
        </main>
      </div>
    </div>
  );
}
