"use client";

import AdminLayoutWrapper from "@/app/components/dashboard/admin/layout/admin-layout-wrapper";
import Sidebar from "@/app/components/dashboard/admin/layout/sidebar";
import Navbar from "@/app/components/dashboard/admin/layout/navbar";
import BotManage from "@/app/components/dashboard/admin/contents/bot/bot-manage";
import ImportBot from "@/app/components/dashboard/admin/contents/bot/import-bot";
import { useBotLogic } from "@/app/components/dashboard/admin/contents/bot/logic-bot";

function BotContent() {
  const logic = useBotLogic();

  return (
    <div className="flex h-screen bg-[#f9fcff] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-(--primary)">Bot Management</h1>
              <p className="text-gray-500 text-sm mt-1">
                Configure and train your intelligent assistant bot.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-fit min-h-[600px]">
              {/* Left Column: Input Form (4/12 width) */}
              <div className="lg:col-span-5 flex flex-col h-full">
                {/* Ensure BotManage fills height or at least looks consistent */}
                <BotManage logic={logic} />
              </div>

              {/* Right Column: Actions & Queue (8/12 width) */}
              <div className="lg:col-span-7 flex flex-col h-full">
                <ImportBot logic={logic} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function BotManagementPage() {
  return (
    <AdminLayoutWrapper>
      <BotContent />
    </AdminLayoutWrapper>
  );
}
